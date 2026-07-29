import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { Welcome } from "@/components/home/Welcome";
import { SuitesPreview } from "@/components/home/SuitesPreview";
import { ExperiencesBand } from "@/components/home/ExperiencesBand";

// Phase 1 — built section by section: Hero, Welcome, Suites, Experiences
// done; Testimonials/CTA next.
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
    </>
  );
}
