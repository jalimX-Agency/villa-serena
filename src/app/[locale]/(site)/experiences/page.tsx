import { IndexShowcase } from "@/components/IndexShowcase";
import { PageIntro } from "@/components/PageIntro";
import { pageMetadata } from "@/lib/seo";
import { media } from "@/lib/media";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({ locale, page: "experiences", path: "/experiences" });
}

export default async function ExperiencesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "experiences" });
  const tc = await getTranslations({ locale, namespace: "common" });

  const items = [
    { key: "retraitesYoga", href: "/experiences/retraites-yoga", image: media("/exp-massage.jpg") },
    { key: "golf", href: "/experiences/golf", image: media("/hero-main.jpg") },
    { key: "mariagesEvents", href: "/experiences/mariages-events", image: media("/exp-excursions.jpg") },
  ] as const;

  return (
    <>
      <PageIntro eyebrow={t("page_title")} title={t("h1")} lead={t("page_sub")} body={t("intro")} />

      <IndexShowcase
        cta={tc("discover")}
        items={items.map((item) => ({
          href: item.href,
          image: item.image,
          title: t(`${item.key}.page_title`),
          sub: t(`${item.key}.page_sub`),
        }))}
      />
    </>
  );
}
