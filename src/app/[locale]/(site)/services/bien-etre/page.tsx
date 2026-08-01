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
    title: t("bienEtre.page_title"),
    description: t("bienEtre.page_sub"),
    alternates: {
      canonical: `https://www.villaserenamarrakech.com/${locale}/services/bien-etre`,
      languages: {
        fr: "https://www.villaserenamarrakech.com/fr/services/bien-etre",
        en: "https://www.villaserenamarrakech.com/en/services/bien-etre",
      },
    },
    openGraph: { images: [{ url: "https://www.villaserenamarrakech.com/exp-hammam.jpg" }] },
  };
}

export default async function BienEtrePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "services" });

  return (
    <ServiceCategoryPage
      titleKey="services.bienEtre.page_title"
      subKey="services.bienEtre.page_sub"
      categories={["wellness"]}
      heroImage="/exp-hammam.jpg"
      locale={locale}
      related={[
        {
          label: t("restauration.page_title"),
          sub: t("restauration.page_sub"),
          href: "/services/restauration",
          image: "/exp-cuisine.jpg",
        },
        {
          label: t("excursions.page_title"),
          sub: t("excursions.page_sub"),
          href: "/services/excursions",
          image: "/exp-badminton.jpg",
        },
      ]}
    />
  );
}
