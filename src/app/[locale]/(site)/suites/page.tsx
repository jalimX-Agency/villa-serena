import { PageIntro } from "@/components/PageIntro";
import { pageMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { db } from "@/lib/db";
import { Section } from "@/components/Section";
import { SuiteCompareStrip, type CompareSuite } from "@/components/SuiteCompareStrip";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({ locale, page: "suites", path: "/suites" });
}

export default async function SuitesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const isEn = locale === "en";

  const rooms = await db.room.findMany({ orderBy: { order: "asc" } });
  const includes = t.raw("suites.includes") as string[];
  const compareSuites: CompareSuite[] = rooms.map((room) => ({
    id: room.id,
    slug: room.slug,
    name: isEn && room.nameEn ? room.nameEn : room.name,
    subtitle: isEn && room.subtitleEn ? room.subtitleEn : room.subtitle,
    image: room.image,
    size: room.size,
    bedType: isEn && room.bedTypeEn ? room.bedTypeEn : room.bedType,
  }));

  return (
    <>
      <PageIntro eyebrow={t("suites.page_title")} title={t("suites.h1")} lead={t("suites.page_sub")} body={t("suites.intro")} />

      <Section className="pb-20 lg:pb-28">
        <SuiteCompareStrip rooms={compareSuites} reserveLabel={t("suites.view_suite")} />

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mt-4 pt-12 border-t border-border text-center">
            <h2 className="font-sans text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-5">
              {t("suites.all_rooms_include")}
            </h2>
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
              {includes.map((item) => (
                <li key={item} className="font-sans text-sm text-foreground/80">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
