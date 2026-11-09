"use client";
import { useEffect } from "react";
import Script from "next/script";
import { useConsent } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

type GaWindow = Window & Record<string, unknown>;

/** Removes the _ga cookies when the visitor withdraws consent. */
function clearGaCookies() {
  const host = location.hostname.replace(/^www\./, "");
  for (const c of document.cookie.split("; ")) {
    const name = c.split("=")[0];
    if (!name.startsWith("_ga")) continue;
    for (const domain of ["", `; domain=.${host}`, `; domain=${location.hostname}`]) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
    }
  }
}

/**
 * Google Analytics 4, loaded only after the visitor accepts audience measurement.
 * Does nothing until NEXT_PUBLIC_GA_ID is set.
 */
export function GoogleAnalytics() {
  const allowed = useConsent()?.analytics ?? false;

  useEffect(() => {
    if (!GA_ID) return;
    const w = window as unknown as GaWindow;
    // A loaded gtag stays in the page (next/script does not unload it): switch it off instead.
    w[`ga-disable-${GA_ID}`] = !allowed;
    // Withdrawal: stop sending and remove the cookies already set.
    if (!allowed) clearGaCookies();
  }, [allowed]);

  if (!GA_ID || !allowed) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
