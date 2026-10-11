import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { media } from "@/lib/media";

export const SITE_URL = "https://www.villaserenamarrakech.com";
const DEFAULT_OG = media("/hero-main.jpg");

/**
 * Per-page metadata from the `seo.<page>` messages: keyword-led title and description,
 * canonical + hreflang (fr / en / x-default) and Open Graph with a share image.
 */
export async function pageMetadata({
  locale,
  page,
  path,
  image = DEFAULT_OG,
  index = true,
}: {
  locale: string;
  page: string;
  /** Path after the locale, e.g. "/suites" ("" for the homepage). */
  path: string;
  image?: string;
  index?: boolean;
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "seo" });
  const title = t(`${page}.title`);
  const description = t(`${page}.description`);
  const url = `${SITE_URL}/${locale}${path}`;

  return {
    // Titles already carry the brand, so bypass the layout's "%s | Villa Serena Marrakech" template.
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: {
        fr: `${SITE_URL}/fr${path}`,
        en: `${SITE_URL}/en${path}`,
        "x-default": `${SITE_URL}/fr${path}`,
      },
    },
    openGraph: {
      type: "website",
      siteName: "Villa Serena Marrakech",
      locale: locale === "en" ? "en_US" : "fr_FR",
      title,
      description,
      url,
      images: [{ url: image }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    robots: index ? undefined : { index: false, follow: true },
  };
}
