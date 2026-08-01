import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/Section";
import { SectionLabel } from "@/components/SectionLabel";
import { QuoteForm } from "@/components/QuoteForm";

type Hero = { type: "photo"; src: string } | { type: "brand" };
type Fact = { label: string; value: string };
type RelatedLink = { label: string; sub: string; href: string; image?: string };

export async function PrivatisationPage({
  serviceType,
  titleKey,
  subKey,
  hero,
  intro,
  highlights,
  facts,
  gallery,
  related,
}: {
  serviceType: string;
  titleKey: string;
  subKey: string;
  hero: Hero;
  intro: string;
  highlights: string[];
  facts: Fact[];
  gallery?: string[];
  related: RelatedLink[];
}) {
  const t = await getTranslations();

  return (
    <>
      <div className="relative h-[55vh] min-h-[400px] overflow-hidden">
        {hero.type === "photo" ? (
          <>
            <Image src={hero.src} alt="" fill priority className="object-cover" />
            <div className="absolute inset-0 bg-villa-ink/55" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-villa-ink via-villa-terracotta/80 to-villa-olive" />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-white/80 mb-4">
            Villa Serena · Villa Exclusive
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-white mb-4">{t(titleKey)}</h1>
          <p className="font-sans text-white/85 max-w-xl">{t(subKey)}</p>
        </div>
      </div>

      <Section className="py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <SectionLabel>{t("home.welcome_label")}</SectionLabel>
            <p className="font-sans text-foreground/80 leading-relaxed mb-6">{intro}</p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-10">
              {highlights.map((h) => (
                <li key={h} className="font-sans text-sm text-foreground/70 flex gap-2">
                  <span className="text-villa-terracotta">·</span>
                  {h}
                </li>
              ))}
            </ul>

            {gallery && gallery.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-10">
                {gallery.map((src) => (
                  <div key={src} className="relative aspect-[4/3] overflow-hidden">
                    <Image src={src} alt="" fill sizes="(max-width: 1024px) 50vw, 33vw" className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            <ul className="grid grid-cols-2 gap-4">
              {facts.map((f) => (
                <li key={f.label} className="border-l-2 border-villa-terracotta pl-4">
                  <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">
                    {f.label}
                  </p>
                  <p className="font-serif text-lg text-foreground">{f.value}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <SectionLabel>{t("experiences.quote_button")}</SectionLabel>
            <QuoteForm serviceType={serviceType} />
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section className="bg-villa-cream py-16 lg:py-20 border-t border-border">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="font-sans text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-8 text-center">
              {t("experiences.page_title")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {related.map((r) => (
                <Link key={r.href} href={r.href} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden mb-3">
                    {r.image ? (
                      <Image
                        src={r.image}
                        alt={r.label}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-villa-ink via-villa-terracotta/80 to-villa-olive transition-transform duration-700 group-hover:scale-105" />
                    )}
                  </div>
                  <h3 className="font-serif text-lg text-foreground group-hover:text-villa-terracotta transition-colors">
                    {r.label}
                  </h3>
                  <p className="font-sans text-xs text-muted-foreground">{r.sub}</p>
                </Link>
              ))}
            </div>
          </div>
        </Section>
      )}
    </>
  );
}
