import { cache } from "react";
import { db } from "@/lib/db";
import { media } from "@/lib/media";

/**
 * Every fixed photo of the site, by slot. The villa can replace any of them from
 * /admin/photos (stored in SiteImage); until then the default below is used.
 * A slot with an empty default shows the emblem placeholder.
 */
export const SITE_IMAGE_SLOTS = {
  "home.hero": { group: "Accueil", label: "Grande photo d'accueil", src: media("/hero-main.jpg"), alt: "Piscine privée de la Villa Serena et façade du riad, route de l'Ourika, Marrakech", altEn: "Villa Serena's private pool and riad façade, Ourika road, Marrakech" },
  "home.welcome": { group: "Accueil", label: "Présentation — photo en arche", src: media("/welcome-jardin.jpg"), alt: "Jardin d'oliviers de la Villa Serena et statue de Bouddha", altEn: "Villa Serena's olive garden and Buddha statue" },
  "home.welcome2": { group: "Accueil", label: "Présentation — petite photo", src: media("/welcome-salon.jpg"), alt: "Salon et salle à manger de la Villa Serena", altEn: "Villa Serena's lounge and dining room" },
  "home.morning": { group: "Accueil", label: "Une journée — 07:00", src: media("/welcome-jardin.jpg"), alt: "Le jour se lève sur les oliviers", altEn: "Sunrise over the olive trees" },
  "home.noon": { group: "Accueil", label: "Une journée — 12:30", src: media("/hero-main.jpg"), alt: "Déjeuner en terrasse au bord de la piscine", altEn: "Lunch on the terrace by the pool" },
  "home.afternoon": { group: "Accueil", label: "Une journée — 16:00", src: media("/exp-massage.jpg"), alt: "Salle de massage éclairée aux bougies", altEn: "Candlelit massage room" },
  "home.night": { group: "Accueil", label: "Une journée — 21:00", src: media("/welcome-salon.jpg"), alt: "Le riad à la nuit tombée", altEn: "The riad at nightfall" },
  "home.band": { group: "Accueil", label: "Du hammam à la mini ferme — fond", src: media("/exp-hammam.jpg"), alt: "Hammam traditionnel de la Villa Serena, route de l'Ourika, Marrakech", altEn: "Traditional hammam at Villa Serena, Ourika road, Marrakech" },
  "villa.hero": { group: "La villa", label: "Bandeau de la page", src: media("/hero-main.jpg"), alt: "La Villa Serena, route de l'Ourika", altEn: "Villa Serena, Ourika road" },
  "villa.riad": { group: "La villa", label: "Le riad", src: media("/welcome-salon.jpg"), alt: "Salon et salle à manger du riad de la Villa Serena, arcs marocains", altEn: "The riad's lounge and dining room, Moroccan arches" },
  "villa.patio": { group: "La villa", label: "Le patio", src: media("/room-rouge-2.jpg"), alt: "Patio d'inspiration riad de la villa, terrasse et arcades", altEn: "The villa's riad-style patio, terrace and arcades" },
  "villa.pavillon": { group: "La villa", label: "Le pavillon", src: "", alt: "Pavillon de la Villa Serena, salon et jardin privé", altEn: "Villa Serena's pavilion, lounge and private garden" },
  "villa.studio": { group: "La villa", label: "Le Studio", src: media("/suite-bleue.jpg"), alt: "Le Studio indépendant de 45 m², coin salon", altEn: "The independent 45 m² Studio, sitting area" },
  "villa.piscine": { group: "La villa", label: "La piscine", src: media("/hero-main.jpg"), alt: "Piscine privée de 11 × 5 m de la Villa Serena, route de l'Ourika, Marrakech", altEn: "Villa Serena's 11 × 5 m private pool, Ourika road, Marrakech" },
  "villa.jardin": { group: "La villa", label: "Le jardin", src: media("/welcome-jardin.jpg"), alt: "Jardin d'oliviers de la Villa Serena et statue de Bouddha", altEn: "Villa Serena's olive garden and Buddha statue" },
  "villa.bienetre": { group: "La villa", label: "Bien-être", src: media("/exp-massage.jpg"), alt: "Salle de massage de la villa, éclairée aux bougies", altEn: "The villa's candlelit massage room" },
  "services.restauration": { group: "Services", label: "Restauration", src: media("/exp-cuisine.jpg"), alt: "Repas servi à la villa, cuisine marocaine préparée sur place", altEn: "A meal served at the villa, Moroccan cooking prepared on site" },
  "services.hammam": { group: "Services", label: "Bien-être — hammam", src: media("/exp-hammam.jpg"), alt: "Hammam traditionnel privé de la villa", altEn: "The villa's private traditional hammam" },
  "services.sport": { group: "Services", label: "Bien-être — salle de sport", src: media("/exp-fitness.jpg"), alt: "Salle de sport de la villa : tapis de course, rameur et poids", altEn: "The villa's gym: treadmill, rowing machine and weights" },
  "services.petanque": { group: "Services", label: "Activités — pétanque", src: media("/exp-petanque.jpg"), alt: "Terrain de pétanque dans le jardin d'oliviers de la villa", altEn: "Pétanque court in the villa's olive garden" },
  "services.jeux": { group: "Services", label: "Activités — badminton et ping-pong", src: media("/exp-badminton.jpg"), alt: "Espace badminton et ping-pong de la villa", altEn: "The villa's badminton and table tennis area" },
  "experiences.evenements": { group: "Expériences", label: "Événements privés", src: media("/exp-excursions.jpg"), alt: "Réception en plein air dans le jardin d'oliviers de la Villa Serena", altEn: "Outdoor reception in Villa Serena's olive garden" },
  "experiences.retraites": { group: "Expériences", label: "Retraites", src: media("/welcome-jardin.jpg"), alt: "Jardin d'oliviers de la villa, lieu de pratique du yoga", altEn: "The villa's olive garden, a place for yoga" },
} as const;

export type SiteImageKey = keyof typeof SITE_IMAGE_SLOTS;
export type SiteImage = { src: string; alt: string };

/** All slots resolved for a locale (one query per request). */
export const getSiteImages = cache(async (locale: string): Promise<Record<SiteImageKey, SiteImage>> => {
  const rows = await db.siteImage.findMany().catch(() => []);
  const byKey = new Map(rows.map((r) => [r.key, r]));
  const en = locale === "en";
  const out = {} as Record<SiteImageKey, SiteImage>;
  for (const [key, def] of Object.entries(SITE_IMAGE_SLOTS) as [SiteImageKey, (typeof SITE_IMAGE_SLOTS)[SiteImageKey]][]) {
    const row = byKey.get(key);
    out[key] = {
      src: row?.url || def.src,
      alt: (en ? row?.altEn || def.altEn : row?.alt || def.alt) || "",
    };
  }
  return out;
});
