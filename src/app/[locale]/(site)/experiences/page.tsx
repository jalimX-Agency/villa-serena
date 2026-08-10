import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/Section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "experiences" });
  return {
    title: t("page_title"),
    description: t("page_sub"),
    alternates: {
      canonical: `https://www.villaserenamarrakech.com/${locale}/experiences`,
      languages: {
        fr: "https://www.villaserenamarrakech.com/fr/experiences",
        en: "https://www.villaserenamarrakech.com/en/experiences",
      },
    },
  };
}

export default async function ExperiencesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "experiences" });

  const items = [
    { key: "retraitesYoga", href: "/experiences/retraites-yoga", image: "/exp-hammam.jpg" },
    { key: "golf", href: "/experiences/golf", image: "/hero-main.jpg" },
    { key: "mariagesEvents", href: "/experiences/mariages-events", image: "/exp-excursions.jpg" },
  ] as const;

  return (
    <>
      <div className="pt-32 pb-16 px-6 mx-auto max-w-3xl text-center">
        <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-villa-terracotta mb-4">
          Villa Serena
        </p>
        <h1 className="font-serif text-4xl lg:text-5xl text-foreground mb-5">{t("page_title")}</h1>
        <p className="font-sans text-muted-foreground leading-relaxed">{t("page_sub")}</p>
      </div>

      <Section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {items.map((item) => (
            <Link key={item.key} href={item.href} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden mb-4">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={t(`${item.key}.page_title`)}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-villa-ink via-villa-terracotta/80 to-villa-olive" />
                )}
              </div>
              <h2 className="font-serif text-xl text-foreground group-hover:text-villa-terracotta transition-colors mb-1">
                {t(`${item.key}.page_title`)}
              </h2>
              <p className="font-sans text-sm text-muted-foreground">{t(`${item.key}.page_sub`)}</p>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
