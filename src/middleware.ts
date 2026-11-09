import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const res = intl(req);
  // Preview address (vercel.app): no page may be indexed, to avoid duplicate content.
  // A response header applies to static and dynamic pages alike.
  if (req.headers.get("host")?.endsWith(".vercel.app")) res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
