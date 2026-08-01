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
  const t = await getTranslations({ locale, namespace: "services" });
  return {
    title: t("page_title"),
    description: t("page_sub"),
    alternates: {
      canonical: `https://www.villaserenamarrakech.com/${locale}/services`,
      languages: {
        fr: "https://www.villaserenamarrakech.com/fr/services",
        en: "https://www.villaserenamarrakech.com/en/services",
      },
    },
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "services" });

  const categories = [
    { key: "restauration", href: "/services/restauration", image: "/exp-cuisine.jpg" },
    { key: "bienEtre", href: "/services/bien-etre", image: "/exp-hammam.jpg" },
    { key: "excursions", href: "/services/excursions", image: "/exp-badminton.jpg" },
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
          {categories.map((c) => (
            <Link key={c.key} href={c.href} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden mb-4">
                <Image
                  src={c.image}
                  alt={t(`${c.key}.page_title`)}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h2 className="font-serif text-xl text-foreground group-hover:text-villa-terracotta transition-colors mb-1">
                {t(`${c.key}.page_title`)}
              </h2>
              <p className="font-sans text-sm text-muted-foreground">{t(`${c.key}.page_sub`)}</p>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
