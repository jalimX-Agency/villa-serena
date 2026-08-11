import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ServiceCategoryPage } from "@/components/ServiceCategoryPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return {
    title: t("excursions.page_title"),
    description: t("excursions.page_sub"),
    alternates: {
      canonical: `https://www.villaserenamarrakech.com/${locale}/services/excursions`,
      languages: {
        fr: "https://www.villaserenamarrakech.com/fr/services/excursions",
        en: "https://www.villaserenamarrakech.com/en/services/excursions",
      },
    },
    openGraph: { images: [{ url: "https://www.villaserenamarrakech.com/exp-badminton.jpg" }] },
  };
}

export default async function ExcursionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "services" });

  return (
    <ServiceCategoryPage
      titleKey="services.excursions.page_title"
      subKey="services.excursions.page_sub"
      introKey="services.excursions.intro"
      statsKey="services.excursions.stats"
      highlightsKey="services.excursions.highlights"
      categories={["outdoor", "leisure"]}
      heroImage="/exp-badminton.jpg"
      locale={locale}
      related={[
        {
          label: t("bienEtre.page_title"),
          sub: t("bienEtre.page_sub"),
          href: "/services/bien-etre",
          image: "/exp-hammam.jpg",
        },
        {
          label: t("restauration.page_title"),
          sub: t("restauration.page_sub"),
          href: "/services/restauration",
          image: "/exp-cuisine.jpg",
        },
      ]}
    />
  );
}
