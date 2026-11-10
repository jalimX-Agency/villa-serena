// Annex of 10 Nov 2026 — suite data: bed sizes (M22), line breaks (M24, M26), comma (M27),
// Yellow Suite texts (M29), Studio without « à l'écart » (M30). Run once: npx tsx scripts/apply-annex-1011-db.ts
// Amenities keep only what is specific to each suite: the shared equipment is now shown as icons (M23).
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const SUITES: Record<string, Record<string, string>> = {
  "suite-rouge": {
    longDescription: "Sur 30 m², elle réunit deux lits de 90 × 200, installés séparés ou jumelés selon vos besoins, un bureau et deux fauteuils pour lire ou travailler au calme. Sa salle d'eau privée est équipée d'une douche.\nSa terrasse, orientée plein sud, donne sur la piscine.", // M24
    longDescriptionEn: "Over 30 m², it has two 90 × 200 beds, set up as twins or joined as you prefer, a desk and two armchairs to read or work in peace. Its private shower room has a shower.\nIts terrace, facing due south, overlooks the pool.",
    amenities: "2 fauteuils,Terrasse orientée sud vue piscine",
    amenitiesEn: "2 armchairs,South-facing terrace with pool view",
  },
  "suite-bleue": {
    amenities: "Ouverte sur le patio,Orientée à l'est",
    amenitiesEn: "Opens onto the patio,East-facing",
  },
  "suite-verte": {
    bedType: "2 lits 90 × 200, séparés ou jumelés", // M22
    bedTypeEn: "2 beds 90 × 200, twin or joined",
    description: "Couleur des oliviers du domaine, le vert relie la suite à la nature qui entoure le riad.\nUne atmosphère fraîche et vivante, pour se ressourcer.", // M26
    descriptionEn: "The colour of the estate's olive trees, green links the suite to the nature around the riad.\nA fresh, lively atmosphere to recharge.",
    longDescription: "Sur 25 m², ses deux lits de 90 × 200 s'installent séparés ou jumelés. Sa terrasse, orientée sud, donne sur la piscine. Salle d'eau privée avec douche, climatisation.",
    longDescriptionEn: "Over 25 m², its two 90 × 200 beds can be set up as twins or joined. Its south-facing terrace overlooks the pool. Private shower room, air conditioning.",
    amenities: "Terrasse orientée sud vue piscine",
    amenitiesEn: "South-facing terrace with pool view",
  },
  "suite-rose": {
    bedType: "2 lits 90 × 200, séparés ou jumelés",
    bedTypeEn: "2 beds 90 × 200, twin or joined",
    description: "Tons poudrés et lumière douce : la Suite Rose est un cocon ouvert sur le patio.", // M27
    descriptionEn: "Powdery tones and soft light: the Pink Suite is a cocoon opening onto the patio.",
    longDescription: "Sur 20 m², ses deux lits de 90 × 200 se jumellent pour un couple ou se séparent pour deux enfants ou deux amies. Orientée à l'ouest, elle se pare des lumières dorées de la fin de journée. Salle d'eau privée avec douche, climatisation.",
    longDescriptionEn: "Over 20 m², its two 90 × 200 beds join for a couple or separate for two children or two friends. Facing west, it glows in the golden light of late afternoon. Private shower room, air conditioning.",
    amenities: "Ouverte sur le patio,Orientée à l'ouest",
    amenitiesEn: "Opens onto the patio,West-facing",
  },
  "suite-orange": {
    bedType: "2 lits 80 × 160, séparés ou jumelés",
    bedTypeEn: "2 beds 80 × 160, twin or joined",
    longDescription: "Sur 25 m², ses deux lits de 80 × 160 s'installent séparés ou jumelés. Orientée nord-est, elle profite du soleil du matin et reste fraîche aux heures chaudes. Salle d'eau privée, climatisation.",
    longDescriptionEn: "Over 25 m², its two 80 × 160 beds can be set up as twins or joined. Facing north-east, it enjoys the morning sun and stays cool in the hottest hours. Private shower room, air conditioning.",
    amenities: "Salon et cuisine du pavillon,Terrasse et jardin privés,Orientée nord-est",
    amenitiesEn: "Pavilion lounge and kitchen,Private terrace and garden,North-east facing",
  },
  "suite-jaune": {
    subtitle: "l'or des après-midi au pavillon", // M29
    subtitleEn: "golden afternoons at the pavilion",
    bedType: "2 lits 80 × 160, séparés ou jumelés",
    bedTypeEn: "2 beds 80 × 160, twin or joined",
    description: "Le jaune, c'est l'or des fins de journée, quand le soleil glisse sur les oliviers et s'attarde sur la terrasse du pavillon. Orientée sud-ouest, la suite garde cette lumière jusqu'au soir. Elle partage avec la Suite Orange le salon, la cuisine, la terrasse et le jardin privés du pavillon.",
    descriptionEn: "Yellow is the gold of late afternoon, when the sun slides across the olive trees and lingers on the pavilion terrace. Facing south-west, the suite holds on to this light until evening. It shares the pavilion's private lounge, kitchen, terrace and garden with the Orange Suite.",
    longDescription: "Sur 25 m², ses deux lits de 80 × 160 s'installent séparés ou jumelés. Salle d'eau privée avec douche, climatisation.",
    longDescriptionEn: "Over 25 m², its two 80 × 160 beds can be set apart or together. Private shower room, air conditioning.",
    amenities: "Salon et cuisine du pavillon,Terrasse et jardin privés,Orientée sud-ouest",
    amenitiesEn: "Pavilion lounge and kitchen,Private terrace and garden,South-west facing",
  },
  "le-studio": {
    description: "Indépendant du riad, le Studio offre une vraie intimité, tout en restant à quelques pas de la piscine et de la table commune. Ses 45 m² en font l'hébergement le plus spacieux du domaine.", // M30
    descriptionEn: "Independent from the riad, the Studio offers real privacy, while staying a few steps from the pool and the shared table. At 45 m², it is the most spacious accommodation on the estate.",
    amenities: "Coin salon et canapé,Terrasse orientée sud vue piscine",
    amenitiesEn: "Sitting area and sofa,South-facing terrace with pool view",
    metaDescription: "Studio indépendant de 45 m² : lit queen size, coin salon, bureau, machine Nespresso, climatisation. Villa privée, route de l'Ourika, Marrakech.",
    metaDescriptionEn: "An independent 45 m² studio: queen-size bed, sitting area, desk, Nespresso machine, air conditioning. Private villa, Ourika road, Marrakech.",
  },
};

(async () => {
  for (const [slug, data] of Object.entries(SUITES)) {
    for (const k of ["metaDescription", "metaDescriptionEn"]) if (data[k] && data[k].length > 160) throw new Error(`${slug} ${k} too long`);
    const r = await db.room.updateMany({ where: { slug }, data });
    console.log(slug, r.count);
  }
})().finally(() => db.$disconnect());
