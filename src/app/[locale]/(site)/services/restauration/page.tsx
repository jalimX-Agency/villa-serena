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
    title: t("restauration.page_title"),
    description: t("restauration.page_sub"),
    alternates: {
      canonical: `https://www.villaserenamarrakech.com/${locale}/services/restauration`,
      languages: {
        fr: "https://www.villaserenamarrakech.com/fr/services/restauration",
        en: "https://www.villaserenamarrakech.com/en/services/restauration",
      },
    },
    openGraph: { images: [{ url: "https://www.villaserenamarrakech.com/exp-cuisine.jpg" }] },
  };
}

export default async function RestaurationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "services" });

  return (
    <ServiceCategoryPage
      titleKey="services.restauration.page_title"
      subKey="services.restauration.page_sub"
      categories={["dining"]}
      heroImage="/exp-cuisine.jpg"
      locale={locale}
      related={[
        {
          label: t("bienEtre.page_title"),
          sub: t("bienEtre.page_sub"),
          href: "/services/bien-etre",
          image: "/exp-hammam.jpg",
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
