import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LEGAL, LEGAL_TEXT, legalHref, type LegalDoc } from "@/lib/legal";
import { PageIntro } from "@/components/PageIntro";

/** Shared page for the house rules / terms of sale. 404 until the texts are published. */
export async function LegalPage({ doc, locale, slugLocale }: { doc: LegalDoc; locale: string; slugLocale: "fr" | "en" }) {
  setRequestLocale(locale);
  const lang = locale === "en" ? "en" : "fr";
  // FR slug opened in EN (or the reverse): send to the right address.
  if (slugLocale !== lang) redirect(`/${locale}${legalHref(doc, locale)}`);
  const html = LEGAL_TEXT[doc][lang];
  if (!LEGAL.published || !html) notFound();
  const t = await getTranslations("legal");
  const title = doc === "rules" ? t("house_rules") : t("terms");
  return (
    <>
      <PageIntro eyebrow="Villa Serena" title={title} lead={LEGAL.version ? `Version ${LEGAL.version}` : ""} />
      <div className="mx-auto max-w-3xl px-6 lg:px-8 pb-24">
        <div className="prose-villa" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </>
  );
}
