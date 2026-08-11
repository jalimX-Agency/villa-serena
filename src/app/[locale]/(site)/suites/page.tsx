import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { db } from "@/lib/db";
import { Section } from "@/components/Section";
import { SuiteCompareStrip, type CompareSuite } from "@/components/SuiteCompareStrip";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "suites" });
  return {
    title: t("page_title"),
    description: t("page_sub"),
    alternates: {
      canonical: `https://www.villaserenamarrakech.com/${locale}/suites`,
      languages: {
        fr: "https://www.villaserenamarrakech.com/fr/suites",
        en: "https://www.villaserenamarrakech.com/en/suites",
      },
    },
  };
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
      <div className="pt-32 pb-16 px-6 mx-auto max-w-3xl text-center">
        <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-villa-terracotta mb-4">
          Villa Serena
        </p>
        <h1 className="font-serif text-4xl lg:text-5xl text-foreground mb-5">
          {t("suites.page_title")}
        </h1>
        <p className="font-sans text-muted-foreground leading-relaxed">{t("suites.page_sub")}</p>
      </div>

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
