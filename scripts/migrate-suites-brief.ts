// Client brief (6 Nov 2026), ch. 07: 6 suites + 1 studio. Renames the existing rooms,
// turns the old independent "Suite Bleue" into "Le Studio", and creates Orange and Jaune.
// French copy is the brief's, word for word; English is our translation.
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

type Suite = {
  find?: string; // current slug, when the row already exists
  slug: string;
  order: number;
  color?: string;
  space: string;
  name: string; nameEn: string;
  subtitle: string; subtitleEn: string;
  description: string; descriptionEn: string;
  longDescription: string; longDescriptionEn: string;
  size: string; bedType: string; bedTypeEn: string;
  amenities: string; amenitiesEn: string;
  idealFor: string; idealForEn: string;
  metaTitle: string; metaTitleEn: string;
  metaDescription: string; metaDescriptionEn: string;
};

const SUITES: Suite[] = [
  {
    find: "suite-bleue", slug: "le-studio", order: 7, space: "independant",
    name: "Le Studio", nameEn: "The Studio",
    subtitle: "un espace indépendant et un vent de sagesse", subtitleEn: "an independent space and a breath of wisdom",
    description: "Installé à l'écart du riad, le Studio offre une vraie indépendance, tout en restant à quelques pas de la piscine et de la table commune. Ses 45 m² en font l'hébergement le plus spacieux du domaine.",
    descriptionEn: "Set apart from the riad, the Studio offers real independence while staying a few steps from the pool and the shared table. At 45 m², it is the most spacious accommodation on the estate.",
    longDescription: "Il réunit un grand lit de 160 × 200, un coin salon avec canapé et une machine Nespresso pour le premier café du matin, à savourer sur sa terrasse orientée sud, face à la piscine. Salle d'eau et toilettes privées, climatisation.",
    longDescriptionEn: "It has a large 160 × 200 bed, a sitting area with a sofa and a Nespresso machine for the first coffee of the morning, to enjoy on its south-facing terrace overlooking the pool. Private shower room and WC, air conditioning.",
    size: "45 m²", bedType: "1 lit 160 × 200, coin salon", bedTypeEn: "1 bed 160 × 200, sitting area",
    amenities: "Lit 160 × 200,Coin salon et canapé,Machine Nespresso,Terrasse orientée sud vue piscine,Salle d'eau et toilettes privées,Climatisation",
    amenitiesEn: "160 × 200 bed,Sitting area and sofa,Nespresso machine,South-facing terrace with pool view,Private shower room and WC,Air conditioning",
    idealFor: "des grands-parents, un duo qui aime son propre rythme, ou l'organisateur d'un séminaire qui veut un espace pour travailler.",
    idealForEn: "grandparents, two people who like their own rhythm, or a seminar organiser who needs a space to work.",
    metaTitle: "Studio indépendant de 45 m² à Marrakech | Villa Serena", metaTitleEn: "Independent 45 m² Studio in Marrakech | Villa Serena",
    metaDescription: "Studio indépendant de 45 m² à l'écart du riad : lit de 160, coin salon, machine Nespresso, climatisation. Dans une villa privée de la route de l'Ourika, Marrakech.",
    metaDescriptionEn: "An independent 45 m² studio set apart from the riad: 160 cm bed, sitting area, Nespresso machine, air conditioning. In a private villa on the Ourika road, Marrakech.",
  },
  {
    find: "chambre-rouge", slug: "suite-rouge", order: 1, space: "riad",
    name: "Suite Rouge", nameEn: "Red Suite",
    subtitle: "un espace d'amour et de romance", subtitleEn: "a space for love and romance",
    description: "La Suite Rouge joue la passion et l'intensité. Sa teinte profonde, rehaussée par l'artisanat marrakchi, réchauffe l'espace dès le lever du jour. Elle s'ouvre sur le patio du riad.",
    descriptionEn: "The Red Suite plays on passion and intensity. Its deep colour, set off by Marrakech craftsmanship, warms the room from sunrise. It opens onto the riad's patio.",
    longDescription: "Sur 30 m², elle réunit deux lits de 90 × 200, installés séparés ou jumelés selon vos besoins, un bureau et deux fauteuils pour lire ou travailler au calme. Sa salle d'eau privée est équipée d'une douche. Sa terrasse, orientée plein sud, donne sur la piscine.",
    longDescriptionEn: "Over 30 m², it has two 90 × 200 beds, set up as twins or joined as you prefer, a desk and two armchairs to read or work in peace. Its private shower room has a shower. Its terrace, facing due south, overlooks the pool.",
    size: "30 m²", bedType: "2 lits 90 × 200, séparés ou jumelés", bedTypeEn: "2 beds 90 × 200, twin or joined",
    amenities: "Bureau,2 fauteuils,Terrasse orientée sud vue piscine,Salle d'eau privée avec douche,Climatisation",
    amenitiesEn: "Desk,2 armchairs,South-facing terrace with pool view,Private shower room,Air conditioning",
    idealFor: "un couple comme deux amis.", idealForEn: "a couple as well as two friends.",
    metaTitle: "Suite Rouge, riad de charme à Marrakech | Villa Serena", metaTitleEn: "Red Suite, Charming Riad in Marrakech | Villa Serena",
    metaDescription: "Suite de 30 m² au riad de Villa Serena : lits séparés ou jumelés, bureau, terrasse, climatisation. Réservée avec la villa entière, route de l'Ourika.",
    metaDescriptionEn: "A 30 m² suite in the Villa Serena riad: twin or joined beds, desk, terrace, air conditioning. Booked with the whole villa, on the Ourika road.",
  },
  {
    find: "chambre-bleue", slug: "suite-bleue", order: 2, space: "riad",
    name: "Suite Bleue", nameEn: "Blue Suite",
    subtitle: "un voyage vers le rêve et le calme intérieur", subtitleEn: "a journey into dreams and inner calm",
    description: "Le bleu apaise et invite au repos. Ouverte sur le patio du riad, la Suite Bleue est une parenthèse de sérénité, où l'on se réveille sans hâte.",
    descriptionEn: "Blue soothes and invites rest. Opening onto the riad's patio, the Blue Suite is an interlude of serenity where you wake up without hurry.",
    longDescription: "Sur 30 m², elle offre un grand lit de 160 × 200. Orientée à l'est, elle accueille la douce lumière du matin. Salle d'eau privée avec douche, climatisation.",
    longDescriptionEn: "Over 30 m², it offers a large 160 × 200 bed. Facing east, it welcomes the soft morning light. Private shower room, air conditioning.",
    size: "30 m²", bedType: "1 lit 160 × 200", bedTypeEn: "1 bed 160 × 200",
    amenities: "Lit 160 × 200,Ouverte sur le patio,Orientée à l'est,Salle d'eau privée avec douche,Climatisation",
    amenitiesEn: "160 × 200 bed,Opens onto the patio,East-facing,Private shower room,Air conditioning",
    idealFor: "un couple en quête de calme.", idealForEn: "a couple looking for calm.",
    metaTitle: "Suite Bleue, riad de charme à Marrakech | Villa Serena", metaTitleEn: "Blue Suite, Charming Riad in Marrakech | Villa Serena",
    metaDescription: "Suite de 30 m² au riad de Villa Serena, ouverte sur le patio : lit de 160, salle d'eau privée, climatisation. Route de l'Ourika, Marrakech.",
    metaDescriptionEn: "A 30 m² suite in the Villa Serena riad, opening onto the patio: 160 cm bed, private shower room, air conditioning. Ourika road, Marrakech.",
  },
  {
    find: "chambre-verte", slug: "suite-verte", order: 3, space: "riad",
    name: "Suite Verte", nameEn: "Green Suite",
    subtitle: "un hommage à la nature et au bien-être", subtitleEn: "a tribute to nature and well-being",
    description: "Couleur des oliviers du domaine, le vert relie la suite à la nature qui entoure le riad. Une atmosphère fraîche et vivante, pour se ressourcer.",
    descriptionEn: "The colour of the estate's olive trees, green links the suite to the nature around the riad. A fresh, lively atmosphere to recharge.",
    longDescription: "Sur 25 m², ses deux lits s'installent séparés ou jumelés. Sa terrasse, orientée sud, donne sur la piscine. Salle d'eau privée avec douche, climatisation.",
    longDescriptionEn: "Over 25 m², its two beds can be set up as twins or joined. Its south-facing terrace overlooks the pool. Private shower room, air conditioning.",
    size: "25 m²", bedType: "2 lits, séparés ou jumelés", bedTypeEn: "2 beds, twin or joined",
    amenities: "Terrasse orientée sud vue piscine,Salle d'eau privée avec douche,Climatisation",
    amenitiesEn: "South-facing terrace with pool view,Private shower room,Air conditioning",
    idealFor: "deux amis, ou des adolescents qui veulent leur espace.", idealForEn: "two friends, or teenagers who want their own space.",
    metaTitle: "Suite Verte, riad de charme à Marrakech | Villa Serena", metaTitleEn: "Green Suite, Charming Riad in Marrakech | Villa Serena",
    metaDescription: "Suite de 25 m² au riad de Villa Serena : lits séparés ou jumelés, salle d'eau privée, climatisation, ambiance nature. Route de l'Ourika, Marrakech.",
    metaDescriptionEn: "A 25 m² suite in the Villa Serena riad: twin or joined beds, private shower room, air conditioning, a nature feel. Ourika road, Marrakech.",
  },
  {
    find: "chambre-rose", slug: "suite-rose", order: 4, space: "riad",
    name: "Suite Rose", nameEn: "Pink Suite",
    subtitle: "un écrin de tendresse et de douceur", subtitleEn: "a haven of tenderness and softness",
    description: "Tons poudrés et lumière douce : la Suite Rose est un cocon, ouvert sur le patio.",
    descriptionEn: "Powdery tones and soft light: the Pink Suite is a cocoon, opening onto the patio.",
    longDescription: "Sur 20 m², ses lits se jumellent pour un couple ou se séparent pour deux enfants ou deux amies. Orientée à l'ouest, elle se pare des lumières dorées de la fin de journée. Salle d'eau privée avec douche, climatisation.",
    longDescriptionEn: "Over 20 m², its beds join for a couple or separate for two children or two friends. Facing west, it glows in the golden light of late afternoon. Private shower room, air conditioning.",
    size: "20 m²", bedType: "2 lits, séparés ou jumelés", bedTypeEn: "2 beds, twin or joined",
    amenities: "Ouverte sur le patio,Orientée à l'ouest,Salle d'eau privée avec douche,Climatisation",
    amenitiesEn: "Opens onto the patio,West-facing,Private shower room,Air conditioning",
    idealFor: "un couple, ou deux enfants à proximité de leurs parents.", idealForEn: "a couple, or two children close to their parents.",
    metaTitle: "Suite Rose, riad de charme à Marrakech | Villa Serena", metaTitleEn: "Pink Suite, Charming Riad in Marrakech | Villa Serena",
    metaDescription: "Suite de 20 m² au riad de Villa Serena, tons poudrés : lits séparés ou jumelés, salle d'eau privée, climatisation. Route de l'Ourika, Marrakech.",
    metaDescriptionEn: "A 20 m² suite in the Villa Serena riad, in powdery tones: twin or joined beds, private shower room, air conditioning. Ourika road, Marrakech.",
  },
  {
    slug: "suite-orange", order: 5, color: "oklch(0.68 0.15 50)", space: "pavillon",
    name: "Suite Orange", nameEn: "Orange Suite",
    subtitle: "la chaleur des épices et des couchers de soleil", subtitleEn: "the warmth of spices and sunsets",
    description: "L'orange, couleur des épices et des couchers de soleil sur l'Atlas, donne à la suite une énergie chaleureuse. Elle se trouve dans le pavillon, qu'elle partage avec la Suite Jaune : un salon, une cuisine indépendante, une terrasse et un jardin privés.",
    descriptionEn: "Orange, the colour of spices and of sunsets over the Atlas, gives the suite a warm energy. It is in the pavilion, which it shares with the Yellow Suite: a lounge, a separate kitchen, a private terrace and garden.",
    longDescription: "Sur 25 m², ses lits s'installent séparés ou jumelés. Orientée nord-est, elle profite du soleil du matin et reste fraîche aux heures chaudes. Salle d'eau privée, climatisation.",
    longDescriptionEn: "Over 25 m², its beds can be set up as twins or joined. Facing north-east, it enjoys the morning sun and stays cool in the hottest hours. Private shower room, air conditioning.",
    size: "25 m²", bedType: "2 lits, séparés ou jumelés", bedTypeEn: "2 beds, twin or joined",
    amenities: "Salon et cuisine du pavillon,Terrasse et jardin privés,Orientée nord-est,Salle d'eau privée,Climatisation",
    amenitiesEn: "Pavilion lounge and kitchen,Private terrace and garden,North-east facing,Private shower room,Air conditioning",
    idealFor: "une famille avec enfants, ou deux couples qui veulent leur maison dans la maison.", idealForEn: "a family with children, or two couples who want their own house within the house.",
    metaTitle: "Suite Orange, pavillon privé à Marrakech | Villa Serena", metaTitleEn: "Orange Suite, Private Pavilion in Marrakech | Villa Serena",
    metaDescription: "Suite de 25 m² dans le pavillon de Villa Serena : lits séparés ou jumelés, salon et cuisine partagés avec la Suite Jaune, terrasse et jardin privés.",
    metaDescriptionEn: "A 25 m² suite in the Villa Serena pavilion: twin or joined beds, lounge and kitchen shared with the Yellow Suite, private terrace and garden.",
  },
  {
    slug: "suite-jaune", order: 6, color: "oklch(0.8 0.14 85)", space: "pavillon",
    name: "Suite Jaune", nameEn: "Yellow Suite",
    subtitle: "la lumière du safran et du matin", subtitleEn: "the light of saffron and morning",
    description: "Le jaune, couleur du safran et de la première lumière du jour, rend la suite gaie et lumineuse. Elle partage avec la Suite Orange le salon, la cuisine, la terrasse et le jardin privés du pavillon.",
    descriptionEn: "Yellow, the colour of saffron and the first light of day, makes the suite cheerful and bright. It shares the pavilion's lounge, kitchen, private terrace and garden with the Orange Suite.",
    longDescription: "Sur 25 m², ses lits s'installent séparés ou jumelés. Orientée sud-ouest, elle baigne dans la lumière de l'après-midi. Salle d'eau privée, climatisation.",
    longDescriptionEn: "Over 25 m², its beds can be set up as twins or joined. Facing south-west, it is bathed in afternoon light. Private shower room, air conditioning.",
    size: "25 m²", bedType: "2 lits, séparés ou jumelés", bedTypeEn: "2 beds, twin or joined",
    amenities: "Salon et cuisine du pavillon,Terrasse et jardin privés,Orientée sud-ouest,Salle d'eau privée,Climatisation",
    amenitiesEn: "Pavilion lounge and kitchen,Private terrace and garden,South-west facing,Private shower room,Air conditioning",
    idealFor: "les enfants d'une famille installée dans la Suite Orange, ou un couple d'amis.", idealForEn: "the children of a family staying in the Orange Suite, or a couple of friends.",
    metaTitle: "Suite Jaune, pavillon privé à Marrakech | Villa Serena", metaTitleEn: "Yellow Suite, Private Pavilion in Marrakech | Villa Serena",
    metaDescription: "Suite de 25 m² dans le pavillon de Villa Serena : lits séparés ou jumelés, salon, cuisine, terrasse et jardin privés partagés avec la Suite Orange.",
    metaDescriptionEn: "A 25 m² suite in the Villa Serena pavilion: twin or joined beds, lounge, kitchen, private terrace and garden shared with the Orange Suite.",
  },
];

(async () => {
  // Order matters: the old "suite-bleue" (independent) must free its slug before chambre-bleue takes it.
  for (const s of SUITES) {
    const { find, ...data } = s;
    const common = { ...data, maxGuests: 2, featured: true, highlights: "", highlightsEn: "" };
    if (find) {
      const row = await db.room.findUnique({ where: { slug: find } });
      if (!row) { console.log("skip (not found):", find); continue; }
      await db.room.update({ where: { id: row.id }, data: common });
      console.log("updated", find, "→", s.slug);
    } else {
      const exists = await db.room.findUnique({ where: { slug: s.slug } });
      if (exists) await db.room.update({ where: { id: exists.id }, data: common });
      else await db.room.create({ data: { ...common, color: s.color ?? "", image: "", images: "" } });
      console.log(exists ? "updated" : "created", s.slug);
    }
  }
  const all = await db.room.findMany({ orderBy: { order: "asc" }, select: { slug: true, name: true, size: true, order: true } });
  console.table(all);
})().finally(() => db.$disconnect());
