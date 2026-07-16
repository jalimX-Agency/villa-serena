import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const BASE = "https://www.villaserenamarrakech.com";

const ROUTES = [
  { path: "", priority: 1.0 },
  { path: "/la-maison", priority: 0.8 },
  { path: "/chambres", priority: 0.9 },
  { path: "/spa-fitness", priority: 0.7 },
  { path: "/evenements-privatisation", priority: 0.9 },
  { path: "/galerie", priority: 0.6 },
  { path: "/blog", priority: 0.7 },
  { path: "/contact", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.flatMap(({ path, priority }) =>
    routing.locales.map((locale) => ({
      url: `${BASE}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${BASE}/${l}${path}`])
        ),
      },
    }))
  );
}
