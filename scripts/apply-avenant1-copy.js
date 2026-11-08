// Avenant n° 1 (8 Nov 2026) — message files. FR is the avenant's "Texte à publier", word for
// word; EN is our translation of it (avenant R4: "queen size bed", "maid", "house rules",
// "terms of sale"). Each line notes its modification number.
const fs = require("fs");
const fr = JSON.parse(fs.readFileSync("src/messages/fr.json", "utf8"));
const en = JSON.parse(fs.readFileSync("src/messages/en.json", "utf8"));

// ── Accueil ──
fr.hero.subheadline = "Ici, tout le domaine est à vous. Sur un hectare d'oliviers, un riad de quatre suites, un pavillon de deux suites et un studio indépendant accueillent jusqu'à 14 personnes. Piscine privée, hammam, potager et mini ferme. Une gouvernante, qui est aussi la cuisinière de la maison, et une femme de chambre veillent sur votre séjour."; // M46
en.hero.subheadline = "Here, the whole estate is yours. On one hectare of olive trees, a riad with four suites, a pavilion with two suites and a separate studio sleep up to 14 guests. Private pool, hammam, vegetable garden and mini farm. A housekeeper, who is also the house cook, and a maid look after your stay.";
fr.home.welcome_label = "Bienvenue à la Villa Serena"; // M36
fr.home.welcome_body = "Les suites du riad s'ouvrent sur un patio couvert d'une verrière amovible. Le soir, on s'y attarde sous les étoiles ; l'hiver, on se retrouve au salon, devant la cheminée. La salle à manger reçoit jusqu'à 14 convives."; // M07
en.home.welcome_body = "The riad's suites open onto a patio covered by a retractable glass roof. In the evening, you linger there under the stars; in winter, everyone gathers in the lounge by the fire. The dining room seats up to 14.";
fr.home.welcome_body2 = "À 25 minutes de la médina, sur la route de la vallée de l'Ourika, la villa offre le calme de la campagne, non loin de l'effervescence."; // M08
en.home.welcome_body2 = "Twenty-five minutes from the medina, on the road to the Ourika valley, the villa offers the calm of the countryside, never far from the bustle.";
fr.home.suites_sub = "Le domaine se partage en trois espaces. Au riad, les suites Rouge, Bleue, Verte et Rose s'ouvrent sur le patio. Le pavillon abrite les suites Orange et Jaune, avec son salon, sa cuisine, sa terrasse et son jardin. Le Studio offre 45 m² au calme, en toute indépendance."; // M11
en.home.suites_sub = "The estate is split into three spaces. In the riad, the Red, Blue, Green and Pink suites open onto the patio. The pavilion houses the Orange and Yellow suites, with its own lounge, kitchen, terrace and garden. The Studio offers 45 m² of calm, in complete independence.";
fr.home.suites_sub2 = "Chacun son intimité, tous ensemble le reste du temps : autour de la piscine, à la grande table, les familles se retrouvent. Toutes les suites sont climatisées, avec salle d'eau privée. La Suite Bleue et le Studio offrent chacun un lit queen size ; les cinq autres suites proposent des lits séparés ou jumelés, à votre convenance."; // M12
en.home.suites_sub2 = "Privacy for each, togetherness the rest of the time: around the pool and at the big table, families come together. All suites are air-conditioned, with a private shower room. The Blue Suite and the Studio each have a queen-size bed; the other five suites offer twin or joined beds, as you prefer.";
fr.journey.eyebrow = "Une journée à la Villa Serena"; // M36 V02
fr.journey.noon.body = "Au bord de la piscine ou sous les oliviers : une cuisine marocaine préparée sur place. Le domaine n'appartient qu'à vous."; // M09
en.journey.noon.body = "By the pool or under the olive trees: Moroccan cooking prepared on site. The estate belongs to you alone.";
fr.journey.night = { label: "Le soir", title: "À la nuit tombée", body: "Les bougies illuminent le riad. Sous les étoiles ou dans le patio, vos invités prennent place autour de la table." }; // M10
en.journey.night = { label: "Evening", title: "As night falls", body: "Candles light up the riad. Under the stars or in the patio, your guests take their seats around the table." };

// ── La villa ──
const block = (j, key) => j.villa.blocks.find((b) => b.key === key);
block(fr, "studio").body = "À l'écart du reste de la maison, le Studio offre 45 m² de calme, avec son coin salon et sa machine Nespresso. Il séduira celles et ceux qui aiment avoir leur propre rythme : des grands-parents, un duo d'amis, ou l'organisateur d'un séminaire qui cherche un espace au calme pour travailler."; // M13
block(fr, "jardin").body = "Oliviers, potager, mini ferme, volières, bassin de carpes koï, statue de Bouddha et terrain de pétanque : un refuge végétal à 25 minutes de l'agitation de la médina. Les légumes du potager se retrouvent à votre table. À la mini ferme, chèvres, brebis, poules et canards vivent en liberté sous l'œil du paon. Les enfants s'émerveillent, les grands retombent en enfance."; // M14
block(en, "jardin").body = "Olive trees, vegetable garden, mini farm, aviaries, koi pond, Buddha statue and pétanque court: a green refuge 25 minutes from the bustle of the medina. Vegetables from the garden end up on your table. At the mini farm, goats, sheep, hens and ducks roam free under the peacock's eye. Children are amazed, grown-ups feel like children again.";
block(fr, "bienetre").body = "Hammam traditionnel, salle de massage, salle de sport, espace de yoga et de relaxation, sous le même toit. De quoi prendre soin de soi entre deux excursions. Les soins et les cours sont détaillés dans la page Services."; // M15
fr.villa.situation_body = "Au kilomètre 17 de la route de l'Ourika, à Sidi Bouzguia, la Villa Serena vous place à mi-chemin entre deux mondes : l'effervescence de Marrakech, à environ 25 minutes, et les paysages de la vallée de l'Ourika et des contreforts de l'Atlas, à deux pas."; // M16
en.villa.situation_body = "At kilometre 17 on the Ourika road, in Sidi Bouzguia, Villa Serena places you halfway between two worlds: the bustle of Marrakech, about 25 minutes away, and the landscapes of the Ourika valley and the Atlas foothills, right on your doorstep.";

// ── Les suites ──
fr.suites.all_rooms_include = "Toutes les suites comprennent"; // M17
fr.suites.includes_note = "Des serviettes de piscine sont mises à votre disposition. Les suites Rouge et Verte et le Studio disposent d'une terrasse orientée sud, avec vue piscine."; // M17
fr.suites.whole_villa_note = "La Villa Serena se loue exclusivement dans son intégralité : 6 suites, 1 studio, 14 couchages."; // M36

// ── Services ──
fr.servicesPage.lead = "Une équipe vit sur place et veille sur votre séjour : une gouvernante, qui est aussi votre cuisinière, une femme de chambre et un gardien la nuit, de 18 h à 8 h. Le petit-déjeuner et le ménage quotidien sont inclus ; le reste s'organise sur demande."; // M20
en.servicesPage.lead = "A team lives on site and looks after your stay: a housekeeper, who is also your cook, a maid and a night guard from 6 pm to 8 am. Breakfast and daily housekeeping are included; everything else is arranged on request.";
fr.servicesPage.serenity = "En coulisses, un jardinier-pisciniste et un agent de maintenance prennent soin, chaque jour et en toute discrétion, de la piscine, du jardin et de la maison. Les abords et les accès extérieurs de la villa sont placés sous vidéosurveillance."; // M45
en.servicesPage.serenity = "Behind the scenes, a gardener-pool keeper and a maintenance man look after the pool, the garden and the house every day, discreetly. The grounds and outside access points of the villa are under video surveillance.";
fr.servicesPage.restauration.paragraphs[0] = fr.servicesPage.restauration.paragraphs[0].replace("La cuisine de Villa Serena", "La cuisine de la Villa Serena"); // M36 V08
fr.servicesPage.restauration.paragraphs[1] = "Le petit-déjeuner est inclus chaque matin. Déjeuners et dîners sont préparés sur demande et servis aux horaires convenus ensemble avec la gouvernante, au bord de la piscine, sous les oliviers, dans le patio ou dans la salle à manger de 14 couverts."; // M21
en.servicesPage.restauration.paragraphs[1] = "Breakfast is included every morning. Lunches and dinners are prepared on request and served at times agreed with the housekeeper, by the pool, under the olive trees, in the patio or in the 14-seat dining room.";
fr.servicesPage.bienetre.intro = "Après les fairways, les ruelles de la médina ou une longue pause au bord de la piscine, offrez-vous un moment de détente dans l'espace bien-être de la villa."; // M22
en.servicesPage.bienetre.intro = "After the fairways, the alleys of the medina or a long break by the pool, treat yourself to a moment of relaxation in the villa's wellness area.";
fr.servicesPage.bienetre.items[3][1] = "En libre accès pendant tout le séjour, réservée aux plus de 16 ans ; les mineurs y restent sous la responsabilité d'un adulte. Poids et haltères, tapis de course, rameur, banc de musculation, machine de musculation multipostes et sac de frappe."; // M44
en.servicesPage.bienetre.items[3][1] = "Free to use throughout your stay, reserved for over-16s; minors remain under the responsibility of an adult. Weights and dumbbells, treadmill, rowing machine, weight bench, multi-station machine and punching bag.";
fr.servicesPage.activites.paragraphs = [ // M23
  "Aux portes de l'Atlas, sur la route de la vallée de l'Ourika, la Villa Serena est un terrain de jeu à ciel ouvert. Dans le jardin, on joue à la pétanque, au badminton, au ping-pong, ou l'on rend visite à la mini ferme et à ses chèvres, brebis, poules, canards, sans oublier le paon, qui ravit les enfants. À côté, le parc aquatique du Pickalbatros Aqua Fun Club ouvre ses toboggans à la journée (entrée payante).",
  "Et pour s'évader un peu plus loin, nous organisons avec nos partenaires : marche vers les cascades de Setti Fatma (environ 30 minutes), balade à cheval ou à dos de dromadaire, quad et buggy dans le désert d'Agafay (environ 35 minutes), envol en montgolfière au lever du soleil.",
];
en.servicesPage.activites.paragraphs = [
  "At the gateway to the Atlas, on the road to the Ourika valley, Villa Serena is an open-air playground. In the garden, you play pétanque, badminton or table tennis, or visit the mini farm and its goats, sheep, hens and ducks, not forgetting the peacock, which children love. Next door, the Pickalbatros Aqua Fun Club water park opens its slides by the day (paid entry).",
  "And to escape a little further, we organise with our partners: a walk to the Setti Fatma waterfalls (about 30 minutes), horse or camel rides, quad and buggy in the Agafay desert (about 35 minutes), a hot-air balloon flight at sunrise.",
];
fr.seo.services.description = "Gouvernante-cuisinière et femme de chambre sur place, hammam, salle de sport, potager et activités sur la route de l'Ourika : nos services."; // M47
en.seo.services.description = "Housekeeper-cook and maid on site, hammam, gym, vegetable garden and activities along the Ourika road: the services of Villa Serena.";

// ── Expériences ──
fr.experiencesPage.evenements.paragraphs[0] = "Anniversaire, fête de famille, séminaire ou réception : le temps d'une journée ou d'un séjour, la Villa Serena est entièrement à vous. Jardin d'oliviers, piscine, patio et terrasses accueillent jusqu'à 80 invités, dont 14 peuvent séjourner sur place."; // M24
fr.experiencesPage.evenements.paragraphs[1] = "Chaque événement fait l'objet d'un devis personnalisé. Les réceptions se tiennent en plein air : la villa ne dispose pas d'espace couvert pour un grand nombre d'invités. La musique est la bienvenue, dans le respect de la tranquillité du voisinage."; // M25
en.experiencesPage.evenements.paragraphs[1] = "Each event is quoted individually. Receptions are held outdoors: the villa has no covered space for a large number of guests. Music is welcome, with respect for the neighbours' peace and quiet.";
fr.experiencesPage.golf.paragraph = fr.experiencesPage.golf.paragraph.replace(", Villa Serena est au cœur", ", la Villa Serena est au cœur"); // M36 V10
fr.seo.experiences.description = fr.seo.experiences.description.replace("Privatisez Villa Serena", "Privatisez la Villa Serena"); // M36 V09
fr.experiences.page_sub = fr.experiences.page_sub.replace("— Villa Serena se privatise", "— la Villa Serena se privatise"); // M36 rule

// ── FAQ (also the home short FAQ and FAQPage: same source) ──
const q = (j, i, question, answer) => { if (question) j.faq.items[i].q = question; if (answer) j.faq.items[i].a = answer; };
q(fr, 0, "Où se trouve la Villa Serena ?", "Au kilomètre 17 de la route de l'Ourika, à Sidi Bouzguia. Comptez environ 25 minutes jusqu'à la place Jemaa el-Fna et jusqu'à l'aéroport de Marrakech-Ménara."); // M28
q(en, 0, null, "At kilometre 17 on the Ourika road, in Sidi Bouzguia. Allow about 25 minutes to Jemaa el-Fna square and to Marrakech-Menara airport.");
q(fr, 1, null, "Jusqu'à 14 personnes, réparties entre le riad (4 suites), le pavillon (2 suites avec salon et cuisine) et le Studio indépendant."); // M29
q(en, 1, null, "Up to 14 guests, spread between the riad (4 suites), the pavilion (2 suites with a lounge and kitchen) and the separate Studio.");
q(fr, 2, null, "Non. La villa se privatise en totalité : vous êtes seuls sur le domaine, sans aucun autre voyageur."); // M30
q(en, 2, null, "No. The villa is hired in its entirety: you are alone on the estate, with no other guests.");
q(fr, 9, "Quels sont les services inclus ?", "Le petit-déjeuner et le ménage quotidien. Le linge de lit et de toilette (serviettes et draps de bain), les serviettes de piscine et les produits d'accueil sont fournis. Wifi par la fibre et parking privé de 7 places. Sur demande et avec supplément : repas préparés par la cuisinière et servis aux horaires convenus, soins au hammam, massages, excursions, transfert depuis l'aéroport de Marrakech-Ménara."); // M31
q(en, 9, "Which services are included?", "Breakfast and daily housekeeping. Bed linen and towels (towels and bath sheets), pool towels and toiletries are provided. Fibre wifi and private parking for 7 cars. On request and at extra cost: meals prepared by the cook and served at agreed times, hammam treatments, massages, excursions, transfers from Marrakech-Menara airport.");
q(fr, 10, null, "Oui : jardin, mini ferme, pétanque, badminton et ping-pong sur place, parc aquatique accessible à la journée juste à côté (entrée payante). La piscine n'est équipée ni de barrière ni d'alarme : les enfants doivent rester sous la surveillance constante d'un adulte, comme le prévoit notre règlement intérieur. La salle de sport est réservée aux plus de 16 ans ; les mineurs y restent sous la responsabilité d'un adulte."); // M32
q(en, 10, null, "Yes: garden, mini farm, pétanque, badminton and table tennis on site, and a water park open by the day right next door (paid entry). The pool has neither a fence nor an alarm: children must be supervised by an adult at all times, as our house rules require. The gym is reserved for over-16s; minors remain under the responsibility of an adult.");
q(fr, 12, null, "Une gouvernante, qui est aussi la cuisinière de la maison, et une femme de chambre vivent sur place. Un gardien assure la nuit, de 18 h à 8 h. Toute l'équipe est là pour vous offrir le meilleur service. Un jardinier-pisciniste et un agent de maintenance entretiennent discrètement la piscine, le jardin et la maison. Les abords et les accès extérieurs sont sous vidéosurveillance."); // M33
q(en, 12, null, "A housekeeper, who is also the house cook, and a maid live on site. A guard covers the night, from 6 pm to 8 am. The whole team is there to give you the best service. A gardener-pool keeper and a maintenance man discreetly look after the pool, the garden and the house. The grounds and outside access points are under video surveillance.");

// ── Galerie, blog, divers (M36) ──
fr.gallery.h1 = "La Villa Serena en images : suites, piscine et jardin"; // V12
fr.seo.gallery.description = fr.seo.gallery.description.replace("Parcourez Villa Serena", "Parcourez la Villa Serena");
fr.seo.contact.description = fr.seo.contact.description.replace("WhatsApp. Villa Serena,", "WhatsApp. La Villa Serena se trouve");
fr.seo.blog.description = fr.seo.blog.description.replace("les conseils de Villa Serena", "les conseils de la Villa Serena");
fr.blog.h1 = "Le blog de la Villa Serena : nos guides autour de Marrakech";
fr.blog.cta_title = "Séjourner à la Villa Serena"; // V13, V19, V22, V24

// ── Legal documents (M06) and the acceptance box (M48) ──
fr.legal = {
  house_rules: "Règlement intérieur", terms: "Conditions générales de vente",
  accept_before: "J'ai lu et j'accepte les ", accept_terms: "conditions générales de vente", accept_and: " et le ", accept_rules: "règlement intérieur", accept_after: " de la Villa Serena.",
  accept_required: "Merci d'accepter les conditions générales de vente et le règlement intérieur.",
};
en.legal = {
  house_rules: "House rules", terms: "Terms of sale",
  accept_before: "I have read and accept the ", accept_terms: "terms of sale", accept_and: " and the ", accept_rules: "house rules", accept_after: " of Villa Serena.",
  accept_required: "Please accept the terms of sale and the house rules.",
};

fs.writeFileSync("src/messages/fr.json", JSON.stringify(fr, null, 2) + "\n");
fs.writeFileSync("src/messages/en.json", JSON.stringify(en, null, 2) + "\n");
console.log("avenant 1 copy applied");
