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
  // M11: five-photo montage under « Du hammam à la mini ferme » (the jardin cell is the large one).
  "home.mosaic.sport": { group: "Accueil", label: "Montage — salle de sport", src: media("/exp-fitness.jpg"), alt: "Salle de sport de la Villa Serena : tapis de course, rameur et poids", altEn: "The Villa Serena gym: treadmill, rowing machine and weights" },
  "home.mosaic.hammam": { group: "Accueil", label: "Montage — hammam", src: media("/exp-hammam.jpg"), alt: "Hammam traditionnel privé de la Villa Serena", altEn: "Villa Serena's private traditional hammam" },
  "home.mosaic.ferme": { group: "Accueil", label: "Montage — mini ferme", src: "", alt: "Mini ferme de la Villa Serena : chèvres, brebis, poules, canards et paon", altEn: "The Villa Serena mini farm: goats, ewes, hens, ducks and a peacock" },
  "home.mosaic.jardin": { group: "Accueil", label: "Montage — jardin (grande case)", src: media("/welcome-jardin.jpg"), alt: "Jardin d'oliviers de la Villa Serena et statue de Bouddha", altEn: "Villa Serena's olive garden and Buddha statue" },
  "home.mosaic.potager": { group: "Accueil", label: "Montage — potager", src: "", alt: "Potager de la Villa Serena, légumes servis à la table des hôtes", altEn: "The Villa Serena kitchen garden, vegetables served at the guests' table" },
  "home.band": { group: "Accueil", label: "Du hammam à la mini ferme — fond", src: media("/exp-hammam.jpg"), alt: "Hammam traditionnel de la Villa Serena, route de l'Ourika, Marrakech", altEn: "Traditional hammam at Villa Serena, Ourika road, Marrakech" },
  "villa.hero": { group: "La villa", label: "Bandeau de la page", src: media("/hero-main.jpg"), alt: "La Villa Serena, route de l'Ourika", altEn: "Villa Serena, Ourika road" },
  "villa.riad": { group: "La villa", label: "Le riad", src: media("/welcome-salon.jpg"), alt: "Salon et salle à manger du riad de la Villa Serena, arcs marocains", altEn: "The riad's lounge and dining room, Moroccan arches" },
  "villa.patio": { group: "La villa", label: "Le patio", src: media("/room-rouge-2.jpg"), alt: "Patio d'inspiration riad de la villa, terrasse et arcades", altEn: "The villa's riad-style patio, terrace and arcades" },
  "villa.pavillon": { group: "La villa", label: "Le pavillon", src: "", alt: "Pavillon de la Villa Serena, salon et jardin privé", altEn: "Villa Serena's pavilion, lounge and private garden" },
  "villa.studio": { group: "La villa", label: "Le Studio", src: media("/suite-bleue.jpg"), alt: "Le Studio indépendant de 45 m², coin salon", altEn: "The independent 45 m² Studio, sitting area" },
  "villa.piscine": { group: "La villa", label: "La piscine", src: media("/hero-main.jpg"), alt: "Piscine privée de 11 × 5 m de la Villa Serena, route de l'Ourika, Marrakech", altEn: "Villa Serena's 11 × 5 m private pool, Ourika road, Marrakech" },
  "villa.jardin": { group: "La villa", label: "Le jardin", src: media("/welcome-jardin.jpg"), alt: "Jardin d'oliviers de la Villa Serena et statue de Bouddha", altEn: "Villa Serena's olive garden and Buddha statue" },
  // M17: the garden block becomes a five-photo carousel (villa.jardin is the first photo).
  "villa.jardin2": { group: "La villa", label: "Le jardin — 2, potager", src: "", alt: "Potager de la Villa Serena, légumes servis à la table des hôtes", altEn: "The Villa Serena kitchen garden, vegetables served at the guests' table" },
  "villa.jardin3": { group: "La villa", label: "Le jardin — 3, mini ferme", src: "", alt: "Mini ferme de la Villa Serena : chèvres, brebis, poules, canards et paon", altEn: "The Villa Serena mini farm: goats, ewes, hens, ducks and a peacock" },
  "villa.jardin4": { group: "La villa", label: "Le jardin — 4, bassin de carpes koï", src: "", alt: "Bassin de carpes koï dans le jardin de la Villa Serena", altEn: "The koi pond in the Villa Serena garden" },
  "villa.jardin5": { group: "La villa", label: "Le jardin — 5, pétanque", src: media("/exp-petanque.jpg"), alt: "Terrain de pétanque sous les oliviers de la Villa Serena", altEn: "The pétanque court under the olive trees at Villa Serena" },
  "villa.bienetre": { group: "La villa", label: "Bien-être", src: media("/exp-massage.jpg"), alt: "Salle de massage de la villa, éclairée aux bougies", altEn: "The villa's candlelit massage room" },
  "services.restauration": { group: "Services", label: "Restauration", src: media("/exp-cuisine.jpg"), alt: "Repas servi à la villa, cuisine marocaine préparée sur place", altEn: "A meal served at the villa, Moroccan cooking prepared on site" },
  // M36: dining carousel, from breakfast to dinner (services.restauration is the first photo).
  "services.restauration2": { group: "Services", label: "Restauration — 2, déjeuner au bord de la piscine", src: "", alt: "Déjeuner servi au bord de la piscine de la Villa Serena", altEn: "Lunch served by the pool at Villa Serena" },
  "services.restauration3": { group: "Services", label: "Restauration — 3, tajine", src: "", alt: "Tajine préparé par la cuisinière de la Villa Serena", altEn: "A tagine prepared by the Villa Serena cook" },
  "services.restauration4": { group: "Services", label: "Restauration — 4, salades marocaines", src: "", alt: "Salades marocaines aux légumes du potager de la villa", altEn: "Moroccan salads with vegetables from the villa's garden" },
  "services.restauration5": { group: "Services", label: "Restauration — 5, table du dîner dans le patio", src: "", alt: "Table du dîner dressée dans le patio du riad", altEn: "The dinner table laid in the riad patio" },
  "services.restauration6": { group: "Services", label: "Restauration — 6, dîner aux bougies", src: "", alt: "Dîner aux bougies sous les oliviers de la Villa Serena", altEn: "Candlelit dinner under the olive trees at Villa Serena" },
  "services.hammam": { group: "Services", label: "Bien-être — hammam", src: media("/exp-hammam.jpg"), alt: "Hammam traditionnel privé de la villa", altEn: "The villa's private traditional hammam" },
  "services.massage": { group: "Services", label: "Bien-être — salle de massage", src: media("/exp-massage.jpg"), alt: "Salle de massage de la Villa Serena, éclairée aux bougies", altEn: "The Villa Serena massage room, lit by candles" },
  "services.yoga": { group: "Services", label: "Bien-être — espace yoga et relaxation", src: "", alt: "Espace de yoga et de relaxation de la Villa Serena", altEn: "The Villa Serena yoga and relaxation space" },
  "services.sport": { group: "Services", label: "Bien-être — salle de sport", src: media("/exp-fitness.jpg"), alt: "Salle de sport de la villa : tapis de course, rameur et poids", altEn: "The villa's gym: treadmill, rowing machine and weights" },
  "services.petanque": { group: "Services", label: "Activités — pétanque", src: media("/exp-petanque.jpg"), alt: "Terrain de pétanque dans le jardin d'oliviers de la villa", altEn: "Pétanque court in the villa's olive garden" },
  "services.jeux": { group: "Services", label: "Activités — badminton et ping-pong", src: media("/exp-badminton.jpg"), alt: "Espace badminton et ping-pong de la villa", altEn: "The villa's badminton and table tennis area" },
  "experiences.evenements": { group: "Expériences", label: "Événements privés", src: media("/exp-excursions.jpg"), alt: "Réception en plein air dans le jardin d'oliviers de la Villa Serena", altEn: "Outdoor reception in Villa Serena's olive garden" },
  // M46: golf courses carousel. Only authorised photos (written consent of the courses, paid stock or own photos).
  "golf.1": { group: "Expériences", label: "Golf — 1, Palm Golf Ourika", src: "", alt: "Palm Golf Ourika, à 12 minutes de la villa", altEn: "Palm Golf Ourika, 12 minutes from the villa" },
  "golf.2": { group: "Expériences", label: "Golf — 2, Golf Akenza", src: "", alt: "Golf Akenza, à 12 minutes de la villa", altEn: "Akenza Golf, 12 minutes from the villa" },
  "golf.3": { group: "Expériences", label: "Golf — 3, Royal Palm Golf", src: "", alt: "Royal Palm Golf, à 35 minutes de la villa", altEn: "Royal Palm Golf, 35 minutes from the villa" },
  "golf.4": { group: "Expériences", label: "Golf — 4, Samanah Golf", src: "", alt: "Samanah Golf, à 35 minutes de la villa", altEn: "Samanah Golf, 35 minutes from the villa" },
  "golf.5": { group: "Expériences", label: "Golf — 5, Golf Amelkis", src: "", alt: "Golf Amelkis, à 40 minutes de la villa", altEn: "Amelkis Golf, 40 minutes from the villa" },
  "golf.6": { group: "Expériences", label: "Golf — 6, Royal Golf Marrakech", src: "", alt: "Royal Golf Marrakech, à 40 minutes de la villa", altEn: "Royal Golf Marrakech, 40 minutes from the villa" },
  "golf.7": { group: "Expériences", label: "Golf — 7, Golf Al Maaden", src: "", alt: "Golf Al Maaden, à 40 minutes de la villa", altEn: "Al Maaden Golf, 40 minutes from the villa" },
  "golf.8": { group: "Expériences", label: "Golf — 8, l'Atlas enneigé", src: "", alt: "Fairway face aux sommets enneigés de l'Atlas", altEn: "A fairway facing the snow-capped Atlas peaks" },
  "experiences.retraites": { group: "Expériences", label: "Retraites", src: media("/welcome-jardin.jpg"), alt: "Jardin d'oliviers de la villa, lieu de pratique du yoga", altEn: "The villa's olive garden, a place for yoga" },
} as const;

export type SiteImageKey = keyof typeof SITE_IMAGE_SLOTS;
export type SiteImage = { src: string; alt: string };

/** The slots that have a photo, in order (empty slots are skipped). */
export function filledSlides(img: Record<SiteImageKey, SiteImage>, keys: SiteImageKey[]) {
  return keys.map((k) => img[k]).filter((s) => s.src);
}

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
