"use client";
import { MapPin } from "lucide-react";
import { readConsent, useConsent, writeConsent } from "@/lib/consent";

/**
 * Google Maps sets cookies as soon as it loads, so the map waits for consent:
 * first a drawn placeholder (no request to Google) with an "Afficher la carte" button.
 */
export function MapConsent({
  src,
  title,
  address,
  buttonLabel,
  note,
  openLabel,
  openHref,
}: {
  src: string;
  title: string;
  address: string;
  buttonLabel: string;
  note: string;
  openLabel: string;
  openHref: string;
}) {
  const allowed = useConsent()?.maps ?? false;

  if (allowed) {
    return (
      <iframe
        title={title}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 h-full w-full grayscale-[30%]"
      />
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_50%_45%,rgba(179,155,110,0.18),transparent_60%)] px-6 text-center">
      <svg aria-hidden viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full opacity-[0.18]">
        <g fill="none" stroke="#D9C9A8" strokeWidth="1">
          <path d="M-10 230 C 80 200, 140 210, 210 160 S 330 90, 420 70" strokeWidth="3" />
          <path d="M60 -10 C 90 80, 120 140, 210 160 S 260 260, 250 320" strokeWidth="2" />
          <path d="M-10 60 C 70 90, 150 50, 230 80 S 360 40, 420 20" />
          <path d="M20 300 C 90 260, 170 280, 260 240 S 380 230, 420 200" />
          <ellipse cx="300" cy="230" rx="70" ry="38" />
          <ellipse cx="300" cy="230" rx="44" ry="22" />
          <ellipse cx="90" cy="110" rx="55" ry="30" />
        </g>
      </svg>
      <MapPin className="relative size-8 text-villa-terracotta-light" />
      <p className="relative font-serif text-xl text-white">{address}</p>
      <button
        type="button"
        onClick={() => writeConsent({ maps: true, analytics: readConsent()?.analytics ?? false })}
        className="relative inline-flex items-center px-5 py-2.5 bg-villa-terracotta hover:brightness-110 text-white font-sans text-[11px] tracking-[0.14em] uppercase transition"
      >
        {buttonLabel}
      </button>
      <p className="relative max-w-xs font-sans text-[11px] leading-relaxed text-white/55">{note}</p>
      <a
        href={openHref}
        target="_blank"
        rel="noopener noreferrer"
        className="relative font-sans text-xs text-villa-sand-light underline underline-offset-2 hover:text-white"
      >
        {openLabel}
      </a>
    </div>
  );
}
