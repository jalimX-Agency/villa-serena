/** Public base URL of the R2 bucket (exposed to the client via next.config `env`). */
const BASE = (process.env.NEXT_PUBLIC_MEDIA_URL ?? "").replace(/\/$/, "");

/** Absolute URL for a static site asset stored in R2 under `site/`, e.g. media("/hero-main.jpg"). */
export function media(path: string) {
  return `${BASE}/site${path}`;
}
