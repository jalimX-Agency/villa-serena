/**
 * House rules and terms of sale (Avenant n° 1, M06 / M48). Two separate documents, written
 * later by the villa. Until their texts are delivered the pages return 404, the footer hides
 * the links and the booking form shows no acceptance box. When the texts arrive: fill
 * LEGAL_TEXT, set `published: true` and give the documents a version (stored with each request).
 */
export const LEGAL = {
  published: false,
  version: "", // e.g. "2026-11-15"
};

export type LegalDoc = "rules" | "terms";

/** Localised slugs (FR / EN) for each document. */
export const LEGAL_SLUGS: Record<LegalDoc, { fr: string; en: string }> = {
  rules: { fr: "/reglement-interieur", en: "/house-rules" },
  terms: { fr: "/conditions-generales-de-vente", en: "/terms-of-sale" },
};

/** Document bodies as trusted HTML, per locale — empty until delivered. */
export const LEGAL_TEXT: Record<LegalDoc, { fr: string; en: string }> = {
  rules: { fr: "", en: "" },
  terms: { fr: "", en: "" },
};

export const legalHref = (doc: LegalDoc, locale: string) => LEGAL_SLUGS[doc][locale === "en" ? "en" : "fr"];
