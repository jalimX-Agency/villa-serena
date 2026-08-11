import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { db } from "@/lib/db";
import { Section } from "@/components/Section";
import { SectionLabel } from "@/components/SectionLabel";

type RelatedLink = { label: string; sub: string; href: string; image?: string };
type Stat = { value: string; label: string };

export async function ServiceCategoryPage({
  titleKey,
  subKey,
  introKey,
  statsKey,
  highlightsKey,
  categories,
  heroImage,
  locale,
  related,
}: {
  titleKey: string;
  subKey: string;
  introKey: string;
  statsKey: string;
  highlightsKey: string;
  categories: string[];
  heroImage: string;
  locale: string;
  related: RelatedLink[];
}) {
  const t = await getTranslations();
  const isEn = locale === "en";

  const items = await db.experience.findMany({
    where: { category: { in: categories } },
    orderBy: { order: "asc" },
  });

  const stats = t.raw(statsKey) as Stat[];
  const highlights = t.raw(highlightsKey) as string[];

  return (
    <>
      <div className="relative h-[55vh] min-h-[400px] overflow-hidden">
        <Image src={heroImage} alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-villa-ink/55" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-white/80 mb-4">
            {t("services.page_title")}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-white mb-4">{t(titleKey)}</h1>
          <p className="font-sans text-white/85 max-w-xl">{t(subKey)}</p>
        </div>
      </div>

      <Section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <SectionLabel className="justify-center flex">{t("home.welcome_label")}</SectionLabel>
          <p className="font-sans text-foreground/80 leading-relaxed">{t(introKey)}</p>
        </div>
      </Section>

      {stats.length > 0 && (
        <Section className="pb-16 lg:pb-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              {stats.map((s) => (
                <div key={s.label} className="border border-border py-6 px-3">
                  <p className="font-serif text-2xl text-villa-terracotta mb-1">{s.value}</p>
                  <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {highlights.length > 0 && (
        <Section className="bg-villa-cream py-16 lg:py-20 border-t border-border">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {highlights.map((h) => (
                <li key={h} className="font-sans text-sm text-foreground/80 flex gap-2">
                  <span className="text-villa-terracotta shrink-0">·</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {items.length > 0 && (
        <Section className="py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-6 lg:px-8 space-y-16 lg:space-y-24">
            {items.map((exp, i) => {
              const title = isEn && exp.titleEn ? exp.titleEn : exp.title;
              const subtitle = isEn && exp.subtitleEn ? exp.subtitleEn : exp.subtitle;
              const description = isEn && exp.descriptionEn ? exp.descriptionEn : exp.description;
              const reversed = i % 2 === 1;

              return (
                <div
                  key={exp.id}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                    reversed ? "lg:[direction:rtl]" : ""
                  }`}
                >
                  <div className={`relative aspect-[4/3] overflow-hidden ${reversed ? "lg:[direction:ltr]" : ""}`}>
                    {exp.image && (
                      <Image
                        src={exp.image}
                        alt={title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className={reversed ? "lg:[direction:ltr]" : ""}>
                    {exp.icon && (
                      <span className="inline-flex items-center justify-center size-10 border border-villa-terracotta/40 text-villa-terracotta text-lg mb-4">
                        {exp.icon}
                      </span>
                    )}
                    <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-2">{title}</h2>
                    {subtitle && (
                      <p className="font-sans text-xs text-villa-terracotta uppercase tracking-[0.15em] mb-4">
                        {subtitle}
                      </p>
                    )}
                    {description && (
                      <p className="font-sans text-foreground/70 leading-relaxed mb-4">{description}</p>
                    )}
                    {exp.duration && (
                      <p className="font-sans text-xs text-muted-foreground uppercase tracking-wide border-t border-border pt-4 inline-block">
                        {exp.duration}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {related.length > 0 && (
        <Section className="bg-villa-cream py-16 lg:py-20 border-t border-border">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionLabel className="justify-center mb-8 flex">{t("services.page_title")}</SectionLabel>
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
