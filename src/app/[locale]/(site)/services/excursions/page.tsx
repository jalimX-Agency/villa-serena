import { pageMetadata } from "@/lib/seo";
import { media } from "@/lib/media";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ServiceCategoryPage } from "@/components/ServiceCategoryPage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({ locale, page: "excursions", path: "/services/excursions", image: media("/exp-excursions.jpg") });
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
      heroImage={media("/exp-badminton.jpg")}
      locale={locale}
      related={[
        {
          label: t("bienEtre.page_title"),
          sub: t("bienEtre.page_sub"),
          href: "/services/bien-etre",
          image: media("/exp-hammam.jpg"),
        },
        {
          label: t("restauration.page_title"),
          sub: t("restauration.page_sub"),
          href: "/services/restauration",
          image: media("/exp-cuisine.jpg"),
        },
      ]}
    />
  );
}
