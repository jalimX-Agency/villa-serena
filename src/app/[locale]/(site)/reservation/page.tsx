import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/Section";
import { getVillaBookedRanges } from "@/lib/actions/villa-booking";
import { ReservationClient } from "@/components/ReservationClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reservation" });
  return {
    title: t("page_title"),
    description: t("page_sub"),
    alternates: {
      canonical: `https://www.villaserenamarrakech.com/${locale}/reservation`,
      languages: {
        fr: "https://www.villaserenamarrakech.com/fr/reservation",
        en: "https://www.villaserenamarrakech.com/en/reservation",
      },
    },
  };
}

export default async function ReservationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const bookedRanges = await getVillaBookedRanges();

  return (
    <>
      <div className="pt-32 pb-16 px-6 mx-auto max-w-3xl text-center">
        <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-villa-terracotta mb-4">
          Villa Serena
        </p>
        <h1 className="font-serif text-4xl lg:text-5xl text-foreground mb-5">
          {t("reservation.page_title")}
        </h1>
        <p className="font-sans text-muted-foreground leading-relaxed">{t("reservation.page_sub")}</p>
      </div>

      <Section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <ReservationClient bookedRanges={bookedRanges} locale={locale} />
        </div>
      </Section>
    </>
  );
}
