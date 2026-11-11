/**
 * Pages whose address differs by language. Internal links stay written in French
 * ("/la-villa") and go through localizedPath(), so English links point straight to /en/the-villa.
 */
const LOCALIZED: Record<string, { fr: string; en: string }> = {
  "/la-villa": { fr: "/la-villa", en: "/the-villa" },
  "/confidentialite": { fr: "/confidentialite", en: "/privacy" },
  "/mentions-legales": { fr: "/mentions-legales", en: "/legal-notice" },
  "/conditions-generales-de-vente": { fr: "/conditions-generales-de-vente", en: "/terms-of-sale" },
  "/reglement-interieur": { fr: "/reglement-interieur", en: "/house-rules" },
};

export function localizedPath(path: string, locale: string) {
  const [base, hash] = path.split("#");
  const entry = LOCALIZED[base];
  const out = entry ? entry[locale === "en" ? "en" : "fr"] : base;
  return hash ? `${out}#${hash}` : out;
}

/** The French (canonical key) form of a path in either language: "/the-villa" → "/la-villa". */
export function basePath(path: string) {
  for (const [key, v] of Object.entries(LOCALIZED)) if (path === v.en || path === v.fr) return key;
  return path;
}

/** Both language versions of a path, for hreflang and the sitemap. */
export function pathsFor(path: string) {
  return { fr: localizedPath(path, "fr"), en: localizedPath(path, "en") };
}
