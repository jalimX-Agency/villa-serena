"use client";
/**
 * Cookie consent, stored in the "vs_consent" cookie for 6 months (cookie policy, technical rules 1–4).
 * Nothing optional (Google Maps, Google Analytics) loads before the visitor has said yes.
 */
import { useMemo, useSyncExternalStore } from "react";

export type Consent = { maps: boolean; analytics: boolean; date: string };

export const CONSENT_COOKIE = "vs_consent";
const MAX_AGE = 60 * 60 * 24 * 182; // 6 months
const CHANGE = "vs-consent-change";
const OPEN = "vs-consent-open";

function rawConsent() {
  if (typeof document === "undefined") return "";
  const raw = document.cookie.split("; ").find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  return raw ? raw.slice(CONSENT_COOKIE.length + 1) : "";
}

function parseConsent(raw: string): Consent | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(decodeURIComponent(raw));
    return { maps: !!v.maps, analytics: !!v.analytics, date: String(v.date ?? "") };
  } catch {
    return null;
  }
}

export function readConsent(): Consent | null {
  return parseConsent(rawConsent());
}

/** Current consent, re-rendering when it changes (null before any choice, and on the server). */
export function useConsent(): Consent | null {
  const raw = useSyncExternalStore((cb) => onConsentChange(cb), rawConsent, () => "");
  return useMemo(() => parseConsent(raw), [raw]);
}

export function writeConsent(choice: { maps: boolean; analytics: boolean }) {
  const value: Consent = { ...choice, date: new Date().toISOString() };
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(value))}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent(CHANGE, { detail: value }));
}

/** Subscribe to consent changes (returns the unsubscribe function). */
export function onConsentChange(fn: (c: Consent) => void) {
  const handler = (e: Event) => fn((e as CustomEvent<Consent>).detail);
  window.addEventListener(CHANGE, handler);
  return () => window.removeEventListener(CHANGE, handler);
}

/** "Gérer mes cookies": reopens the banner. */
export function openConsentBanner() {
  window.dispatchEvent(new Event(OPEN));
}

export function onConsentOpen(fn: () => void) {
  window.addEventListener(OPEN, fn);
  return () => window.removeEventListener(OPEN, fn);
}
