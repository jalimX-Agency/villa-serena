// Annex of 10 Nov 2026 (M1–M52): text changes in the message files. Run once: node scripts/apply-annex-1011-copy.js
// "\n" = line break asked by the annex ("retour à la ligne"); the components render it with white-space: pre-line.
const fs = require("fs");

const set = (o, path, v) => {
  const ks = path.split(".");
  let cur = o;
  for (const k of ks.slice(0, -1)) {
    if (!(k in cur)) throw new Error("missing " + path);
    cur = cur[k];
  }
  cur[ks.at(-1)] = v;
};
const get = (o, path) => path.split(".").reduce((a, k) => a?.[k], o);

const CHANGES = {
  fr: {
    "nav.villa_short": "Villa", // M2
    "nav.suites_short": "Suites",
    "hero.subheadline": // M5
      "Sur un hectare d'oliviers, un riad de quatre suites, un pavillon de deux suites et un studio indépendant accueillent jusqu'à 14 personnes. Piscine privée, hammam, potager et mini ferme. La gouvernante, qui est aussi la cuisinière de la maison, veille sur votre séjour.",
    "home.welcome_body2": // M6
      "À 25 minutes de la médina, sur la route de la vallée de l'Ourika, la villa offre le calme de la campagne, non loin de l'effervescence de Marrakech.",
    "home.experiences_sub": // M10
      "Hammam traditionnel, salle de massage et salle de sport pour prendre soin de soi.\nAu jardin : potager, mini ferme et volières, bassin de carpes koï, terrain de pétanque, badminton et ping-pong. Avec des enfants, le parc aquatique du Pickalbatros Aqua Fun Club, à proximité de la villa, est accessible à la journée (entrée payante).",
    "home.cta_body": // M42
      "À partir de 980 € la nuit, pour le domaine entier et jusqu'à 14 personnes, petit-déjeuner et ménage quotidien inclus (hors taxe de séjour). Idéal pour une réunion de famille, un anniversaire, un séjour golfique ou un séminaire.\nRéponse sous 24 heures, sans engagement.",
    "faq.items.4.a": "4 nuits en basse et moyenne saison.\n6 nuits en haute saison et pendant les fêtes de fin d'année.", // M12
    "suites.h1": "Six suites et un studio, un domaine privatisé pour 14 personnes", // M20
    "suites.page_sub": // M21, M30
      "Le domaine se partage en trois espaces. Le riad réunit les suites Rouge, Bleue, Verte et Rose autour du patio. Le pavillon abrite les suites Orange et Jaune, avec salon, cuisine, terrasse et jardin privés. Le Studio est indépendant. La Suite Bleue et le Studio ont un grand lit queen size ; ailleurs, les lits s'installent séparés ou jumelés.",
    "suites.includes_note": // M33 (page Les suites)
      "Des serviettes de piscine sont mises à votre disposition.\nLes suites Rouge et Verte et le Studio disposent d'une terrasse orientée sud, avec vue piscine.",
    "suites.includes_note_suite": "Des serviettes de piscine sont mises à votre disposition.", // M25 (fiches)
    "suites.spaces.independant.title": "Le Studio", // M30
    "suites.spaces.pavillon_studio": { title: "Le pavillon et le Studio", pavillon: "Pavillon", independant: "Indépendant" }, // M31
    "servicesPage.restauration.paragraphs": [ // M34, M35
      "La cuisine de la Villa Serena est confiée à notre gouvernante, qui est aussi la cuisinière de la maison. Elle prépare chaque repas à partir de recettes familiales marocaines : tajines, couscous du vendredi, pastilla, salades de saison. Des saveurs venues d'ailleurs s'invitent selon vos envies.",
      "Les légumes viennent, autant que possible, du potager de la villa.",
      "Dans le cadre de votre séjour, un petit-déjeuner marocain vous est servi chaque matin.",
      "Déjeuners et dîners sont préparés sur demande et servis aux horaires convenus ensemble avec la gouvernante, au bord de la piscine, sous les oliviers, dans le patio ou dans la salle à manger de 14 couverts.",
      "Les repas sont pensés comme des moments partagés : un même menu, servi à la même heure pour toute la tablée. Seule exception, les enfants peuvent dîner plus tôt ou à part, s'ils le souhaitent.",
    ],
    "servicesPage.bienetre.intro": // M37
      "Marrakech éveille tous les sens ; la villa les apaise. De retour de la médina ou d'une journée dans l'Atlas, laissez la chaleur du hammam et la douceur d'un massage dissiper la fatigue du jour. Ici, prendre soin de soi n'est pas un luxe : c'est le rythme de la maison.",
    "servicesPage.bienetre.items": [ // M38
      ["Hammam traditionnel", "Un rituel de purification ancestral : gommage au savon noir et au gant de kessa, de 60 à 90 minutes. Sur réservation et en supplément, selon notre carte des soins."],
      ["Salle de massage", "Massages relaxants à l'huile d'argan, de 45 à 90 minutes. Sur réservation et en supplément ; la carte des soins vous est présentée sur demande."],
      ["Espace yoga et relaxation", "Pour la pratique du matin ou un moment de calme. Cours avec nos coachs partenaires, sur réservation et en supplément ; le tarif dépend du coach."],
      ["Salle de sport", "Poids et haltères, tapis de course, rameur, banc de musculation, machine multipostes et sac de frappe. La salle est en libre accès pendant tout le séjour, réservée aux plus de 16 ans ; les mineurs y restent sous la responsabilité d'un adulte. Sur demande, nous vous mettons en relation avec des coachs sportifs sélectionnés (en supplément)."],
    ],
    "servicesPage.activites.paragraphs": [ // M40
      "Aux portes de l'Atlas, sur la route de la vallée de l'Ourika, la Villa Serena est un terrain de jeu à ciel ouvert. Dans le jardin, on joue à la pétanque, au badminton et au ping-pong.",
      "La mini ferme accueille chèvres, brebis, poules et canards, sans oublier le paon, pour le plaisir des petits et des grands.",
      "À quelques minutes, le parc aquatique du Pickalbatros Aqua Fun Club ouvre ses toboggans à la journée (entrée payante).",
    ],
    "servicesPage.activites.excursions": { // M41
      intro: "Et pour s'évader un peu plus loin, nous organisons avec nos partenaires :",
      items: [
        "marche vers les cascades de Setti Fatma (environ 30 minutes) ;",
        "balade à cheval ou à dos de dromadaire ;",
        "quad et buggy dans le désert d'Agafay (environ 35 minutes) ;",
        "envol en montgolfière au lever du soleil.",
      ],
      cooking: "À la villa, notre gouvernante vous initie à la cuisine marocaine lors d'un cours, sur demande.",
    },
    "experiences.h1": "Privatisez votre villa à Marrakech", // M43
    "experiencesPage.lead": "Organisez votre événement privé, votre séjour golfique ou votre retraite santé : la Villa Serena vous est entièrement réservée.",
    "seo.experiences.description": "Événement privé, séjour golfique, stage avec votre pro de golf ou retraite santé : privatisez la Villa Serena, à 25 min de Marrakech.",
    "experiencesPage.evenements.facts.3.1": "Wifi par la fibre, parkings", // M44
    "experiencesPage.golf.pro_line": "Idéal entre amis ou lors d'un stage avec votre pro de golf.", // M45
    "experiencesPage.retraites.paragraph": // M47
      "Pour une retraite yoga ou un séjour santé, la villa se transforme en temple du bien-être. Vous disposez de toute la villa pour y organiser vos activités.\nLe hammam, la salle de massage et la salle de sport accompagnent la récupération.\nSur demande, la cuisinière adapte les menus : végétariens, sans gluten…",
    "blog.h1": "Le blog de la Villa Serena : guides autour de Marrakech", // M52
    "blog.page_sub": "Nos conseils pour visiter la région : la vallée de l'Ourika, le golf, Marrakech en famille.\nUn nouvel article à découvrir chaque mois.", // M50, M52
  },
  en: {
    "nav.villa_short": "Villa",
    "nav.suites_short": "Suites",
    "hero.subheadline":
      "Set in a hectare of olive trees, a riad with four suites, a pavilion with two suites and an independent studio welcome up to 14 guests. Private pool, hammam, kitchen garden and mini farm. The housekeeper, who is also the house cook, looks after your stay.",
    "home.welcome_body2":
      "Twenty-five minutes from the medina, on the road to the Ourika valley, the villa offers the calm of the countryside, not far from the bustle of Marrakech.",
    "home.experiences_sub":
      "A traditional hammam, massage room and gym to look after yourself.\nIn the garden: vegetable garden, mini farm and aviaries, koi pond, pétanque court, badminton and table tennis. With children, the Pickalbatros Aqua Fun Club water park, close to the villa, is open by the day (paid entry).",
    "home.cta_body":
      "From €980 per night for the whole estate and up to 14 guests, breakfast and daily housekeeping included (tourist tax extra). Ideal for a family reunion, a birthday, a golf break or a seminar.\nReply within 24 hours, no commitment.",
    "faq.items.4.a": "4 nights in low and mid season.\n6 nights in high season and over the Christmas and New Year holidays.",
    "suites.h1": "Six suites and a studio, a private estate for 14 guests",
    "suites.page_sub":
      "The estate is split into three spaces. The riad brings together the Red, Blue, Green and Pink suites around the patio. The pavilion houses the Orange and Yellow suites, with a private lounge, kitchen, terrace and garden. The Studio is independent. The Blue Suite and the Studio have a large queen-size bed; elsewhere, the beds can be set up as twins or joined.",
    "suites.includes_note": "Pool towels are provided.\nThe Red and Green suites and the Studio have a south-facing terrace overlooking the pool.",
    "suites.includes_note_suite": "Pool towels are provided.",
    "suites.spaces.independant.title": "The Studio",
    "suites.spaces.pavillon_studio": { title: "The pavilion and the Studio", pavillon: "Pavilion", independant: "Independent" },
    "servicesPage.restauration.paragraphs": [
      "Cooking at Villa Serena is entrusted to our housekeeper, who is also the house cook. She prepares every meal from Moroccan family recipes: tagines, Friday couscous, pastilla, seasonal salads. Flavours from elsewhere join in, as you wish.",
      "Vegetables come, as far as possible, from the villa's kitchen garden.",
      "As part of your stay, a Moroccan breakfast is served every morning.",
      "Lunches and dinners are prepared on request and served at times agreed with the housekeeper, by the pool, under the olive trees, in the patio or in the 14-seat dining room.",
      "Meals are designed as shared moments: the same menu, served at the same time to the whole table. The only exception: children can eat earlier or separately if they wish.",
    ],
    "servicesPage.bienetre.intro":
      "Marrakech awakens every sense; the villa soothes them. Back from the medina or a day in the Atlas, let the warmth of the hammam and a gentle massage ease away the day. Here, taking care of yourself is not a luxury: it is the rhythm of the house.",
    "servicesPage.bienetre.items": [
      ["Traditional hammam", "An ancestral purifying ritual: black soap and kessa glove scrub, 60 to 90 minutes. On reservation, at an extra charge, from our treatment menu."],
      ["Massage room", "Relaxing argan oil massages, 45 to 90 minutes. On reservation, at an extra charge; our treatment menu is available on request."],
      ["Yoga and relaxation space", "For a morning practice or a quiet moment. Classes with our partner coaches, on reservation, at an extra charge; prices depend on the coach."],
      ["Gym", "Weights and dumbbells, treadmill, rowing machine, weight bench, multi-station machine and punching bag. Free access throughout your stay for guests aged 16 and over; minors remain under the responsibility of an adult. On request, we can put you in touch with selected personal trainers (at an extra charge)."],
    ],
    "servicesPage.activites.paragraphs": [
      "At the gateway to the Atlas, on the road to the Ourika valley, Villa Serena is an open-air playground. In the garden, there is pétanque, badminton and table tennis.",
      "The mini farm is home to goats, ewes, hens and ducks, not forgetting the peacock, to the delight of young and old.",
      "A few minutes away, the Pickalbatros Aqua Fun Club water park opens its slides for the day (paid entry).",
    ],
    "servicesPage.activites.excursions": {
      intro: "And to venture a little further, we arrange with our partners:",
      items: [
        "walk to the Setti Fatma waterfalls (about 30 minutes);",
        "horse or camel ride;",
        "quad and buggy in the Agafay desert (about 35 minutes);",
        "sunrise hot-air balloon flight.",
      ],
      cooking: "At the villa, our housekeeper introduces you to Moroccan cooking in a class, on request.",
    },
    "experiences.h1": "Book your private villa in Marrakech",
    "experiencesPage.lead": "Plan your private event, your golf break or your wellness retreat: Villa Serena is entirely yours.",
    "seo.experiences.description": "Private event, golf break, a clinic with your golf pro or a wellness retreat: book Villa Serena, 25 minutes from Marrakech.",
    "experiencesPage.evenements.facts.3.1": "Fibre Wi-Fi, parking",
    "experiencesPage.golf.pro_line": "Ideal with friends or for a golf clinic with your golf pro.",
    "experiencesPage.retraites.paragraph":
      "For a yoga retreat or a wellness stay, the villa becomes a temple of well-being. The whole villa is yours to organise your activities.\nThe hammam, the massage room and the gym support recovery.\nOn request, the cook adapts the menus: vegetarian, gluten-free…",
    "blog.h1": "The Villa Serena blog: guides around Marrakech",
    "blog.page_sub": "Our tips for exploring the region: the Ourika valley, golf, Marrakech with the family.\nA new article to discover every month.",
  },
};

// Keys that are new (no existing value to replace).
const NEW = new Set(["nav.villa_short", "nav.suites_short", "suites.includes_note_suite", "suites.spaces.pavillon_studio", "servicesPage.activites.excursions", "experiencesPage.golf.pro_line"]);

for (const lang of ["fr", "en"]) {
  const file = `src/messages/${lang}.json`;
  const raw = fs.readFileSync(file, "utf8");
  const m = JSON.parse(raw);
  for (const [k, v] of Object.entries(CHANGES[lang])) {
    if (!NEW.has(k) && get(m, k) === undefined) throw new Error(`${lang}: ${k} not found`);
    set(m, k, v);
  }
  // M31: the pavilion and Studio sentences go away.
  delete m.suites.spaces.pavillon.body;
  delete m.suites.spaces.independant.body;
  fs.writeFileSync(file, JSON.stringify(m, null, 2) + (raw.endsWith("\n") ? "\n" : ""));
  console.log(lang, Object.keys(CHANGES[lang]).length, "keys");
}
