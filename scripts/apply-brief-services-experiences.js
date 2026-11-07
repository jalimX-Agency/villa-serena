// Services (ch. 08) and Expériences (ch. 09) single-page copy from the client brief.
// FR word for word (bracketed "à préciser" passages left out); EN is our translation.
const fs = require("fs");

const fr = {
  servicesPage: {
    eyebrow: "Services",
    lead: "Une équipe vit sur place et veille sur votre séjour : une gouvernante, qui est aussi votre cuisinière, une femme de chambre, épaulée par une seconde selon la taille du groupe, et un gardien la nuit, de 18 h à 8 h. Présente à vos côtés tout au long de la journée, elle observe aussi ses temps de pause et de repos, dans le respect du droit du travail. Le petit-déjeuner et le ménage quotidien sont inclus ; le reste s'organise sur demande.",
    serenity_title: "Sérénité",
    serenity: "En coulisses, un jardinier-pisciniste et un agent de maintenance prennent soin, chaque jour et en toute discrétion, de la piscine, du jardin et de la maison. Les abords et les accès extérieurs de la villa sont placés sous vidéosurveillance, et un groupe électrogène prend le relais en cas de coupure de courant, comme il est d'usage à la campagne.",
    anchors: { restauration: "Restauration", "bien-etre": "Bien-être", activites: "Activités et excursions" },
    restauration: {
      title: "Restauration",
      paragraphs: [
        "La cuisine de Villa Serena est confiée à notre gouvernante, qui est aussi la cuisinière de la maison. Elle prépare chaque repas à partir de recettes familiales marocaines : tajines, couscous du vendredi, pastilla, salades de saison. Des saveurs venues d'ailleurs s'invitent selon vos envies. Les légumes viennent, autant que possible, du potager de la villa.",
        "Le petit-déjeuner est inclus chaque matin. Déjeuners et dîners sont préparés sur demande et servis à tout le groupe, aux horaires convenus ensemble avec la gouvernante, au bord de la piscine, sous les oliviers, dans le patio ou dans la salle à manger de 14 couverts.",
        "Les repas sont pensés comme des moments partagés : un même menu, servi à la même heure pour toute la tablée. Seule exception, les enfants peuvent dîner plus tôt ou à part, s'ils le souhaitent.",
      ],
      stats: ["14 couverts", "Petit-déjeuner inclus", "Légumes du potager"],
    },
    bienetre: {
      title: "Bien-être",
      intro: "Après une journée de golf, une visite de la médina ou un après-midi au bord de la piscine, la villa a son propre espace de bien-être, réservé à votre groupe.",
      items: [
        ["Hammam traditionnel", "Un rituel de purification ancestral. Gommage au savon noir et au gant de kessa, 60 à 90 minutes."],
        ["Salle de massage", "Soins relaxants sur réservation, 45 à 90 minutes."],
        ["Espace yoga et relaxation", "Pour la pratique du matin ou un moment de calme. Cours et séances avec nos partenaires, sur demande."],
        ["Salle de sport", "En libre accès pendant tout le séjour, réservée aux plus de 16 ans et sous la responsabilité d'un adulte. Poids et haltères, tapis de course, rameur, banc de musculation, machine de musculation multipostes et sac de frappe."],
      ],
    },
    activites: {
      title: "Activités et excursions",
      paragraphs: [
        "Villa Serena est sur la route de la vallée de l'Ourika, porte d'entrée de l'Atlas. Sur place, le jardin a ses propres distractions : terrain de pétanque, badminton, ping-pong, et la mini ferme, avec ses chèvres, brebis, poules, canards et son paon, qui fait le bonheur des enfants. Juste à côté, le parc aquatique du Pickalbatros Aqua Fun Club est accessible à la journée (entrée payante) et promet de belles journées en famille.",
        "Plus loin, nous organisons avec des partenaires que nous connaissons : randonnée jusqu'aux cascades de Setti Fatma (environ 30 minutes), balade à cheval ou à dos de dromadaire, quad et buggy dans le désert d'Agafay (environ 35 minutes), vol en montgolfière au lever du soleil.",
      ],
      stats: ["3 activités sur place", "½ ou 1 journée d'excursion", "Organisation sur demande"],
    },
  },
  experiencesPage: {
    eyebrow: "Expériences",
    lead: "Événement privé, séjour golf ou retraite de yoga : la villa entière est réservée à votre groupe, jusqu'à 14 personnes sur place.",
    anchors: { evenements: "Événements privés", golf: "Golf", retraites: "Retraites" },
    evenements: {
      title: "Événements privés",
      paragraphs: [
        "Anniversaire, fête de famille, séminaire ou réception : le temps d'une journée ou d'un séjour, Villa Serena est entièrement à vous. Jardin d'oliviers, piscine, patio et terrasses accueillent jusqu'à 80 invités, dont 14 peuvent séjourner sur place.",
        "Chaque événement fait l'objet d'un devis personnalisé. Les réceptions se tiennent en plein air : la villa ne dispose pas d'espace couvert pour un grand nombre d'invités. La musique est la bienvenue, dans le respect de la réglementation marocaine en vigueur, notamment sur les nuisances sonores, et de la tranquillité du voisinage.",
      ],
      facts: [
        ["Capacité", "80 invités au maximum, 14 couchages"],
        ["Espaces", "Jardin, piscine, patio, terrasses"],
        ["Restauration", "Cuisine de la villa ou traiteur partenaire, sur devis"],
        ["Séminaires", "Wifi par la fibre, parking de 7 places"],
      ],
    },
    golf: {
      title: "Votre séjour golf à Marrakech : 14 parcours autour de la villa",
      paragraph: "Au kilomètre 17 de la route de l'Ourika, Villa Serena est au cœur de la constellation golfique de Marrakech : deux parcours à 12 minutes, et quatorze en tout à moins de 50 minutes. Sur demande, nous organisons avec nos partenaires vos transferts vers les golfs et la réservation de vos green fees.",
      col_course: "Parcours",
      col_time: "Depuis la villa",
      courses: [
        ["Palm Ourika · Akenza", "~12 min"],
        ["Noria · Atlas Golf · Argan · Montgomerie", "~30 min"],
        ["Samanah · Royal Palm", "~35 min"],
        ["Al Maaden · Golf Royal · Amelkis (27 trous) · Amelkis Resort (9 trous)", "~40 min"],
        ["Assoufid", "~45 min"],
        ["La Palmeraie", "~50 min"],
      ],
    },
    retraites: {
      title: "Retraites de yoga et de bien-être",
      paragraph: "Pour une retraite de yoga ou de bien-être, la villa entière est réservée à votre groupe, jusqu'à 14 participants. La pratique se fait dans l'espace yoga, sous les oliviers ou dans le patio. Le hammam et la salle de massage accompagnent la récupération. La cuisinière adapte les menus : végétarien, sans gluten.",
    },
    quote_title: "Parlez-nous de votre projet",
    quote_body: "Décrivez votre événement, votre séjour golf ou votre retraite : nous vous répondons sous 24 heures avec un devis personnalisé.",
  },
};

const en = {
  servicesPage: {
    eyebrow: "Services",
    lead: "A team lives on site and looks after your stay: a housekeeper, who is also your cook, a maid, helped by a second one depending on the size of the group, and a night guard from 6 pm to 8 am. With you throughout the day, the team also takes breaks and rest periods, in line with labour law. Breakfast and daily housekeeping are included; everything else is arranged on request.",
    serenity_title: "Peace of mind",
    serenity: "Behind the scenes, a gardener-pool keeper and a maintenance man look after the pool, the garden and the house every day, discreetly. The grounds and outside access points are under video surveillance, and a generator takes over in case of a power cut, as is usual in the countryside.",
    anchors: { restauration: "Dining", "bien-etre": "Wellness", activites: "Activities and excursions" },
    restauration: {
      title: "Dining",
      paragraphs: [
        "Cooking at Villa Serena is entrusted to our housekeeper, who is also the house cook. She prepares every meal from Moroccan family recipes: tagines, Friday couscous, pastilla, seasonal salads. Flavours from elsewhere join in, as you wish. Vegetables come, as far as possible, from the villa's kitchen garden.",
        "Breakfast is included every morning. Lunches and dinners are prepared on request and served to the whole group, at times agreed with the housekeeper, by the pool, under the olive trees, in the patio or in the 14-seat dining room.",
        "Meals are designed as shared moments: the same menu, served at the same time to the whole table. The only exception: children can eat earlier or separately if they wish.",
      ],
      stats: ["14 seats", "Breakfast included", "Garden vegetables"],
    },
    bienetre: {
      title: "Wellness",
      intro: "After a day of golf, a visit to the medina or an afternoon by the pool, the villa has its own wellness area, reserved for your group.",
      items: [
        ["Traditional hammam", "An ancestral purification ritual. Black-soap and kessa-glove scrub, 60 to 90 minutes."],
        ["Massage room", "Relaxing treatments by appointment, 45 to 90 minutes."],
        ["Yoga and relaxation space", "For a morning practice or a quiet moment. Classes and sessions with our partners, on request."],
        ["Gym", "Free to use throughout your stay, reserved for over-16s under adult supervision. Weights and dumbbells, treadmill, rowing machine, weight bench, multi-station machine and punching bag."],
      ],
    },
    activites: {
      title: "Activities and excursions",
      paragraphs: [
        "Villa Serena is on the road to the Ourika valley, gateway to the Atlas. On site, the garden has its own entertainment: pétanque court, badminton, table tennis, and the mini farm with its goats, sheep, hens, ducks and peacock, which children love. Right next door, the Pickalbatros Aqua Fun Club water park is open by the day (paid entry) for great family days out.",
        "Further afield, we organise with partners we know: a hike to the Setti Fatma waterfalls (about 30 minutes), horse or camel rides, quad and buggy in the Agafay desert (about 35 minutes), a hot-air balloon flight at sunrise.",
      ],
      stats: ["3 activities on site", "½ or 1 day excursions", "Arranged on request"],
    },
  },
  experiencesPage: {
    eyebrow: "Experiences",
    lead: "A private event, a golf trip or a yoga retreat: the whole villa is reserved for your group, with up to 14 guests staying on site.",
    anchors: { evenements: "Private events", golf: "Golf", retraites: "Retreats" },
    evenements: {
      title: "Private events",
      paragraphs: [
        "A birthday, a family celebration, a seminar or a reception: for a day or a stay, Villa Serena is entirely yours. The olive garden, pool, patio and terraces welcome up to 80 guests, 14 of whom can stay on site.",
        "Each event is quoted individually. Receptions are held outdoors: the villa has no covered space for a large number of guests. Music is welcome, in line with Moroccan regulations, in particular on noise, and with respect for the neighbours.",
      ],
      facts: [
        ["Capacity", "Up to 80 guests, sleeps 14"],
        ["Spaces", "Garden, pool, patio, terraces"],
        ["Catering", "The villa's kitchen or a partner caterer, on quotation"],
        ["Seminars", "Fibre wifi, parking for 7 cars"],
      ],
    },
    golf: {
      title: "Your golf trip in Marrakech: 14 courses around the villa",
      paragraph: "At kilometre 17 on the Ourika road, Villa Serena sits at the heart of Marrakech's golf constellation: two courses 12 minutes away, and fourteen in all within 50 minutes. On request, we arrange your transfers to the courses and your green fee bookings with our partners.",
      col_course: "Course",
      col_time: "From the villa",
      courses: [
        ["Palm Ourika · Akenza", "~12 min"],
        ["Noria · Atlas Golf · Argan · Montgomerie", "~30 min"],
        ["Samanah · Royal Palm", "~35 min"],
        ["Al Maaden · Royal Golf · Amelkis (27 holes) · Amelkis Resort (9 holes)", "~40 min"],
        ["Assoufid", "~45 min"],
        ["La Palmeraie", "~50 min"],
      ],
    },
    retraites: {
      title: "Yoga and wellness retreats",
      paragraph: "For a yoga or wellness retreat, the whole villa is reserved for your group, up to 14 participants. Practice takes place in the yoga space, under the olive trees or in the patio. The hammam and massage room support recovery. The cook adapts the menus: vegetarian, gluten-free.",
    },
    quote_title: "Tell us about your project",
    quote_body: "Describe your event, golf trip or retreat: we reply within 24 hours with a tailored quotation.",
  },
};

for (const [file, patch] of [["src/messages/fr.json", fr], ["src/messages/en.json", en]]) {
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  Object.assign(json, patch);
  fs.writeFileSync(file, JSON.stringify(json, null, 2) + "\n");
}
console.log("services + experiences copy applied");
