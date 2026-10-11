import { pageMetadata } from "@/lib/seo";
import { media } from "@/lib/media";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ServiceCategoryPage } from "@/components/ServiceCategoryPage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({ locale, page: "bienEtre", path: "/services/bien-etre", image: media("/exp-massage.jpg") });
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
      introKey="services.bienEtre.intro"
      statsKey="services.bienEtre.stats"
      highlightsKey="services.bienEtre.highlights"
      categories={["wellness"]}
      heroImage={media("/exp-hammam.jpg")}
      locale={locale}
      related={[
        {
          label: t("restauration.page_title"),
          sub: t("restauration.page_sub"),
          href: "/services/restauration",
          image: media("/exp-cuisine.jpg"),
        },
        {
          label: t("excursions.page_title"),
          sub: t("excursions.page_sub"),
          href: "/services/excursions",
          image: media("/exp-badminton.jpg"),
        },
      ]}
    />
  );
}
