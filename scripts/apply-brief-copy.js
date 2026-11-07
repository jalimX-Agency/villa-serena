// Applies the client's "Document de travail" (6 Nov 2026) copy to the message files.
// French is taken word for word from the brief; English is our translation of it.
// Bracketed [à préciser] passages from the brief are never published.
const fs = require("fs");

const faqFr = [
  ["Où se trouve Villa Serena ?", "Au kilomètre 17 de la route de l'Ourika, à Sidi Bouzguia, juste à côté du parc aquatique du Pickalbatros Aqua Fun Club. Comptez environ 25 minutes jusqu'à la place Jemaa el-Fna et jusqu'à l'aéroport de Marrakech-Ménara."],
  ["Combien de personnes la villa peut-elle accueillir ?", "Jusqu'à 14 personnes, réparties entre le riad (4 suites), le pavillon (2 suites avec salon et cuisine) et le Studio indépendant. La Suite Bleue et le Studio ont un lit de 160 ; dans les cinq autres suites, les lits s'installent séparés ou jumelés."],
  ["Peut-on réserver une seule suite ?", "Non. La villa se loue uniquement en entier : vous ne partagez le domaine avec aucun autre voyageur."],
  ["Quel est le tarif ?", "À partir de 980 € la nuit pour la villa entière, jusqu'à 14 personnes, petit-déjeuner et ménage quotidien inclus. Le tarif varie selon la saison : nous vous le confirmons sous 24 heures pour vos dates. La taxe de séjour n'est pas incluse : elle s'élève à 25 dirhams par personne et par nuit, et les enfants de moins de 12 ans en sont exonérés."],
  ["Quelle est la durée minimale de séjour ?", "4 nuits, et 6 nuits en haute saison et pendant les fêtes de fin d'année."],
  ["Quelles sont les heures d'arrivée et de départ ?", "Arrivée à partir de 16 h, départ avant 11 h."],
  ["Comment réserver et payer ?", "Indiquez vos dates sur la page de demande : nous confirmons sous 24 heures. Un acompte de 50 % confirme la réservation ; le solde est réglé 30 jours avant l'arrivée."],
  ["Quelles sont les conditions d'annulation ?", "En cas d'annulation, nous remboursons une part des sommes déjà versées : 100 % jusqu'à 90 jours avant l'arrivée, 70 % entre 89 et 60 jours, 50 % entre 59 et 14 jours, 20 % à moins de 14 jours."],
  ["Une caution est-elle demandée ?", "Oui. Son montant et sa forme vous sont précisés avec la confirmation de réservation. Elle est restituée après l'état des lieux de départ."],
  ["Quels services sont inclus ?", "Le petit-déjeuner et le ménage quotidien. Le linge de lit et de toilette (serviettes et draps de bain), les serviettes de piscine et les produits d'accueil sont fournis. Wifi par la fibre et parking privé de 7 places. Sur demande : repas préparés par la cuisinière et servis à tout le groupe aux horaires convenus, soins au hammam, massages, excursions, transfert depuis l'aéroport de Marrakech-Ménara."],
  ["La villa convient-elle aux enfants ?", "Oui : jardin, mini ferme, pétanque, badminton et ping-pong sur place, parc aquatique accessible à la journée juste à côté. La piscine n'est équipée ni de barrière ni d'alarme : les enfants doivent rester sous la surveillance constante d'un adulte, comme le prévoient nos conditions générales. La salle de sport est réservée aux plus de 16 ans."],
  ["La piscine est-elle chauffée ?", "La piscine privée de 11 × 5 m, d'une profondeur de 80 cm à 1,80 m, n'est pas chauffée."],
  ["Qui veille sur la villa pendant le séjour ?", "Une gouvernante, qui est aussi la cuisinière de la maison, et une femme de chambre, épaulée par une seconde selon la taille du groupe, vivent sur place, et un gardien assure la nuit, de 18 h à 8 h. Toute l'équipe est là pour vous offrir le meilleur service ; elle observe aussi des temps de pause et de repos, dans le respect du droit du travail. Les horaires de service se conviennent avec la gouvernante à votre arrivée. Un jardinier-pisciniste et un agent de maintenance entretiennent discrètement la piscine, le jardin et la maison. Les abords et les accès extérieurs sont sous vidéosurveillance, et un groupe électrogène prend le relais en cas de coupure de courant."],
  ["Peut-on organiser un événement ?", "Oui. La villa se privatise pour des événements privés jusqu'à 80 invités : anniversaires, fêtes de famille, séminaires, retraites. Chaque événement fait l'objet d'un devis personnalisé."],
];

const faqEn = [
  ["Where is Villa Serena?", "At kilometre 17 on the Ourika road, in Sidi Bouzguia, right next to the Pickalbatros Aqua Fun Club water park. Allow about 25 minutes to Jemaa el-Fna square and to Marrakech-Menara airport."],
  ["How many guests can the villa sleep?", "Up to 14 guests, spread between the riad (4 suites), the pavilion (2 suites with a lounge and kitchen) and the separate Studio. The Blue Suite and the Studio have a 160 cm bed; in the other five suites, the beds can be set up as twins or joined together."],
  ["Can I book a single suite?", "No. The villa is only rented as a whole: you never share the estate with other guests."],
  ["What is the rate?", "From €980 per night for the whole villa, up to 14 guests, breakfast and daily housekeeping included. The rate varies with the season: we confirm it within 24 hours for your dates. Tourist tax is not included: it is 25 dirhams per person per night, and children under 12 are exempt."],
  ["What is the minimum stay?", "4 nights, and 6 nights in high season and over the year-end holidays."],
  ["What are the check-in and check-out times?", "Check-in from 4 pm, check-out before 11 am."],
  ["How do I book and pay?", "Enter your dates on the enquiry page: we confirm within 24 hours. A 50% deposit secures the booking; the balance is due 30 days before arrival."],
  ["What is the cancellation policy?", "If you cancel, we refund part of the amounts already paid: 100% up to 90 days before arrival, 70% between 89 and 60 days, 50% between 59 and 14 days, 20% within 14 days."],
  ["Is a security deposit required?", "Yes. Its amount and form are given with your booking confirmation. It is returned after the check-out inspection."],
  ["Which services are included?", "Breakfast and daily housekeeping. Bed linen and towels (towels and bath sheets), pool towels and toiletries are provided. Fibre wifi and private parking for 7 cars. On request: meals prepared by the cook and served to the whole group at agreed times, hammam treatments, massages, excursions, transfers from Marrakech-Menara airport."],
  ["Is the villa suitable for children?", "Yes: garden, mini farm, pétanque, badminton and table tennis on site, and a water park open by the day right next door. The pool has neither a fence nor an alarm: children must be supervised by an adult at all times, as our terms and conditions require. The gym is reserved for over-16s."],
  ["Is the pool heated?", "The 11 × 5 m private pool, 80 cm to 1.80 m deep, is not heated."],
  ["Who looks after the villa during the stay?", "A housekeeper, who is also the cook, and a maid, helped by a second one depending on the size of the group, live on site, and a guard covers the night from 6 pm to 8 am. The whole team is there to give you the best service; they also take breaks and rest periods, in line with labour law. Service hours are agreed with the housekeeper on arrival. A gardener-pool keeper and a maintenance man discreetly look after the pool, the garden and the house. The grounds and outside access points are under video surveillance, and a generator takes over in case of a power cut."],
  ["Can we host an event?", "Yes. The villa can be hired for private events of up to 80 guests: birthdays, family celebrations, seminars, retreats. Each event is quoted individually."],
];

const fr = {
  nav: {
    home: "Accueil", villa: "La villa", suites: "Les suites", services: "Services",
    servicesRestauration: "Restauration", servicesBienEtre: "Bien-être", servicesExcursions: "Activités et excursions",
    experiences: "Expériences", experiencesMariages: "Événements privés", experiencesGolf: "Golf",
    experiencesRetraites: "Retraites de yoga", gallery: "Galerie", blog: "Blog", contact: "Contact", book: "Faire une demande",
  },
  footer: { tagline: "Villa de charme à louer en exclusivité, route de l'Ourika, Marrakech.", follow_title: "Suivez-nous" },
  hero: {
    tagline: "Route de l'Ourika · à 25 min de Marrakech",
    headline: "Votre villa privée à Marrakech, en exclusivité",
    subheadline: "Ici, tout le domaine est à vous. Sur un hectare d'oliviers, un riad de quatre suites, un pavillon de deux suites et un studio indépendant accueillent jusqu'à 14 personnes. Piscine privée, hammam, potager et mini ferme. Une gouvernante, qui est aussi la cuisinière de la maison, et une équipe de femmes de chambre veillent sur votre séjour.",
    cta_primary: "Découvrir la villa",
  },
  stats: [
    ["6 + 1", "Suites et studio"],
    ["14", "Couchages"],
    ["1 ha", "De jardins et d'oliviers"],
    ["11 × 5 m", "Piscine privée"],
    ["Hammam", "Et salle de sport"],
  ],
  home: {
    welcome_label: "Bienvenue à Villa Serena",
    welcome_title: "Une villa de charme entre Marrakech et l'Atlas",
    welcome_body: "Les suites du riad s'ouvrent sur un patio calme, ouvert sur le ciel. Le soir, on s'y attarde sous les étoiles ; l'hiver, on se retrouve au salon, devant la cheminée. La salle à manger reçoit jusqu'à 14 convives.",
    welcome_body2: "À 25 minutes de la médina, sur la route de la vallée de l'Ourika, la villa offre le calme de la campagne sans l'isolement.",
    suites_label: "Les suites",
    suites_title: "Un riad, un pavillon, un studio",
    suites_sub: "Le domaine se partage en trois espaces. Au riad, les suites Rouge, Bleue, Verte et Rose s'ouvrent sur le patio. Le pavillon abrite les suites Orange et Jaune, avec son salon, sa cuisine, sa terrasse et son jardin. Le Studio, indépendant, offre 45 m² au calme.",
    suites_sub2: "Chaque famille garde son espace, et tout le monde se retrouve autour de la piscine et de la grande table. Toutes les suites sont climatisées, avec salle d'eau privée. La Suite Bleue et le Studio ont un grand lit de 160 ; dans les cinq autres suites, les lits s'installent séparés ou jumelés.",
    experiences_label: "Bien-être et loisirs",
    experiences_title: "Du hammam à la mini ferme",
    experiences_sub: "Hammam traditionnel, salle de massage et salle de sport pour prendre soin de soi. Au jardin : potager, mini ferme et volières, bassin de carpes koï, terrain de pétanque, badminton et ping-pong. Avec des enfants, le parc aquatique du Pickalbatros Aqua Fun Club, juste à côté de la villa, est accessible à la journée (entrée payante).",
    cta_title: "Réservez la villa entière",
    cta_body: "À partir de 980 € la nuit, pour le domaine entier et jusqu'à 14 personnes, petit-déjeuner et ménage quotidien inclus (hors taxe de séjour). Idéal pour une réunion de famille, un anniversaire, un séjour golf ou un séminaire. Réponse sous 24 heures, sans engagement.",
    cta_button: "Faire une demande",
    cta_eyebrow: "6 suites + 1 studio · 14 couchages · villa entière",
  },
  journey: {
    eyebrow: "Une journée à Villa Serena",
    morning: { label: "Le matin", title: "Le jour se lève sur les oliviers", body: "Une séance de yoga dans le jardin, dans l'air encore frais. La villa s'éveille pour vous seuls." },
    noon: { label: "Midi", title: "Déjeuner en terrasse", body: "Au bord de la piscine ou sous les oliviers : une cuisine marocaine préparée sur place. Le domaine n'est qu'à vous et à vos proches." },
    afternoon: { label: "L'après-midi", title: "La chaleur du hammam", body: "Gommage au savon noir, massage à l'huile d'argan. Le temps ralentit, la lumière devient dorée." },
    night: { label: "Le soir", title: "Dîner sous les étoiles ou dans le patio", body: "Les bougies s'allument autour du riad. Une table pour quatorze, et toute la villa rien que pour vous." },
  },
  faq: { label: "Questions fréquentes", title: "Tout savoir avant de réserver", all: "Toutes les questions", items: faqFr.map(([q, a]) => ({ q, a })) },
  seo: {
    home: { title: "Location villa privée Marrakech avec piscine | Villa Serena", description: "Route de l'Ourika : 6 suites et un studio sur un hectare, 14 couchages, piscine privée, hammam, personnel sur place. Dès 980 € la nuit, villa entière." },
    villa: { title: "Villa de charme route de l'Ourika, Marrakech | Villa Serena", description: "Un hectare d'oliviers au km 17 de la route de l'Ourika : riad et patio, pavillon, studio, piscine privée de 11 × 5 m, potager, mini ferme et hammam." },
    suites: { title: "Suites et studio avec piscine à Marrakech | Villa Serena", description: "Sur un hectare, route de l'Ourika : riad de 4 suites, pavillon de 2 suites avec cuisine, studio indépendant. 14 couchages, grands lits ou lits jumelables." },
    services: { title: "Villa avec personnel à Marrakech : services | Villa Serena", description: "Gouvernante-cuisinière et femmes de chambre sur place, hammam, salle de sport, potager et activités sur la route de l'Ourika : nos services." },
    experiences: { title: "Événements, golf et retraites en villa privée | Villa Serena", description: "Privatisez Villa Serena pour un événement privé jusqu'à 80 personnes, un séjour golf au milieu de 14 parcours ou une retraite de yoga, route de l'Ourika." },
    reservation: { title: "Louer la villa à Marrakech : tarif | Villa Serena", description: "Dès 980 € la nuit pour la villa entière, jusqu'à 14 personnes, petit-déjeuner et ménage inclus. Séjour de 4 nuits minimum. Réponse sous 24 h." },
  },
  villa: { h1: "Une villa de charme sur la route de l'Ourika" },
  suites: { h1: "Six suites et un studio, pour 14 personnes" },
  services: { h1: "Les services de la villa" },
  experiences: { h1: "Privatiser une villa à Marrakech" },
  reservation: { h1: "Réservez le domaine, rien que pour vous", villa_summary: "6 suites + 1 studio · 14 couchages · Exclusivité totale" },
  gallery: { h1: "Villa Serena en images : suites, piscine et jardin", page_sub: "Patio d'inspiration riad, piscine privée de 11 × 5 m, un hectare d'oliviers, potager et mini ferme, hammam, pavillon et six suites colorées : visitez la villa photo par photo avant de faire votre demande." },
};

const en = {
  nav: {
    home: "Home", villa: "The villa", suites: "The suites", services: "Services",
    servicesRestauration: "Dining", servicesBienEtre: "Wellness", servicesExcursions: "Activities and excursions",
    experiences: "Experiences", experiencesMariages: "Private events", experiencesGolf: "Golf",
    experiencesRetraites: "Yoga retreats", gallery: "Gallery", blog: "Blog", contact: "Contact", book: "Send an enquiry",
  },
  footer: { tagline: "A charming villa to rent exclusively, on the Ourika road, Marrakech.", follow_title: "Follow us" },
  hero: {
    tagline: "Ourika road · 25 min from Marrakech",
    headline: "Your private villa in Marrakech, exclusively yours",
    subheadline: "Here, the whole estate is yours. On one hectare of olive trees, a riad with four suites, a pavilion with two suites and a separate studio sleep up to 14 guests. Private pool, hammam, vegetable garden and mini farm. A housekeeper, who is also the house cook, and a team of maids look after your stay.",
    cta_primary: "Discover the villa",
  },
  stats: [
    ["6 + 1", "Suites and studio"],
    ["14", "Beds"],
    ["1 ha", "Of gardens and olive trees"],
    ["11 × 5 m", "Private pool"],
    ["Hammam", "And gym"],
  ],
  home: {
    welcome_label: "Welcome to Villa Serena",
    welcome_title: "A charming villa between Marrakech and the Atlas",
    welcome_body: "The riad's suites open onto a quiet patio, open to the sky. In the evening, you linger there under the stars; in winter, everyone gathers in the lounge by the fire. The dining room seats up to 14.",
    welcome_body2: "Twenty-five minutes from the medina, on the road to the Ourika valley, the villa offers the calm of the countryside without the isolation.",
    suites_label: "The suites",
    suites_title: "A riad, a pavilion, a studio",
    suites_sub: "The estate is split into three spaces. In the riad, the Red, Blue, Green and Pink suites open onto the patio. The pavilion houses the Orange and Yellow suites, with its own lounge, kitchen, terrace and garden. The separate Studio offers 45 m² of calm.",
    suites_sub2: "Each family keeps its own space, and everyone meets around the pool and the big table. All suites are air-conditioned, with a private shower room. The Blue Suite and the Studio have a 160 cm bed; in the other five suites, the beds can be set up as twins or joined together.",
    experiences_label: "Wellness and leisure",
    experiences_title: "From the hammam to the mini farm",
    experiences_sub: "A traditional hammam, massage room and gym to look after yourself. In the garden: vegetable garden, mini farm and aviaries, koi pond, pétanque court, badminton and table tennis. With children, the Pickalbatros Aqua Fun Club water park, right next to the villa, is open by the day (paid entry).",
    cta_title: "Book the whole villa",
    cta_body: "From €980 per night for the whole estate and up to 14 guests, breakfast and daily housekeeping included (tourist tax extra). Ideal for a family reunion, a birthday, a golf trip or a seminar. Reply within 24 hours, no commitment.",
    cta_button: "Send an enquiry",
    cta_eyebrow: "6 suites + 1 studio · sleeps 14 · whole villa",
  },
  journey: {
    eyebrow: "A day at Villa Serena",
    morning: { label: "Morning", title: "Sunrise over the olive trees", body: "Yoga in the garden while the air is still cool. The villa wakes up for you alone." },
    noon: { label: "Midday", title: "Lunch on the terrace", body: "By the pool or under the olive trees: Moroccan cooking prepared on site. The estate belongs only to you and your guests." },
    afternoon: { label: "Afternoon", title: "The warmth of the hammam", body: "Black-soap scrub, argan-oil massage. Time slows down and the light turns golden." },
    night: { label: "Evening", title: "Dinner under the stars or in the patio", body: "Candles flicker around the riad. A table for fourteen, and the whole villa just for you." },
  },
  faq: { label: "Frequently asked questions", title: "Good to know before you book", all: "All questions", items: faqEn.map(([q, a]) => ({ q, a })) },
  seo: {
    home: { title: "Private Villa Rental in Marrakech with Pool | Villa Serena", description: "Villa Serena on the Ourika road: 6 suites and a studio on one hectare, sleeping 14, private pool, hammam and on-site staff. From €980 per night for the whole villa." },
    villa: { title: "Charming Villa on the Ourika Road, Marrakech | Villa Serena", description: "One hectare of olive trees at km 17 on the Ourika road: riad and patio, pavilion, studio, 11 × 5 m private pool, vegetable garden, mini farm and hammam." },
    suites: { title: "Suites and Studio with Pool in Marrakech | Villa Serena", description: "On one hectare: a riad with 4 suites, a pavilion with 2 suites and a kitchen, and a separate studio. Sleeps 14, twin or double beds, rented exclusively." },
    services: { title: "Marrakech Villa with Staff: Cook, Hammam | Villa Serena", description: "Housekeeper-cook and maids on site, hammam, gym, vegetable garden and activities along the Ourika road: the services of Villa Serena." },
    experiences: { title: "Private Events, Golf and Retreats in Marrakech | Villa Serena", description: "Hire Villa Serena for a private event of up to 80 guests, a golf trip with 14 courses nearby or a yoga retreat, on the Ourika road." },
    reservation: { title: "Book the Villa in Marrakech: Rate & Booking | Villa Serena", description: "From €980 per night for the whole villa, up to 14 guests, breakfast and daily housekeeping included. 4-night minimum stay. Reply within 24 hours." },
  },
  villa: { h1: "A charming villa on the Ourika road" },
  suites: { h1: "Six suites and a studio, sleeping 14" },
  services: { h1: "The villa's services" },
  experiences: { h1: "Hire a private villa in Marrakech" },
  reservation: { h1: "Book the whole estate, just for you", villa_summary: "6 suites + 1 studio · Sleeps 14 · Full exclusivity" },
  gallery: { h1: "Villa Serena in pictures: suites, pool and garden", page_sub: "A riad-style patio, an 11 × 5 m private pool, one hectare of olive trees, vegetable garden and mini farm, hammam, pavilion and six colourful suites: tour the villa photo by photo before you send your enquiry." },
};

const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
function merge(t, p) {
  for (const [k, v] of Object.entries(p)) (isObj(v) && isObj(t[k]) ? merge(t[k], v) : (t[k] = v));
  return t;
}
for (const [file, patch] of [["src/messages/fr.json", fr], ["src/messages/en.json", en]]) {
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  fs.writeFileSync(file, JSON.stringify(merge(json, patch), null, 2) + "\n");
}
console.log("brief copy applied");
