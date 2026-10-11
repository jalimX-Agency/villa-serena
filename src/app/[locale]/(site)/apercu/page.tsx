import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { Welcome } from "@/components/home/Welcome";
import { SuitesPreview } from "@/components/home/SuitesPreview";
import { ExperiencesBand } from "@/components/home/ExperiencesBand";
import { Testimonials } from "@/components/home/Testimonials";
import { CtaBand } from "@/components/home/CtaBand";
import { DayJourney } from "@/components/home/DayJourney";

// PREVIEW of the homepage with new sections, for validation before going live.
// Hidden: not in nav, not in sitemap, noindex.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ApercuPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("journey");

  return (
    <>
      <div className="fixed bottom-4 left-4 z-[60] px-3 py-1.5 bg-villa-ink/90 text-white font-sans text-[10px] tracking-[0.2em] uppercase">
        {t("badge")}
      </div>
      <Hero />
      <Welcome />
      <DayJourney />
      <SuitesPreview />
      <ExperiencesBand />
      <Testimonials />
      <CtaBand />
    </>
  );
}
