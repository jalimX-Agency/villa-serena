/**
 * House rules and terms of sale (Avenant n° 1, M06 / M48): two separate documents, each published
 * on its own. A document that is not published returns 404 and is not linked anywhere.
 * The acceptance box (booking form and payment page) is active as soon as the terms are published,
 * and names the house rules once they are published too. The version is stored with each request.
 */
export const LEGAL_DOCS = {
  terms: { published: true, version: "2026-11-11" }, // CGV, draft of 8 Nov with the company details (11 Nov)
  rules: { published: false, version: "" }, // règlement intérieur: final text awaited
};

export const LEGAL = {
  /** Acceptance required before a request or a payment. */
  published: LEGAL_DOCS.terms.published,
  rulesPublished: LEGAL_DOCS.rules.published,
  /** Stored with each acceptance, e.g. "CGV 2026-11-11 · RI 2026-11-20". */
  version: [
    LEGAL_DOCS.terms.published && `CGV ${LEGAL_DOCS.terms.version}`,
    LEGAL_DOCS.rules.published && `RI ${LEGAL_DOCS.rules.version}`,
  ]
    .filter(Boolean)
    .join(" · "),
};

export type LegalDoc = "rules" | "terms";

/** Localised slugs (FR / EN) for each document. */
export const LEGAL_SLUGS: Record<LegalDoc, { fr: string; en: string }> = {
  rules: { fr: "/reglement-interieur", en: "/house-rules" },
  terms: { fr: "/conditions-generales-de-vente", en: "/terms-of-sale" },
};

/** Last update shown at the top of each document. */
export const LEGAL_UPDATED: Record<LegalDoc, { fr: string; en: string }> = {
  terms: { fr: "11 novembre 2026", en: "11 November 2026" },
  rules: { fr: "", en: "" },
};

export const legalHref = (doc: LegalDoc, locale: string) => LEGAL_SLUGS[doc][locale === "en" ? "en" : "fr"];
