import { getSiteImages } from "@/lib/site-images";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { PageIntro } from "@/components/PageIntro";
import { AnchorBar } from "@/components/AnchorBar";
import { StarDivider } from "@/components/StarDivider";
import { QuoteForm } from "@/components/QuoteForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({ locale, page: "experiences", path: "/experiences" });
}

/** Single Expériences page with anchors #evenements, #golf, #retraites (client brief ch. 09). */
export default async function ExperiencesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const p = (k: string) => t(`experiencesPage.${k}`);
  const img = await getSiteImages(locale);
  const events = t.raw("experiencesPage.evenements.paragraphs") as string[];
  const facts = t.raw("experiencesPage.evenements.facts") as [string, string][];
  const courses = t.raw("experiencesPage.golf.courses") as [string, string][];

  return (
    <>
      <PageIntro eyebrow={p("eyebrow")} title={t("experiences.h1")} lead={p("lead")} />

      <AnchorBar
        items={[
          { id: "evenements", label: t("experiencesPage.anchors.evenements") },
          { id: "golf", label: t("experiencesPage.anchors.golf") },
          { id: "retraites", label: t("experiencesPage.anchors.retraites") },
        ]}
      />

      {/* Événements privés */}
      <section id="evenements" className="scroll-mt-40 mx-auto max-w-7xl px-6 lg:px-8 py-20 lg:py-28 grid gap-10 lg:grid-cols-12 lg:gap-16 items-start">
        <div className="lg:col-span-6 relative aspect-[4/5] overflow-hidden rounded-t-full bg-muted">
          <Image src={img["experiences.evenements"].src} alt={img["experiences.evenements"].alt} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
        </div>
        <div className="lg:col-span-6">
          <h2 className="font-serif text-4xl lg:text-5xl text-villa-ink">{p("evenements.title")}</h2>
          <StarDivider className="my-6 max-w-[10rem]" tone="terracotta" />
          <div className="space-y-4 font-sans text-foreground/80 leading-relaxed">
            {events.map((para) => <p key={para.slice(0, 24)}>{para}</p>)}
          </div>
          <dl className="mt-8 border-t border-border">
            {facts.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-border py-3">
                <dt className="font-sans text-[11px] tracking-[0.18em] uppercase text-villa-terracotta pt-0.5">{k}</dt>
                <dd className="font-sans text-sm text-foreground/85">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Golf */}
      <section id="golf" className="scroll-mt-40 bg-villa-ink text-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-villa-gold mb-4">{t("experiencesPage.anchors.golf")}</p>
            <h2 className="font-serif text-3xl lg:text-[2.6rem] leading-tight text-white text-balance">{p("golf.title")}</h2>
            <StarDivider className="my-6 max-w-[10rem]" />
            <p className="font-sans text-villa-sand-light leading-relaxed">{p("golf.paragraph")}</p>
          </div>
          <div className="lg:col-span-7">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-villa-gold/40">
                  <th className="py-3 font-sans text-[11px] tracking-[0.2em] uppercase font-normal text-villa-gold">{p("golf.col_course")}</th>
                  <th className="py-3 font-sans text-[11px] tracking-[0.2em] uppercase font-normal text-villa-gold text-right">{p("golf.col_time")}</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(([names, time]) => (
                  <tr key={names} className="border-b border-white/10">
                    <td className="py-4 pr-4 font-sans text-sm text-white/90">{names}</td>
                    <td className="py-4 font-serif text-xl text-villa-gold text-right whitespace-nowrap">{time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Retraites */}
      <section id="retraites" className="scroll-mt-40 mx-auto max-w-7xl px-6 lg:px-8 py-20 lg:py-28 grid gap-10 lg:grid-cols-12 lg:gap-16 items-center">
        <div className="lg:col-span-6 lg:order-2 relative aspect-[4/3] overflow-hidden bg-muted">
          <Image src={img["experiences.retraites"].src} alt={img["experiences.retraites"].alt} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
        </div>
        <div className="lg:col-span-6 lg:order-1">
          <h2 className="font-serif text-4xl lg:text-5xl text-villa-ink">{p("retraites.title")}</h2>
          <StarDivider className="my-6 max-w-[10rem]" tone="terracotta" />
          <p className="font-sans text-foreground/80 leading-relaxed">{p("retraites.paragraph")}</p>
        </div>
      </section>

      <section className="bg-villa-cream border-t border-border py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <h2 className="font-serif text-3xl lg:text-4xl text-villa-ink text-center">{p("quote_title")}</h2>
          <p className="mt-4 mb-10 text-center font-sans text-muted-foreground leading-relaxed">{p("quote_body")}</p>
          <QuoteForm serviceType="experiences" submitLabel={t("nav.book")} />
        </div>
      </section>
    </>
  );
}
