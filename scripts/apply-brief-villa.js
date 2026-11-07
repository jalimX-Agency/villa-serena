// La villa page copy from the client brief (ch. 06). FR word for word; EN is our translation.
const fs = require("fs");

const fr = {
  ambiance_label: "L'esprit de la villa",
  intro: "Nos suites, disposées autour d'un patio d'inspiration riad, offrent un cadre calme et enchanteur. Admirez le ciel étoilé depuis le patio, profitez du salon avec cheminée et d'une salle à manger pouvant accueillir jusqu'à 14 personnes. La décoration ethnique et bohème, chinée et retravaillée par des artisans de Marrakech, crée une atmosphère chaleureuse et élégante.",
  page_sub: "Un hectare d'oliviers au kilomètre 17 de la route de l'Ourika : riad et patio, pavillon, studio, piscine privée, potager et mini ferme.",
  blocks: [
    { key: "riad", title: "La villa : un riad au milieu des oliviers", body: "Les quatre suites du riad s'ouvrent sur un patio, le cœur silencieux de la villa. Les soirées s'y prolongent à la lueur des bougies, sous le ciel du Haouz." },
    { key: "patio", title: "Le patio : un ciel étoilé, un feu de cheminée, une tablée de 14", body: "Autour du patio, le salon et sa cheminée accueillent les soirées d'hiver. La salle à manger reçoit jusqu'à 14 convives pour des repas partagés." },
    { key: "pavillon", title: "Le pavillon : une maison dans la maison", body: "Un peu à l'écart du riad, le pavillon réunit les suites Orange et Jaune autour d'un salon et d'une cuisine indépendante. Sa terrasse et son jardin privés en font le refuge idéal d'une famille avec enfants ou de deux couples qui aiment vivre à leur rythme." },
    { key: "studio", title: "Le Studio : l'indépendance", body: "Isolé du reste de la maison, le Studio offre 45 m² de calme, avec son coin salon et sa machine Nespresso. Il séduira celles et ceux qui aiment avoir leur propre rythme : des grands-parents, un duo d'amis, ou l'organisateur d'un séminaire qui cherche un espace au calme pour travailler." },
    { key: "piscine", title: "La piscine privée : un grand bain rien que pour vous", body: "Au cœur du jardin, la piscine de 11 × 5 m n'est partagée avec aucun autre voyageur. Sa profondeur va de 80 cm à 1,80 m : on y nage comme on s'y prélasse. Transats, parasols et douche extérieure vous attendent, et le déjeuner peut y être servi à l'ombre." },
    { key: "jardin", title: "Le jardin : carpes koï et silence retrouvé", body: "Oliviers, potager, mini ferme, volières, bassin de carpes koï, statue de Bouddha et terrain de pétanque : un refuge végétal à 25 minutes de l'agitation de la médina. Les légumes du potager se retrouvent à votre table. À la mini ferme vivent chèvres, brebis, poules et canards, sous l'œil du paon." },
    { key: "bienetre", title: "Bien-être : hammam, massage et salle de sport", body: "Hammam traditionnel, salle de massage, salle de sport et espace de yoga et de relaxation, sous le même toit. De quoi prendre soin de soi entre deux excursions. Les soins et les cours sont détaillés dans la page Services." },
  ],
  situation_title: "Situation : route de l'Ourika, km 17",
  situation_body: "Villa Serena se trouve au kilomètre 17 de la route de l'Ourika, à Sidi Bouzguia, juste à côté du parc aquatique du Pickalbatros Aqua Fun Club. Vous êtes à environ 25 minutes de la place Jemaa el-Fna et de l'aéroport de Marrakech-Ménara, et sur la route de la vallée de l'Ourika et des contreforts de l'Atlas.",
  situation_from: "Depuis la villa",
  situation_time: "Temps de trajet",
  distances: [
    ["Parc aquatique Pickalbatros Aqua Fun Club (entrée payante à la journée)", "quelques minutes"],
    ["Golfs Palm Ourika et Akenza", "~12 min"],
    ["Place Jemaa el-Fna, médina", "~25 min"],
    ["Aéroport Marrakech-Ménara", "~25 min"],
    ["Vallée de l'Ourika (Setti Fatma)", "~30 min"],
    ["Désert d'Agafay", "~35 min"],
  ],
  cta_title: "Envie de découvrir la villa ?",
  cta_body: "Parcourez les suites ou faites une demande pour réserver la villa en exclusivité.",
};

const en = {
  ambiance_label: "The spirit of the villa",
  intro: "Our suites, set around a riad-style patio, offer a calm and enchanting setting. Admire the starry sky from the patio, enjoy the lounge with its fireplace and a dining room that seats up to 14. The ethnic, bohemian decoration, sourced and reworked by Marrakech craftsmen, creates a warm and elegant atmosphere.",
  page_sub: "One hectare of olive trees at kilometre 17 on the Ourika road: riad and patio, pavilion, studio, private pool, vegetable garden and mini farm.",
  blocks: [
    { key: "riad", title: "The villa: a riad among the olive trees", body: "The riad's four suites open onto a patio, the quiet heart of the villa. Evenings stretch on there by candlelight, under the Haouz sky." },
    { key: "patio", title: "The patio: a starry sky, a log fire, a table for 14", body: "Around the patio, the lounge and its fireplace host winter evenings. The dining room seats up to 14 for shared meals." },
    { key: "pavillon", title: "The pavilion: a house within the house", body: "Slightly apart from the riad, the pavilion brings together the Orange and Yellow suites around a lounge and a separate kitchen. Its private terrace and garden make it the ideal retreat for a family with children, or two couples who like to live at their own pace." },
    { key: "studio", title: "The Studio: independence", body: "Set apart from the rest of the house, the Studio offers 45 m² of calm, with its sitting area and Nespresso machine. It suits those who like their own rhythm: grandparents, two friends, or a seminar organiser looking for a quiet place to work." },
    { key: "piscine", title: "The private pool: a big pool just for you", body: "In the heart of the garden, the 11 × 5 m pool is never shared with other guests. From 80 cm to 1.80 m deep, it is as good for swimming as for lounging. Sunbeds, parasols and an outdoor shower await, and lunch can be served in the shade." },
    { key: "jardin", title: "The garden: koi carp and rediscovered silence", body: "Olive trees, vegetable garden, mini farm, aviaries, koi pond, Buddha statue and pétanque court: a green refuge 25 minutes from the bustle of the medina. Vegetables from the garden end up on your table. The mini farm is home to goats, sheep, hens and ducks, watched over by the peacock." },
    { key: "bienetre", title: "Wellness: hammam, massage and gym", body: "A traditional hammam, massage room, gym and a yoga and relaxation space, all under one roof. Everything you need to look after yourself between two excursions. Treatments and classes are detailed on the Services page." },
  ],
  situation_title: "Location: Ourika road, km 17",
  situation_body: "Villa Serena is at kilometre 17 on the Ourika road, in Sidi Bouzguia, right next to the Pickalbatros Aqua Fun Club water park. You are about 25 minutes from Jemaa el-Fna square and Marrakech-Menara airport, and on the road to the Ourika valley and the foothills of the Atlas.",
  situation_from: "From the villa",
  situation_time: "Travel time",
  distances: [
    ["Pickalbatros Aqua Fun Club water park (paid day entry)", "a few minutes"],
    ["Palm Ourika and Akenza golf courses", "~12 min"],
    ["Jemaa el-Fna square, medina", "~25 min"],
    ["Marrakech-Menara airport", "~25 min"],
    ["Ourika valley (Setti Fatma)", "~30 min"],
    ["Agafay desert", "~35 min"],
  ],
  cta_title: "Would you like to discover the villa?",
  cta_body: "Browse the suites or send an enquiry to book the villa exclusively.",
};

for (const [file, patch] of [["src/messages/fr.json", fr], ["src/messages/en.json", en]]) {
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  json.villa = { ...json.villa, ...patch };
  delete json.villa.story; // replaced by the alternating blocks
  fs.writeFileSync(file, JSON.stringify(json, null, 2) + "\n");
}
console.log("villa copy applied");
