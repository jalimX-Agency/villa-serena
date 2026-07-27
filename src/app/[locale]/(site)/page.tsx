import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { Welcome } from "@/components/home/Welcome";

// Phase 1 — built section by section: Hero, Welcome done; Suites/Experiences/Testimonials/CTA next.
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
    </>
  );
}
