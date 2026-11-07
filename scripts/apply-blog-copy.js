const fs = require("fs");
const fr = {
  blog: {
    page_title: "Le blog",
    h1: "Le blog de Villa Serena : nos guides autour de Marrakech",
    page_sub: "Conseils d'hôtes qui connaissent leur région : la vallée de l'Ourika, le golf, Marrakech en famille. Un nouvel article chaque mois.",
    read_more: "Lire l'article",
    min_read: "min de lecture",
    toc: "Sommaire",
    back: "Tous les articles",
    by: "Par",
    related: "À lire aussi",
    empty: "Les premiers articles arrivent bientôt.",
    cat_guides: "Guides", cat_golf: "Golf", cat_famille: "Famille",
    cta_title: "Séjourner à Villa Serena",
    cta_body: {
      "que-faire-vallee-ourika": "Une villa privée au kilomètre 17 de la route de l'Ourika, pour 14 personnes, avec piscine, hammam et personnel sur place.",
      "golf-marrakech-route-ourika": "14 parcours autour de la villa, transferts et green fees organisés sur demande, hammam et cuisine sur place.",
      "marrakech-en-famille": "Une villa privée pour 14 personnes, avec mini ferme, jardin d'un hectare et parc aquatique à côté.",
      default: "Une villa privée au kilomètre 17 de la route de l'Ourika, pour 14 personnes, avec piscine, hammam et personnel sur place.",
    },
  },
  seo: { blog: { title: "Blog : guides de Marrakech et de l'Ourika | Villa Serena", description: "Vallée de l'Ourika, golf à Marrakech, vacances en famille : les conseils de Villa Serena, villa de charme sur la route de l'Ourika." } },
};
const en = {
  blog: {
    page_title: "Journal",
    h1: "The Villa Serena journal: our guides around Marrakech",
    page_sub: "Tips from hosts who know their region: the Ourika valley, golf, Marrakech with the family. A new article every month.",
    read_more: "Read the article",
    min_read: "min read",
    toc: "Contents",
    back: "All articles",
    by: "By",
    related: "Also worth reading",
    empty: "The first articles are coming soon.",
    cat_guides: "Guides", cat_golf: "Golf", cat_famille: "Family",
    cta_title: "Stay at Villa Serena",
    cta_body: {
      "que-faire-vallee-ourika": "A private villa at kilometre 17 on the Ourika road, sleeping 14, with a pool, hammam and staff on site.",
      "golf-marrakech-route-ourika": "14 courses around the villa, transfers and green fees arranged on request, hammam and cooking on site.",
      "marrakech-en-famille": "A private villa sleeping 14, with a mini farm, a one-hectare garden and a water park next door.",
      default: "A private villa at kilometre 17 on the Ourika road, sleeping 14, with a pool, hammam and staff on site.",
    },
  },
  seo: { blog: { title: "Journal: Marrakech and Ourika Guides | Villa Serena", description: "The Ourika valley, golf in Marrakech, family holidays: tips from Villa Serena, a charming villa on the Ourika road." } },
};
for (const [file, patch] of [["src/messages/fr.json", fr], ["src/messages/en.json", en]]) {
  const j = JSON.parse(fs.readFileSync(file, "utf8"));
  j.blog = { ...j.blog, ...patch.blog };
  j.seo.blog = patch.seo.blog;
  fs.writeFileSync(file, JSON.stringify(j, null, 2) + "\n");
}
console.log("blog copy applied");
