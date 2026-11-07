const fs = require("fs");
const fr = {
  cookie: {
    title: "Cookies",
    body: "Nous utilisons des cookies pour mesurer l'audience et améliorer votre visite. Vous pouvez les accepter, les refuser ou choisir lesquels autoriser. Les cookies nécessaires au fonctionnement du site restent actifs.",
    accept: "Tout accepter", decline: "Tout refuser", customize: "Personnaliser", save: "Enregistrer",
    necessary: "Cookies nécessaires (toujours actifs)", analytics: "Mesure d'audience",
  },
  reservation: {
    page_sub: "Indiquez vos dates et le nombre de voyageurs : nous vous confirmons la disponibilité sous 24 heures, sans engagement.",
    essentials_title: "L'essentiel",
    essentials: [
      ["Tarif", "À partir de 980 € la nuit, villa entière, jusqu'à 14 personnes, selon la saison"],
      ["Taxe de séjour", "Non incluse : 25 dirhams par personne et par nuit, enfants de moins de 12 ans exonérés"],
      ["Inclus", "Petit-déjeuner, ménage quotidien, linge de lit et de toilette, serviettes de piscine, produits d'accueil, wifi par la fibre, parking privé"],
      ["Séjour minimum", "4 nuits ; 6 nuits en haute saison et pendant les fêtes"],
      ["Arrivée / départ", "À partir de 16 h / avant 11 h"],
      ["Paiement", "50 % à la réservation, solde 30 jours avant l'arrivée"],
      ["Caution", "Précisée avec la confirmation de réservation, restituée après l'état des lieux"],
    ],
    rate_note: "Tarif selon les dates, confirmé sous 24 heures.",
  },
  gallery: {
    cat_all: "Tout", cat_riad: "Le riad", cat_pavillon: "Le pavillon", cat_studio: "Le Studio",
    "cat_piscine-jardin": "Piscine et jardin", "cat_potager-ferme": "Potager et mini ferme", "cat_bien-etre": "Bien-être", cat_table: "Table",
  },
};
const en = {
  cookie: {
    title: "Cookies",
    body: "We use cookies to measure our audience and improve your visit. You can accept them, refuse them or choose which ones to allow. Cookies needed for the site to work stay active.",
    accept: "Accept all", decline: "Refuse all", customize: "Customise", save: "Save",
    necessary: "Necessary cookies (always on)", analytics: "Audience measurement",
  },
  reservation: {
    page_sub: "Tell us your dates and the number of guests: we confirm availability within 24 hours, with no commitment.",
    essentials_title: "Key facts",
    essentials: [
      ["Rate", "From €980 per night, whole villa, up to 14 guests, depending on the season"],
      ["Tourist tax", "Not included: 25 dirhams per person per night, children under 12 exempt"],
      ["Included", "Breakfast, daily housekeeping, bed linen and towels, pool towels, toiletries, fibre wifi, private parking"],
      ["Minimum stay", "4 nights; 6 nights in high season and over the holidays"],
      ["Check-in / check-out", "From 4 pm / before 11 am"],
      ["Payment", "50% on booking, balance 30 days before arrival"],
      ["Security deposit", "Given with your booking confirmation, returned after the check-out inspection"],
    ],
    rate_note: "Rate depends on your dates, confirmed within 24 hours.",
  },
  gallery: {
    cat_all: "All", cat_riad: "The riad", cat_pavillon: "The pavilion", cat_studio: "The Studio",
    "cat_piscine-jardin": "Pool and garden", "cat_potager-ferme": "Vegetable garden and mini farm", "cat_bien-etre": "Wellness", cat_table: "Dining",
  },
};
for (const [file, patch] of [["src/messages/fr.json", fr], ["src/messages/en.json", en]]) {
  const j = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const [k, v] of Object.entries(patch)) j[k] = { ...j[k], ...v };
  fs.writeFileSync(file, JSON.stringify(j, null, 2) + "\n");
}
console.log("stage 4 copy applied");
