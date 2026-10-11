import { pageMetadata } from "@/lib/seo";
import { Faq } from "@/components/Faq";
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { Welcome } from "@/components/home/Welcome";
import { SuitesPreview } from "@/components/home/SuitesPreview";
import { ExperiencesBand } from "@/components/home/ExperiencesBand";
import { Testimonials } from "@/components/home/Testimonials";
import { CtaBand } from "@/components/home/CtaBand";
import { DayJourney } from "@/components/home/DayJourney";

// Phase 1 — homepage complete: Hero, Welcome, Suites, Experiences,
// Testimonials (renders only once real reviews exist), CTA.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({ locale, page: "home", path: "" });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Welcome />
      <DayJourney />
      <SuitesPreview />
      <ExperiencesBand />
      <Testimonials />
      <Faq />
      <CtaBand />
    </>
  );
}
