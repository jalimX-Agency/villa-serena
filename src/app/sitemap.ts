import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { db } from "@/lib/db";
import { localizedPath } from "@/lib/paths";

const BASE = "https://www.villaserenamarrakech.com";

const ROUTES = [
  { path: "", priority: 1.0 },
  { path: "/la-villa", priority: 0.8 },
  { path: "/suites", priority: 0.9 },
  { path: "/reservation", priority: 0.9 },
  { path: "/services", priority: 0.7 },
  { path: "/experiences", priority: 0.8 },
  { path: "/galerie", priority: 0.7 },
  { path: "/blog", priority: 0.7 },
  { path: "/contact", priority: 0.8 },
  // Legal pages (Jean-Luc note: they belong in the sitemap).
  { path: "/confidentialite", priority: 0.2 },
  { path: "/cookies", priority: 0.2 },
  { path: "/mentions-legales", priority: 0.2 },
  { path: "/conditions-generales-de-vente", priority: 0.3 },
  { path: "/reglement-interieur", priority: 0.3 },
];

function entry(path: string, priority: number) {
  return routing.locales.map((locale) => ({
    url: `${BASE}/${locale}${localizedPath(path, locale)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority,
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${BASE}/${l}${localizedPath(path, l)}`])),
    },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [rooms, posts] = await Promise.all([
    db.room.findMany({ select: { slug: true } }).catch(() => []),
    db.blogPost.findMany({ where: { published: true }, select: { slug: true } }).catch(() => []),
  ]);

  const staticEntries = ROUTES.flatMap(({ path, priority }) => entry(path, priority));
  const roomEntries = rooms.flatMap((room) => entry(`/suites/${room.slug}`, 0.7));
  const postEntries = posts.flatMap((p) => entry(`/blog/${p.slug}`, 0.6));

  return [...staticEntries, ...roomEntries, ...postEntries];
}
