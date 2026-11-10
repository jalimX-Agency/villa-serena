import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// 301s from the client brief (Nov 2026): rooms became suites, the old independent
// "Suite Bleue" is now "Le Studio" (its slug is reused by the riad's Blue Suite), and
// Services / Expériences are single pages with anchors.
const MOVED: [string, string][] = [
  ["/suites/chambre-rouge", "/suites/suite-rouge"],
  ["/suites/chambre-bleue", "/suites/suite-bleue"],
  ["/suites/chambre-verte", "/suites/suite-verte"],
  ["/suites/chambre-rose", "/suites/suite-rose"],
  ["/services/restauration", "/services#restauration"],
  ["/services/bien-etre", "/services#bien-etre"],
  ["/services/excursions", "/services#activites"],
  ["/experiences/mariages-events", "/experiences#evenements"],
  ["/experiences/golf", "/experiences#golf"],
  ["/experiences/retraites-yoga", "/experiences#retraites"],
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...MOVED.flatMap(([from, to]) =>
        ["fr", "en"].map((l) => ({ source: `/${l}${from}`, destination: `/${l}${to}`, permanent: true }))
      ),
      // Pages with their own English address: never serve the other language's address.
      { source: "/en/la-villa", destination: "/en/the-villa", permanent: true },
      { source: "/fr/the-villa", destination: "/fr/la-villa", permanent: true },
      // Privacy policy: French address in French, English address in English.
      { source: "/en/confidentialite", destination: "/en/privacy", permanent: true },
      { source: "/fr/privacy", destination: "/fr/confidentialite", permanent: true },
    ];
  },
  env: { NEXT_PUBLIC_MEDIA_URL: process.env.R2_ENDPOINT ?? "" },
  experimental: { serverActions: { bodySizeLimit: "4mb" } },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-*.r2.dev",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
