"use client";
import { openConsentBanner } from "@/lib/consent";

/** Footer link that reopens the cookie banner. */
export function ManageCookiesButton({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" onClick={openConsentBanner} className={className}>
      {label}
    </button>
  );
}
