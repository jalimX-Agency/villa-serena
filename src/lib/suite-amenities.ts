import type { VillaIconName } from "@/components/icons/VillaIcon";

/**
 * Equipment shown as icons on each suite page (annex of 10 Nov 2026, M23), in the annex order.
 * Suite-specific features (terrace, orientation, pavilion lounge…) stay as text under the icons.
 */
export const AMENITY_ICONS: { icon: VillaIconName; fr: string; en: string; only?: string[]; except?: string[] }[] = [
  { icon: "climatisation", fr: "Climatisation", en: "Air conditioning" },
  { icon: "chauffage-electrique", fr: "Chauffage (radiateur à bain d'huile)", en: "Heating (oil-filled radiator)" },
  { icon: "douche", fr: "Douche", en: "Shower" },
  { icon: "wc", fr: "WC privés", en: "Private toilet" },
  { icon: "seche-cheveux", fr: "Sèche-cheveux", en: "Hair dryer" },
  { icon: "coffre-fort", fr: "Coffre-fort", en: "Safe" },
  { icon: "wifi", fr: "Wifi", en: "Wi-Fi" },
  { icon: "bouteille-d-eau", fr: "Eau filtrée (sur demande)", en: "Filtered water (on request)" },
  { icon: "lit-de-bebe", fr: "Lit de bébé (sur demande)", en: "Baby cot (on request)", except: ["suite-rose"] },
  { icon: "bureau", fr: "Bureau", en: "Desk", only: ["suite-rouge", "le-studio"] },
  { icon: "machine-a-cafe", fr: "Machine Nespresso", en: "Nespresso machine", only: ["le-studio"] },
];

export function amenityIconsFor(slug: string, locale: string) {
  return AMENITY_ICONS.filter((a) => (!a.only || a.only.includes(slug)) && !a.except?.includes(slug)).map((a) => ({
    icon: a.icon,
    label: locale === "en" ? a.en : a.fr,
  }));
}
