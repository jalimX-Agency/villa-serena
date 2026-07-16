import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "always",
  // French is the primary market — don't let the browser's Accept-Language
  // header override it for first-time visitors. A manual language switch
  // still sticks on return visits via the locale cookie.
  localeDetection: false,
});
