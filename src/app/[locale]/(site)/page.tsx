import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { Welcome } from "@/components/home/Welcome";
import { SuitesPreview } from "@/components/home/SuitesPreview";
import { ExperiencesBand } from "@/components/home/ExperiencesBand";
import { Testimonials } from "@/components/home/Testimonials";
import { CtaBand } from "@/components/home/CtaBand";

// Phase 1 — homepage complete: Hero, Welcome, Suites, Experiences,
// Testimonials (renders only once real reviews exist), CTA.
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
      <SuitesPreview />
      <ExperiencesBand />
      <Testimonials />
      <CtaBand />
    </>
  );
}
