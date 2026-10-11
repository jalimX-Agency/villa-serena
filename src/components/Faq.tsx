import { getTranslations } from "next-intl/server";
import { Plus } from "lucide-react";

type Item = { q: string; a: string };

/** FAQ with native <details> (no JS) and FAQPage structured data for search and AI answers. */
export async function Faq() {
  const t = await getTranslations("faq");
  const items = t.raw("items") as Item[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };

  return (
    <section className="py-20 lg:py-28 px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <p className="flex items-center gap-3 font-sans text-[11px] tracking-[0.25em] uppercase text-villa-terracotta mb-4">
            <span className="h-px w-8 bg-villa-terracotta" />
            {t("label")}
          </p>
          <h2 className="font-serif text-3xl lg:text-5xl leading-tight text-foreground text-balance">{t("title")}</h2>
        </div>
        <div className="lg:col-span-8 border-t border-border">
          {items.map((item, i) => (
            <details key={item.q} className="group border-b border-border" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-start gap-5 py-5 lg:py-6 [&::-webkit-details-marker]:hidden">
                <span className="mt-1 font-sans text-[11px] tabular-nums tracking-widest text-villa-terracotta">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="flex-1 font-serif text-xl lg:text-2xl text-foreground">{item.q}</h3>
                <Plus className="mt-1.5 size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="pb-6 pl-[2.6rem] pr-8 font-sans text-[0.95rem] leading-relaxed text-muted-foreground max-w-2xl">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
