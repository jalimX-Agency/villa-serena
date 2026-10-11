import { Faq } from "@/components/Faq";
import { PageIntro } from "@/components/PageIntro";
import { pageMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/Section";
import { getVillaBookedRanges } from "@/lib/actions/villa-booking";
import { ReservationClient } from "@/components/ReservationClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({ locale, page: "reservation", path: "/reservation" });
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
      <PageIntro eyebrow={t("reservation.page_title")} title={t("reservation.h1")} lead={t("reservation.page_sub")} />

      <Section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <ReservationClient bookedRanges={bookedRanges} locale={locale} />
        </div>
      </Section>
      <Faq />
    </>
  );
}
