// Suites list page copy (client brief ch. 07). FR word for word, EN our translation.
const fs = require("fs");

const fr = {
  page_title: "Les suites",
  page_sub: "Le domaine se partage en trois espaces. Le riad réunit les suites Rouge, Bleue, Verte et Rose autour du patio. Le pavillon abrite les suites Orange et Jaune, avec salon, cuisine, terrasse et jardin privés. Le Studio, indépendant, se tient à l'écart. La Suite Bleue et le Studio ont un grand lit de 160 ; ailleurs, les lits s'installent séparés ou jumelés. L'ensemble se réserve en entier, avec la villa.",
  intro: "Chaque famille a son intimité : une famille dans le pavillon, les amis au riad, les grands-parents dans le Studio. Et tout le monde partage la piscine, le hammam et la table.",
  spaces: {
    riad: { label: "Le riad", title: "Quatre suites autour du patio", body: "Les suites Rouge, Bleue, Verte et Rose s'ouvrent sur le patio, le cœur silencieux de la villa." },
    pavillon: { label: "Le pavillon", title: "Une maison dans la maison", body: "Les suites Orange et Jaune partagent un salon, une cuisine indépendante, une terrasse et un jardin privés." },
    independant: { label: "Indépendant", title: "Le Studio, à l'écart", body: "45 m² au calme, avec coin salon et machine Nespresso, à quelques pas de la piscine." },
  },
  table_title: "Répartition des couchages",
  table: { space: "Espace", unit: "Hébergement", size: "Surface", bed: "Literie", guests: "Pers.", total: "Total", total_units: "6 suites + 1 studio" },
  space_names: { riad: "Riad, autour du patio", pavillon: "Pavillon (salon, cuisine, terrasse et jardin privés)", independant: "Indépendant" },
  all_rooms_include: "Toutes les suites incluent",
  includes: ["Salle d'eau et toilettes privées", "Climatisation", "Linge de lit", "Linge de toilette (serviettes et draps de bain)", "Produits d'accueil", "Ménage quotidien", "Petit-déjeuner", "Wifi par la fibre"],
  includes_note: "Des serviettes de piscine sont mises à votre disposition. Les suites Rouge et Verte et le Studio disposent d'une terrasse orientée sud, avec vue sur la piscine.",
  ideal_for: "Idéale pour",
  ideal_for_m: "Idéal pour",
  photos_soon: "Photos à venir",
  whole_villa_note: "Villa Serena se loue exclusivement dans son intégralité : 6 suites, 1 studio, 14 couchages.",
};

const en = {
  page_title: "The suites",
  page_sub: "The estate is split into three spaces. The riad brings together the Red, Blue, Green and Pink suites around the patio. The pavilion houses the Orange and Yellow suites, with a private lounge, kitchen, terrace and garden. The separate Studio stands apart. The Blue Suite and the Studio have a large 160 cm bed; elsewhere, the beds can be set up as twins or joined. Everything is booked together, with the villa.",
  intro: "Each family has its privacy: a family in the pavilion, friends in the riad, grandparents in the Studio. And everyone shares the pool, the hammam and the table.",
  spaces: {
    riad: { label: "The riad", title: "Four suites around the patio", body: "The Red, Blue, Green and Pink suites open onto the patio, the quiet heart of the villa." },
    pavillon: { label: "The pavilion", title: "A house within the house", body: "The Orange and Yellow suites share a lounge, a separate kitchen, a private terrace and garden." },
    independant: { label: "Independent", title: "The Studio, set apart", body: "45 m² of calm, with a sitting area and a Nespresso machine, a few steps from the pool." },
  },
  table_title: "Bed allocation",
  table: { space: "Space", unit: "Accommodation", size: "Size", bed: "Beds", guests: "Guests", total: "Total", total_units: "6 suites + 1 studio" },
  space_names: { riad: "Riad, around the patio", pavillon: "Pavilion (private lounge, kitchen, terrace and garden)", independant: "Independent" },
  all_rooms_include: "Every suite includes",
  includes: ["Private shower room and WC", "Air conditioning", "Bed linen", "Towels (towels and bath sheets)", "Toiletries", "Daily housekeeping", "Breakfast", "Fibre wifi"],
  includes_note: "Pool towels are provided. The Red and Green suites and the Studio have a south-facing terrace overlooking the pool.",
  ideal_for: "Ideal for",
  ideal_for_m: "Ideal for",
  photos_soon: "Photos coming soon",
  whole_villa_note: "Villa Serena is rented exclusively as a whole: 6 suites, 1 studio, sleeping 14.",
};

for (const [file, patch] of [["src/messages/fr.json", fr], ["src/messages/en.json", en]]) {
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  json.suites = { ...json.suites, ...patch };
  fs.writeFileSync(file, JSON.stringify(json, null, 2) + "\n");
}
console.log("suites copy applied");
