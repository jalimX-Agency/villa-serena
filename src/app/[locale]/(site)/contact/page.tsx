import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MessageCircle, Mail } from "lucide-react";
import { Section } from "@/components/Section";
import { QuoteForm } from "@/components/QuoteForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("page_title"),
    description: t("page_sub"),
    alternates: {
      canonical: `https://www.villaserenamarrakech.com/${locale}/contact`,
      languages: {
        fr: "https://www.villaserenamarrakech.com/fr/contact",
        en: "https://www.villaserenamarrakech.com/en/contact",
      },
    },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const infoItems = t.raw("contact.info_items") as string[];

  return (
    <>
      <div className="pt-32 pb-16 px-6 mx-auto max-w-3xl text-center">
        <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-villa-terracotta mb-4">
          Villa Serena
        </p>
        <h1 className="font-serif text-4xl lg:text-5xl text-foreground mb-5">{t("contact.page_title")}</h1>
        <p className="font-sans text-muted-foreground leading-relaxed">{t("contact.page_sub")}</p>
      </div>

      <Section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <QuoteForm serviceType="general" submitLabel={t("contact.form_submit")} />
          </div>

          <div className="space-y-8">
            <div>
              <a
                href="https://wa.me/212663524991"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3.5 bg-[#25D366] hover:bg-[#25D366]/90 text-white font-sans text-xs tracking-wide uppercase transition-colors mb-3"
              >
                <MessageCircle className="size-4" />
                {t("contact.whatsapp")}
              </a>
              <a
                href="mailto:guest@villaserenamarrakech.com"
                className="flex items-center gap-3 px-5 py-3.5 border border-border hover:border-villa-terracotta hover:text-villa-terracotta text-foreground font-sans text-xs tracking-wide uppercase transition-colors"
              >
                <Mail className="size-4" />
                {t("contact.email_direct")}
              </a>
            </div>

            <div>
              <h2 className="font-sans text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-4">
                {t("contact.info_title")}
              </h2>
              <ul className="space-y-2">
                {infoItems.map((item) => (
                  <li key={item} className="font-sans text-sm text-foreground/80">
                    · {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
