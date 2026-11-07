import { StarDivider } from "@/components/StarDivider";
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
  const essentials = t.raw("reservation.essentials") as [string, string][];

  return (
    <>
      <PageIntro eyebrow={t("reservation.page_title")} title={t("reservation.h1")} lead={t("reservation.page_sub")} />

      <Section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 grid gap-10 lg:grid-cols-12 lg:gap-12 items-start">
          <div className="lg:col-span-7">
            <ReservationClient bookedRanges={bookedRanges} locale={locale} />
          </div>
          {/* "L'essentiel" box beside the calendar (client brief ch. 10). */}
          <aside className="lg:col-span-5 lg:sticky lg:top-28 bg-villa-ink text-white p-7 lg:p-8">
            <h2 className="font-serif text-3xl text-white">{t("reservation.essentials_title")}</h2>
            <StarDivider className="my-5" />
            <dl>
              {essentials.map(([k, v]) => (
                <div key={k} className="border-b border-white/10 py-3">
                  <dt className="font-sans text-[11px] tracking-[0.2em] uppercase text-villa-gold">{k}</dt>
                  <dd className="mt-1 font-sans text-sm leading-relaxed text-white/90">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 font-sans text-xs text-villa-sand-light">{t("reservation.rate_note")}</p>
          </aside>
        </div>
      </Section>
      <Faq id="faq" />
    </>
  );
}
