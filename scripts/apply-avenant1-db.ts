// Avenant n° 1 (8 Nov 2026) — database copy: suites (M18, M19, M37–M40, M36 V03–V07),
// blog articles (M34, M35, M36 V17–V23) and photo descriptions (M36 V14–V15).
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const SUITES: Record<string, Record<string, string>> = {
  "suite-rouge": {
    idealFor: "un couple ou deux ami(e)s.", // M18
    idealForEn: "a couple or two friends.",
    metaDescription: "Suite de 30 m² au riad de la Villa Serena : lits séparés ou jumelés, bureau, terrasse, climatisation. Réservée avec la villa entière, route de l'Ourika.", // V03
  },
  "suite-bleue": {
    bedType: "1 lit queen size", bedTypeEn: "1 queen-size bed", // M37
    amenities: "Lit queen size,Ouverte sur le patio,Orientée à l'est,Salle d'eau privée avec douche,Climatisation",
    amenitiesEn: "Queen-size bed,Opens onto the patio,East-facing,Private shower room,Air conditioning",
    longDescription: "Sur 30 m², elle offre un grand lit queen size. Orientée à l'est, elle accueille la douce lumière du matin. Salle d'eau privée avec douche, climatisation.", // M38
    longDescriptionEn: "Over 30 m², it offers a large queen-size bed. Facing east, it welcomes the soft morning light. Private shower room, air conditioning.",
    metaDescription: "Suite de 30 m² au riad de la Villa Serena, ouverte sur le patio : lit queen size, salle d'eau privée, climatisation. Route de l'Ourika, Marrakech.", // M19
    metaDescriptionEn: "A 30 m² suite in the Villa Serena riad, opening onto the patio: queen-size bed, private shower room, air conditioning. Ourika road, Marrakech.",
  },
  "suite-verte": {
    metaDescription: "Suite de 25 m² au riad de la Villa Serena : lits séparés ou jumelés, salle d'eau privée, climatisation, ambiance nature. Route de l'Ourika, Marrakech.", // V04
  },
  "suite-rose": {
    metaDescription: "Suite de 20 m² au riad de la Villa Serena, tons poudrés : lits séparés ou jumelés, salle d'eau privée, climatisation. Route de l'Ourika, Marrakech.", // V05
  },
  "suite-orange": {
    metaDescription: "Suite de 25 m² dans le pavillon de la Villa Serena : lits séparés ou jumelés, salon et cuisine partagés avec la Suite Jaune, terrasse et jardin privés.", // V06
  },
  "suite-jaune": {
    metaDescription: "Suite de 25 m² dans le pavillon de la Villa Serena : lits séparés ou jumelés, salon, cuisine, terrasse et jardin privés partagés avec la Suite Orange.", // V07
  },
  "le-studio": {
    bedType: "1 lit queen size, coin salon", bedTypeEn: "1 queen-size bed, sitting area", // M37
    amenities: "Lit queen size,Coin salon et canapé,Machine Nespresso,Terrasse orientée sud vue piscine,Salle d'eau et toilettes privées,Climatisation",
    amenitiesEn: "Queen-size bed,Sitting area and sofa,Nespresso machine,South-facing terrace with pool view,Private shower room and WC,Air conditioning",
    longDescription: "Il réunit un grand lit queen size, un coin salon avec canapé et une machine Nespresso pour le premier café du matin, à savourer sur sa terrasse orientée sud, face à la piscine. Salle d'eau et toilettes privées, climatisation.", // M40
    longDescriptionEn: "It has a large queen-size bed, a sitting area with a sofa and a Nespresso machine for the first coffee of the morning, to enjoy on its south-facing terrace overlooking the pool. Private shower room and WC, air conditioning.",
    metaDescription: "Studio indépendant de 45 m² à l'écart du riad : lit queen size, coin salon, machine Nespresso, climatisation. Dans une villa privée de la route de l'Ourika, Marrakech.", // M39
    metaDescriptionEn: "An independent 45 m² studio set apart from the riad: queen-size bed, sitting area, Nespresso machine, air conditioning. In a private villa on the Ourika road, Marrakech.",
  },
};

// Plain string replacements inside the articles (FR then EN).
const BLOG: Record<string, { fr: [string, string][]; en: [string, string][]; meta?: Record<string, string> }> = {
  "que-faire-vallee-ourika": {
    fr: [["<h2>Organiser sa journée depuis Villa Serena</h2>", "<h2>Organiser sa journée depuis la Villa Serena</h2>"]], // V18
    en: [],
  },
  "golf-marrakech-route-ourika": {
    fr: [
      ["Palm Ourika : sur le même axe que la villa, avec une vue dégagée sur l'Atlas.", "Palm Ourika : sur le même axe que la villa, avec une vue dégagée sur l'Atlas et d'immenses bunkers."], // M35
      ["<h2>Villa Serena, votre camp de base</h2>", "<h2>La Villa Serena, votre camp de base</h2>"], // V21
    ],
    en: [["Palm Ourika: on the same road as the villa, with an open view of the Atlas.", "Palm Ourika: on the same road as the villa, with an open view of the Atlas and huge bunkers."]],
    meta: {
      excerpt: "Marrakech est devenue l'une des grandes destinations de golf d'hiver. Soleil presque garanti, greens soignés, et partout la silhouette enneigée de l'Atlas en toile de fond. Depuis la Villa Serena, au kilomètre 17 de la route de l'Ourika, quatorze parcours sont accessibles en moins de 50 minutes. Voici comment en profiter.", // M34
      metaDescription: "Palm Ourika, Akenza, Samanah, Amelkis… 14 parcours à moins de 50 minutes de la Villa Serena, et nos conseils pour un séjour golf à Marrakech.", // V20
    },
  },
  "marrakech-en-famille": {
    fr: [["À Villa Serena, les journées", "À la Villa Serena, les journées"]], // V23
    en: [],
  },
};

(async () => {
  for (const [slug, data] of Object.entries(SUITES)) {
    const r = await db.room.updateMany({ where: { slug }, data });
    console.log("suite", slug, r.count);
  }
  for (const [slug, plan] of Object.entries(BLOG)) {
    const post = await db.blogPost.findUnique({ where: { slug } });
    if (!post) { console.log("post missing", slug); continue; }
    let content = post.content, contentEn = post.contentEn;
    for (const [a, b] of plan.fr) { if (!content.includes(a) && !content.includes(b)) console.log("  FR not found:", a.slice(0, 50)); content = content.replace(a, b); }
    for (const [a, b] of plan.en) { if (!contentEn.includes(a) && !contentEn.includes(b)) console.log("  EN not found:", a.slice(0, 50)); contentEn = contentEn.replace(a, b); }
    await db.blogPost.update({ where: { id: post.id }, data: { content, contentEn, ...(plan.meta ?? {}) } });
    console.log("post", slug, "updated");
  }
  const authors = await db.blogPost.updateMany({ where: { author: "L'équipe Villa Serena" }, data: { author: "L'équipe de la Villa Serena" } }); // V17
  console.log("authors", authors.count);
  // V14, V15 — photo descriptions in the gallery
  for (const g of await db.galleryImage.findMany()) {
    const alt = g.alt.replace(/ de Villa Serena\b/, " de la Villa Serena").replace(/^Jardin d'oliviers de Villa Serena/, "Jardin d'oliviers de la Villa Serena");
    if (alt !== g.alt) { await db.galleryImage.update({ where: { id: g.id }, data: { alt } }); console.log("alt", alt.slice(0, 60)); }
  }
})().finally(() => db.$disconnect());
