import { getTranslations, getLocale } from "next-intl/server";
import { db } from "@/lib/db";
import { Section } from "@/components/Section";
import { SectionLabel } from "@/components/SectionLabel";

// Renders nothing until real guest reviews exist in the database —
// no fabricated testimonials. Add real ones via the seed script or,
// later, the admin CMS (Phase 8).
export async function Testimonials() {
  const testimonials = await db.testimonial.findMany({
    orderBy: { order: "asc" },
    take: 4,
  });

  if (testimonials.length === 0) return null;

  const t = await getTranslations();
  const locale = await getLocale();
  const isEn = locale === "en";

  return (
    <Section className="bg-villa-cream py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-14">
          <SectionLabel className="justify-center">{t("home.testimonials_label")}</SectionLabel>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground whitespace-pre-line leading-tight">
            {t("home.testimonials_title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((item) => {
            const quote = isEn && item.quoteEn ? item.quoteEn : item.quote;
            return (
              <div key={item.id} className="bg-card border border-border p-8">
                <div className="flex gap-1 text-villa-gold mb-4" aria-hidden>
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="font-serif text-lg text-foreground italic leading-relaxed mb-5">
                  “{quote}”
                </p>
                <p className="font-sans text-xs tracking-[0.1em] uppercase text-muted-foreground">
                  {item.name}
                  {item.location && ` — ${item.location}`}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
