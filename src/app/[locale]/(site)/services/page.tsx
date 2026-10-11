import { IndexShowcase } from "@/components/IndexShowcase";
import { PageIntro } from "@/components/PageIntro";
import { pageMetadata } from "@/lib/seo";
import { media } from "@/lib/media";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({ locale, page: "services", path: "/services" });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "services" });
  const tc = await getTranslations({ locale, namespace: "common" });

  const categories = [
    { key: "restauration", href: "/services/restauration", image: media("/exp-cuisine.jpg") },
    { key: "bienEtre", href: "/services/bien-etre", image: media("/exp-massage.jpg") },
    { key: "excursions", href: "/services/excursions", image: media("/exp-badminton.jpg") },
  ] as const;

  return (
    <>
      <PageIntro eyebrow={t("page_title")} title={t("h1")} lead={t("page_sub")} body={t("intro")} />

      <IndexShowcase
        cta={tc("discover")}
        items={categories.map((c) => ({
          href: c.href,
          image: c.image,
          title: t(`${c.key}.page_title`),
          sub: t(`${c.key}.page_sub`),
        }))}
      />
    </>
  );
}
