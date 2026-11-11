import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { LEGAL_DOCS, LEGAL_UPDATED, legalHref, type LegalDoc } from "@/lib/legal";
import { LEGAL_TEXT } from "@/lib/legal-terms";
import { SITE_URL } from "@/lib/seo";
import { PageIntro } from "@/components/PageIntro";

/** Title, description and hreflang of a legal document (each language has its own address). */
export async function legalMetadata(doc: LegalDoc, locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "seo" });
  const lang = locale === "en" ? "en" : "fr";
  const url = (l: "fr" | "en") => `${SITE_URL}/${l}${legalHref(doc, l)}`;
  return {
    title: { absolute: t(`${doc}.title`) },
    description: t(`${doc}.description`),
    alternates: { canonical: url(lang), languages: { fr: url("fr"), en: url("en"), "x-default": url("fr") } },
    robots: LEGAL_DOCS[doc].published ? undefined : { index: false, follow: true },
  };
}

/** Shared page for the house rules / terms of sale. 404 until the text is published. */
export async function LegalPage({ doc, locale, slugLocale }: { doc: LegalDoc; locale: string; slugLocale: "fr" | "en" }) {
  setRequestLocale(locale);
  const lang = locale === "en" ? "en" : "fr";
  // FR slug opened in EN (or the reverse): send to the right address.
  if (slugLocale !== lang) redirect(`/${locale}${legalHref(doc, locale)}`);
  const html = LEGAL_TEXT[doc][lang];
  // A text still holding [TODO …] items is never shown, even if flagged as published.
  if (!LEGAL_DOCS[doc].published || !html || html.includes("[TODO")) notFound();
  const t = await getTranslations("legal");
  const tp = await getTranslations("policies");
  const title = doc === "rules" ? t("house_rules") : t("terms");
  return (
    <>
      <PageIntro eyebrow="Villa Serena" title={title} lead={`${tp("updated")} ${LEGAL_UPDATED[doc][lang]}`} />
      <div className="mx-auto max-w-3xl px-6 lg:px-8 pb-24">
        <div className="prose-villa" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </>
  );
}
