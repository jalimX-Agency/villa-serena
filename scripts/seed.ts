import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// Room data sourced from villaserenamarrakech.com (real content).
// Images are DEV PLACEHOLDERS from the old scaffold — final images to be
// pulled from the client's site / photoshoot and moved to R2 before launch.
const ROOMS = [
  {
    slug: "chambre-rouge",
    name: "Chambre Rouge",
    nameEn: "Red Room",
    subtitle: "Un espace d'amour et de romance",
    subtitleEn: "A space of love and romance",
    description:
      "La Chambre Rouge incarne la passion, le mystère et l'intensité. Baignée d'une teinte éclatante, elle éveille les sens et invite à l'aventure émotionnelle.",
    descriptionEn:
      "The Red Room embodies passion, mystery and intensity. Bathed in a vivid hue, it awakens the senses and invites emotional adventure.",
    color: "oklch(0.5 0.19 25)",
    price: 130,
    size: "30 m²",
    bedType: "Lits 90×200 (×2)",
    bedTypeEn: "Twin beds 90×200 (×2)",
    maxGuests: 2,
    image: "/room-sienne.webp",
    amenities: "Bureau,2 fauteuils,Douche / Toilettes,Climatisation,Terrasse",
    amenitiesEn: "Desk,2 armchairs,Shower / WC,Air conditioning,Terrace",
    featured: true,
    order: 1,
  },
  {
    slug: "chambre-bleue",
    name: "Chambre Bleue",
    nameEn: "Blue Room",
    subtitle: "Un transport vers le rêve et le calme intérieur",
    subtitleEn: "A journey to dreams and inner calm",
    description:
      "La Chambre Bleue invite à une expérience empreinte d'harmonie, de tranquillité et de sérénité.",
    descriptionEn:
      "The Blue Room invites you to an experience of harmony, tranquillity and serenity.",
    color: "oklch(0.56 0.12 240)",
    price: 130,
    size: "25 m²",
    bedType: "Lit 160×200",
    bedTypeEn: "Double bed 160×200",
    maxGuests: 2,
    image: "/room-indigo.webp",
    amenities: "Bureau,Douche / Toilettes,Climatisation,Terrasse",
    amenitiesEn: "Desk,Shower / WC,Air conditioning,Terrace",
    featured: true,
    order: 2,
  },
  {
    slug: "chambre-verte",
    name: "Chambre Verte",
    nameEn: "Green Room",
    subtitle: "Un hommage à la vie et au bien-être",
    subtitleEn: "A tribute to life and well-being",
    description:
      "La Chambre Verte est une célébration de la vie, un symbole de santé et de renouveau.",
    descriptionEn:
      "The Green Room is a celebration of life, a symbol of health and renewal.",
    color: "oklch(0.55 0.11 150)",
    price: 130,
    size: "25 m²",
    bedType: "Lits 90×200 (×2)",
    bedTypeEn: "Twin beds 90×200 (×2)",
    maxGuests: 2,
    image: "/room-jade.webp",
    amenities: "Douche / Toilettes,Climatisation,Terrasse",
    amenitiesEn: "Shower / WC,Air conditioning,Terrace",
    featured: true,
    order: 3,
  },
  {
    slug: "chambre-rose",
    name: "Chambre Rose",
    nameEn: "Pink Room",
    subtitle: "Un écrin de tendresse et douceur",
    subtitleEn: "A cocoon of tenderness and softness",
    description:
      "La Chambre Rose incarne la joie de vivre, enveloppant ses hôtes dans une atmosphère de douceur.",
    descriptionEn:
      "The Pink Room embodies joie de vivre, wrapping guests in an atmosphere of softness.",
    color: "oklch(0.74 0.09 15)",
    price: 130,
    size: "20 m²",
    bedType: "Lits 90×200 (×2)",
    bedTypeEn: "Twin beds 90×200 (×2)",
    maxGuests: 2,
    image: "/room-ivoire.webp",
    amenities: "Douche / Toilettes,Climatisation,Terrasse",
    amenitiesEn: "Shower / WC,Air conditioning,Terrace",
    featured: false,
    order: 4,
  },
  {
    slug: "suite-bleue",
    name: "Suite Bleue",
    nameEn: "Blue Suite",
    subtitle: "Un vent de sagesse",
    subtitleEn: "A breath of wisdom",
    description:
      "La Suite Bleue est un havre de paix où règnent confiance, loyauté et sagesse.",
    descriptionEn:
      "The Blue Suite is a haven of peace where trust, loyalty and wisdom reign.",
    color: "oklch(0.32 0.11 265)",
    price: 160,
    size: "30 m²",
    bedType: "Lit 160×200",
    bedTypeEn: "Double bed 160×200",
    maxGuests: 2,
    image: "/room-safran.webp",
    amenities: "Canapé,Terrasse,Douche / Toilettes,Machine Nespresso,Climatisation",
    amenitiesEn: "Sofa,Terrace,Shower / WC,Nespresso machine,Air conditioning",
    featured: true,
    order: 5,
  },
];

const EXPERIENCES = [
  {
    slug: "hammam",
    title: "Hammam Traditionnel",
    titleEn: "Traditional Hammam",
    subtitle: "Détoxification et rituel séculaire",
    subtitleEn: "Detox and centuries-old ritual",
    description:
      "Gommages au savon noir, exfoliation au gant de Kessa — une détente profonde pour le corps et l'esprit.",
    descriptionEn:
      "Black-soap scrubs and Kessa-glove exfoliation — deep relaxation for body and mind.",
    category: "wellness",
    duration: "60–90 min",
    image: "/hammam.webp",
    icon: "♨",
    featured: true,
    order: 1,
  },
  {
    slug: "massage",
    title: "Salle de Massage",
    titleEn: "Massage Room",
    subtitle: "Libérez les tensions",
    subtitleEn: "Release tension",
    description: "Des soins relaxants dans notre salle dédiée, sur réservation.",
    descriptionEn: "Relaxing treatments in our dedicated room, by reservation.",
    category: "wellness",
    duration: "45–90 min",
    image: "/gallery-wellness.webp",
    icon: "✦",
    featured: true,
    order: 2,
  },
  {
    slug: "fitness",
    title: "Salle de Sport",
    titleEn: "Fitness Room",
    subtitle: "Restez en forme pendant vos vacances",
    subtitleEn: "Stay fit during your holiday",
    description: "Équipements modernes pour garder la forme tout au long du séjour.",
    descriptionEn: "Modern equipment to keep fit throughout your stay.",
    category: "wellness",
    duration: "Libre accès",
    image: "/gallery-lounge.webp",
    icon: "⚡",
    featured: false,
    order: 3,
  },
  {
    slug: "petanque",
    title: "Terrain de Pétanque",
    titleEn: "Pétanque Court",
    subtitle: "Instants ludiques et conviviaux",
    subtitleEn: "Fun and convivial moments",
    description: "Amateurs de pétanque, ce terrain est fait pour vous.",
    descriptionEn: "Pétanque lovers, this court is made for you.",
    category: "leisure",
    duration: "Libre accès",
    image: "/garden.webp",
    icon: "●",
    featured: false,
    order: 4,
  },
  {
    slug: "badminton-ping-pong",
    title: "Badminton & Ping-pong",
    titleEn: "Badminton & Table Tennis",
    subtitle: "Activités en plein air",
    subtitleEn: "Outdoor activities",
    description: "Des instants ludiques en famille ou entre amis, au grand air.",
    descriptionEn: "Playful moments with family or friends, in the open air.",
    category: "leisure",
    duration: "Libre accès",
    image: "/pool.webp",
    icon: "◗",
    featured: false,
    order: 5,
  },
  {
    slug: "cuisine-familiale",
    title: "Cuisine Familiale",
    titleEn: "Home Cooking",
    subtitle: "Saveurs du Maroc et du monde",
    subtitleEn: "Flavours of Morocco and beyond",
    description:
      "Notre cuisinière prépare des plats de tradition marocaine, enrichis des épices du monde — avec les légumes de saison de notre potager.",
    descriptionEn:
      "Our cook prepares traditional Moroccan dishes enriched with world spices — using seasonal vegetables from our own kitchen garden.",
    category: "dining",
    duration: "Sur demande",
    image: "/dining.webp",
    icon: "❋",
    featured: true,
    order: 6,
  },
  {
    slug: "excursions",
    title: "Excursions Partenaires",
    titleEn: "Partner Excursions",
    subtitle: "Ourika, quad, montgolfière",
    subtitleEn: "Ourika, quad biking, hot-air balloon",
    description:
      "Randonnées dans la vallée de l'Ourika, équitation, quad, buggies, vols en montgolfière — avec nos partenaires sélectionnés.",
    descriptionEn:
      "Hikes in the Ourika valley, horse riding, quad biking, buggies and hot-air balloon flights — with our selected partners.",
    category: "outdoor",
    duration: "½ ou 1 journée",
    image: "/experiences-balloon.webp",
    icon: "◈",
    featured: true,
    order: 7,
  },
];

const GALLERY = [
  { url: "/hero-main.webp", caption: "La villa", captionEn: "The villa", category: "garden", order: 1 },
  { url: "/hero-courtyard.webp", caption: "Le patio", captionEn: "The patio", category: "garden", order: 2 },
  { url: "/garden.webp", caption: "Le jardin", captionEn: "The garden", category: "garden", order: 3 },
  { url: "/pool.webp", caption: "Le bassin", captionEn: "The pond", category: "garden", order: 4 },
  { url: "/room-sienne.webp", caption: "Chambre Rouge", captionEn: "Red Room", category: "rooms", order: 5 },
  { url: "/room-indigo.webp", caption: "Chambre Bleue", captionEn: "Blue Room", category: "rooms", order: 6 },
  { url: "/room-jade.webp", caption: "Chambre Verte", captionEn: "Green Room", category: "rooms", order: 7 },
  { url: "/room-ivoire.webp", caption: "Chambre Rose", captionEn: "Pink Room", category: "rooms", order: 8 },
  { url: "/room-safran.webp", caption: "Suite Bleue", captionEn: "Blue Suite", category: "rooms", order: 9 },
  { url: "/dining.webp", caption: "Salle à manger", captionEn: "Dining room", category: "dining", order: 10 },
  { url: "/hammam.webp", caption: "Hammam", captionEn: "Hammam", category: "wellness", order: 11 },
  { url: "/gallery-wellness.webp", caption: "Espace bien-être", captionEn: "Wellness area", category: "wellness", order: 12 },
];

async function main() {
  for (const r of ROOMS) {
    await db.room.upsert({ where: { slug: r.slug }, update: r, create: r });
  }
  console.log(`Seeded ${ROOMS.length} rooms`);

  for (const e of EXPERIENCES) {
    await db.experience.upsert({ where: { slug: e.slug }, update: e, create: e });
  }
  console.log(`Seeded ${EXPERIENCES.length} experiences`);

  const galleryCount = await db.galleryImage.count();
  if (galleryCount === 0) {
    await db.galleryImage.createMany({ data: GALLERY });
    console.log(`Seeded ${GALLERY.length} gallery images`);
  } else {
    console.log("Gallery already populated, skipping");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
