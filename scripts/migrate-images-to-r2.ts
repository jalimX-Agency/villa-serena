// One-off: rewrites local "/x.jpg" image paths stored in the DB to R2 URLs under site/.
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const BASE = (process.env.R2_ENDPOINT ?? "").replace(/\/$/, "");
const fix = (p: string) => (p.startsWith("/") ? `${BASE}/site${p}` : p);

async function retry<T>(fn: () => Promise<T>, n = 6): Promise<T> {
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i >= n) throw e;
      await new Promise((r) => setTimeout(r, 2000 * i));
    }
  }
}

(async () => {
  if (!BASE) throw new Error("R2_ENDPOINT missing");
  let changed = 0;

  for (const r of await retry(() => db.room.findMany({ select: { id: true, image: true, images: true } }))) {
    const image = fix(r.image);
    const images = r.images.split(",").map((s) => fix(s.trim())).filter(Boolean).join(",");
    if (image !== r.image || images !== r.images) {
      await retry(() => db.room.update({ where: { id: r.id }, data: { image, images } }));
      changed++;
    }
  }
  for (const e of await retry(() => db.experience.findMany({ select: { id: true, image: true } }))) {
    if (e.image && fix(e.image) !== e.image) {
      await retry(() => db.experience.update({ where: { id: e.id }, data: { image: fix(e.image) } }));
      changed++;
    }
  }
  for (const g of await retry(() => db.galleryImage.findMany({ select: { id: true, url: true } }))) {
    if (fix(g.url) !== g.url) {
      await retry(() => db.galleryImage.update({ where: { id: g.id }, data: { url: fix(g.url) } }));
      changed++;
    }
  }
  console.log("rows updated:", changed);
  const sample = await retry(() => db.room.findFirst({ select: { image: true, images: true } }));
  console.log(sample);
})()
  .catch((e) => {
    console.error("FAIL", e.message.split("\n").pop());
    process.exit(1);
  })
  .finally(() => db.$disconnect());
