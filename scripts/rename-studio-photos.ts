// Recette of 11 Nov 2026: the Studio photos were stored as suite-bleue*.jpg. Copies them under names
// that describe them (V4 photo chapter, adjusted to their real content) and points the site to them.
// The old objects are kept. Run once: npx tsx scripts/rename-studio-photos.ts
import "dotenv/config";
import { S3Client, CopyObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { db } from "../src/lib/db";

const RENAMES: [string, string][] = [
  ["site/suite-bleue.jpg", "site/villa-serena-studio-independant-salon.jpg"], // S71: the Studio lounge
  ["site/suite-bleue-3.jpg", "site/villa-serena-studio-coin-salon.jpg"], // sitting area (V4 S72 said "coin salon café")
  ["site/suite-bleue-2.jpg", "site/villa-serena-studio-salle-d-eau.jpg"], // shower room (V4 S73 said "terrasse vue piscine")
];

const client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID!, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY! },
});
const BUCKET = process.env.R2_BUCKET_NAME!;
const PUBLIC = (process.env.R2_ENDPOINT ?? "").replace(/\/$/, "");

(async () => {
  for (const [from, to] of RENAMES) {
    await client.send(new CopyObjectCommand({ Bucket: BUCKET, CopySource: `${BUCKET}/${from}`, Key: to, ContentType: "image/jpeg", CacheControl: "public, max-age=31536000, immutable", MetadataDirective: "REPLACE" }));
    await client.send(new HeadObjectCommand({ Bucket: BUCKET, Key: to }));
    console.log("copied", from, "→", to);
  }
  const url = (k: string) => `${PUBLIC}/${k}`;
  const studio = await db.room.update({
    where: { slug: "le-studio" },
    data: { image: url(RENAMES[0][1]), images: [RENAMES[0][1], RENAMES[1][1], RENAMES[2][1]].map(url).join(",") },
  });
  console.log("studio", studio.image.slice(-45));
  const g = await db.galleryImage.updateMany({ where: { url: url(RENAMES[0][0]) }, data: { url: url(RENAMES[0][1]) } });
  console.log("gallery", g.count);
})().finally(() => db.$disconnect());
