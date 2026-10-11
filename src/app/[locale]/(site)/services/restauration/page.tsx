import { pageMetadata } from "@/lib/seo";
import { media } from "@/lib/media";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ServiceCategoryPage } from "@/components/ServiceCategoryPage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({ locale, page: "restauration", path: "/services/restauration", image: media("/exp-cuisine.jpg") });
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
      introKey="services.restauration.intro"
      statsKey="services.restauration.stats"
      highlightsKey="services.restauration.highlights"
      categories={["dining"]}
      heroImage={media("/exp-cuisine.jpg")}
      locale={locale}
      related={[
        {
          label: t("bienEtre.page_title"),
          sub: t("bienEtre.page_sub"),
          href: "/services/bien-etre",
          image: media("/exp-hammam.jpg"),
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
