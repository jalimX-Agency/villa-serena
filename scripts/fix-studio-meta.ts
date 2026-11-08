import "dotenv/config";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
const fr = "Studio indépendant de 45 m² à l'écart du riad : lit queen size, coin salon, machine Nespresso, climatisation. Villa privée, route de l'Ourika, Marrakech.";
const en = "An independent 45 m² studio set apart from the riad: queen-size bed, sitting area, Nespresso machine, air conditioning. Private villa, Ourika road, Marrakech.";
console.log(fr.length, en.length);
db.room.updateMany({ where: { slug: "le-studio" }, data: { metaDescription: fr, metaDescriptionEn: en } }).then((r) => console.log(r.count)).finally(() => db.$disconnect());
