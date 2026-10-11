import { PageIntro } from "@/components/PageIntro";
import { pageMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MessageCircle, Mail } from "lucide-react";
import { Section } from "@/components/Section";
import { QuoteForm } from "@/components/QuoteForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({ locale, page: "contact", path: "/contact" });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const infoItems = t.raw("contact.info_items") as string[];

  return (
    <>
      <PageIntro eyebrow={t("contact.page_title")} title={t("contact.h1")} lead={t("contact.page_sub")} />

      <Section className="pb-24 lg:pb-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-7">
            <QuoteForm serviceType="general" submitLabel={t("contact.form_submit")} />
          </div>

          <aside className="lg:col-span-5 lg:col-start-8">
            <div className="relative overflow-hidden bg-villa-ink text-white p-8 lg:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -bottom-24 h-80 w-56 rounded-t-full border border-white/10"
              />
              <p className="flex items-center gap-3 font-sans text-[11px] tracking-[0.25em] uppercase text-villa-gold mb-6">
                <span className="h-px w-8 bg-villa-gold" />
                {t("hero.tagline")}
              </p>
              <div className="relative space-y-3 mb-10">
                <a
                  href="https://wa.me/212663524991"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-3 border-b border-white/15 py-4 hover:border-villa-gold transition-colors"
                >
                  <span className="flex items-center gap-3 font-serif text-2xl">
                    <MessageCircle className="size-5 text-villa-gold" />
                    {t("contact.whatsapp")}
                  </span>
                  <span className="font-sans text-xs text-white/60 tabular-nums">+212 663 524 991</span>
                </a>
                <a
                  href="mailto:guest@villaserenamarrakech.com"
                  className="group flex items-center justify-between gap-3 border-b border-white/15 py-4 hover:border-villa-gold transition-colors"
                >
                  <span className="flex items-center gap-3 font-serif text-2xl">
                    <Mail className="size-5 text-villa-gold" />
                    {t("contact.email_direct")}
                  </span>
                </a>
                <p className="font-sans text-xs text-white/60 break-all">guest@villaserenamarrakech.com</p>
              </div>

              <h2 className="relative font-sans text-[11px] tracking-[0.25em] uppercase text-white/60 mb-4">
                {t("contact.info_title")}
              </h2>
              <ul className="relative">
                {infoItems.map((item) => (
                  <li key={item} className="flex items-center gap-3 border-t border-white/10 py-3 font-sans text-sm text-white/85">
                    <span className="size-1.5 rotate-45 bg-villa-gold shrink-0" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
