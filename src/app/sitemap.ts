import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { db } from "@/lib/db";

const BASE = "https://www.villaserenamarrakech.com";

const ROUTES = [
  { path: "", priority: 1.0 },
  { path: "/la-villa", priority: 0.8 },
  { path: "/suites", priority: 0.9 },
  { path: "/reservation", priority: 0.9 },
  { path: "/services", priority: 0.7 },
  { path: "/experiences", priority: 0.8 },
  { path: "/galerie", priority: 0.7 },
  { path: "/contact", priority: 0.8 },
];

function entry(path: string, priority: number) {
  return routing.locales.map((locale) => ({
    url: `${BASE}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority,
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${BASE}/${l}${path}`])),
    },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rooms = await db.room.findMany({ select: { slug: true } }).catch(() => []);

  const staticEntries = ROUTES.flatMap(({ path, priority }) => entry(path, priority));
  const roomEntries = rooms.flatMap((room) => entry(`/suites/${room.slug}`, 0.7));

  return [...staticEntries, ...roomEntries];
}
