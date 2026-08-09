import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/Section";
import { SectionLabel } from "@/components/SectionLabel";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "villa" });
  return {
    title: t("page_title"),
    description: t("page_sub"),
    alternates: {
      canonical: `https://www.villaserenamarrakech.com/${locale}/la-villa`,
      languages: {
        fr: "https://www.villaserenamarrakech.com/fr/la-villa",
        en: "https://www.villaserenamarrakech.com/en/la-villa",
      },
    },
    openGraph: { images: [{ url: "/hero-main.jpg" }] },
  };
}

const GALLERY = ["/welcome-jardin.jpg", "/welcome-salon.jpg", "/exp-petanque.jpg", "/exp-badminton.jpg"];

export default async function VillaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const amenities = t.raw("villa.amenities") as string[];
  const stats = [
    { label: t("home.stats.rooms") },
    { label: t("home.stats.guests") },
    { label: t("home.stats.pool") },
    { label: t("home.stats.hammam") },
  ];

  return (
    <>
      <div className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <Image src="/hero-main.jpg" alt={t("villa.page_title")} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-villa-ink/70 via-villa-ink/10 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 lg:px-12 pb-10">
          <div className="mx-auto max-w-5xl w-full">
            <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-white/70 mb-3">Villa Serena</p>
            <h1 className="font-serif text-4xl sm:text-5xl text-white mb-2">{t("villa.page_title")}</h1>
            <p className="font-sans text-white/80 max-w-xl">{t("villa.page_sub")}</p>
          </div>
        </div>
      </div>

      <Section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <p className="font-sans text-foreground/80 leading-relaxed">{t("villa.intro")}</p>
        </div>
      </Section>

      <Section className="pb-16 lg:pb-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            {stats.map((s) => (
              <div key={s.label} className="border border-border py-8 px-4">
                <p className="font-serif text-xl sm:text-2xl text-villa-terracotta">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-villa-cream py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionLabel>{t("villa.amenities_label")}</SectionLabel>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground mb-4">{t("villa.amenities_title")}</h2>
            <p className="font-sans text-foreground/70 leading-relaxed mb-8">{t("villa.amenities_sub")}</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6">
              {amenities.map((a) => (
                <li key={a} className="font-sans text-sm text-foreground/80">
                  · {a}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {GALLERY.map((src, i) => (
              <div key={src} className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={src}
                  alt={`Villa Serena ${i + 1}`}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-20 lg:py-28">
        <div className="mx-auto max-w-2xl px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground mb-4">{t("villa.cta_title")}</h2>
          <p className="font-sans text-foreground/70 leading-relaxed mb-8">{t("villa.cta_body")}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/suites"
              className="inline-flex items-center px-8 py-3.5 border border-foreground/20 hover:border-villa-terracotta hover:text-villa-terracotta text-foreground font-sans text-xs tracking-[0.15em] uppercase transition-colors"
            >
              {t("villa.cta_suites")}
            </Link>
            <Link
              href="/reservation"
              className="inline-flex items-center px-8 py-3.5 bg-villa-terracotta hover:bg-villa-terracotta/90 text-white font-sans text-xs tracking-[0.15em] uppercase transition-colors"
            >
              {t("villa.cta_book")}
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
