import { db } from "@/lib/db";

type Headers = Record<string, string | string[] | undefined> | undefined;

const h = (headers: Headers, name: string) => {
  const v = headers?.[name];
  return (Array.isArray(v) ? v[0] : v) ?? "";
};

function safeDecode(v: string) {
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

/** Small, dependency-free user-agent summary — enough for an audit log. */
export function parseUserAgent(ua: string) {
  const device = /iPad|Tablet|Android(?!.*Mobile)/i.test(ua)
    ? "Tablette"
    : /Mobi|iPhone|Android/i.test(ua)
      ? "Mobile"
      : "Ordinateur";

  const os = /Windows NT/i.test(ua)
    ? "Windows"
    : /iPhone|iPad|iPod/i.test(ua)
      ? "iOS"
      : /Android/i.test(ua)
        ? "Android"
        : /Mac OS X/i.test(ua)
          ? "macOS"
          : /Linux/i.test(ua)
            ? "Linux"
            : "";

  // Order matters: Edge and Opera also contain "Chrome", Chrome also contains "Safari".
  const browser = /Edg\//i.test(ua)
    ? "Edge"
    : /OPR\/|Opera/i.test(ua)
      ? "Opera"
      : /Firefox\//i.test(ua)
        ? "Firefox"
        : /Chrome\//i.test(ua)
          ? "Chrome"
          : /Safari\//i.test(ua)
            ? "Safari"
            : "";

  return { device, os, browser };
}

/**
 * Records one admin sign-in attempt. Location comes from the hosting platform's
 * geo headers (Vercel / Cloudflare) — empty in local development.
 * Never throws: a logging failure must not block sign-in.
 */
export async function recordLogin(email: string, success: boolean, headers: Headers) {
  try {
    const userAgent = h(headers, "user-agent").slice(0, 400);
    const ip = (h(headers, "x-forwarded-for").split(",")[0] || h(headers, "x-real-ip")).trim();
    const country = h(headers, "x-vercel-ip-country") || h(headers, "cf-ipcountry");
    const city = safeDecode(h(headers, "x-vercel-ip-city"));
    await db.loginLog.create({
      data: { email: email.slice(0, 200), success, ip, country, city, userAgent, ...parseUserAgent(userAgent) },
    });
  } catch (e) {
    console.error("[login log]", e);
  }
}
