import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageIntro } from "@/components/PageIntro";
import { SITE_URL } from "@/lib/seo";
import { POLICY_UPDATED, cookiesHtml, privacyHtml } from "@/lib/policies";

export type PolicyDoc = "privacy" | "cookies";

/** Address of each policy, per language (the English privacy page lives at /en/privacy). */
export const POLICY_PATHS: Record<PolicyDoc, { fr: string; en: string }> = {
  privacy: { fr: "/confidentialite", en: "/privacy" },
  cookies: { fr: "/cookies", en: "/cookies" },
};

export async function policyMetadata(doc: PolicyDoc, locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "seo" });
  const lang = locale === "en" ? "en" : "fr";
  const title = t(`${doc}.title`);
  const description = t(`${doc}.description`);
  const url = (l: "fr" | "en") => `${SITE_URL}/${l}${POLICY_PATHS[doc][l]}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url(lang), languages: { fr: url("fr"), en: url("en"), "x-default": url("fr") } },
    openGraph: { type: "website", siteName: "Villa Serena Marrakech", title, description, url: url(lang) },
  };
}

export async function PolicyPage({ doc, locale }: { doc: PolicyDoc; locale: string }) {
  setRequestLocale(locale);
  const t = await getTranslations("policies");
  const lang = locale === "en" ? "en" : "fr";
  const html = doc === "privacy" ? privacyHtml(lang) : cookiesHtml(lang);
  return (
    <>
      <PageIntro eyebrow="Villa Serena" title={t(`${doc}_title`)} lead={`${t("updated")} ${POLICY_UPDATED[lang]}`} />
      <div className="mx-auto max-w-3xl px-6 lg:px-8 pb-24">
        <div className="prose-villa" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </>
  );
}
