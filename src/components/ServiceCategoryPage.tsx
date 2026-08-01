import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { db } from "@/lib/db";
import { Section } from "@/components/Section";
import { SectionLabel } from "@/components/SectionLabel";
import { ExperienceCard } from "@/components/ExperienceCard";

type RelatedLink = { label: string; sub: string; href: string; image?: string };

export async function ServiceCategoryPage({
  titleKey,
  subKey,
  categories,
  heroImage,
  locale,
  related,
}: {
  titleKey: string;
  subKey: string;
  categories: string[];
  heroImage: string;
  locale: string;
  related: RelatedLink[];
}) {
  const t = await getTranslations();

  const items = await db.experience.findMany({
    where: { category: { in: categories } },
    orderBy: { order: "asc" },
  });

  return (
    <>
      <div className="relative h-[45vh] min-h-[340px] overflow-hidden">
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
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          {items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((exp) => (
                <ExperienceCard key={exp.id} exp={exp} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </Section>

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
