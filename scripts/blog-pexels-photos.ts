// Pexels photos for the blog (Pexels licence: free commercial use, no attribution required).
// Downloads each photo, converts it to WebP, uploads it to R2 under blog/, then sets the cover
// and inserts one photo inside each article (FR + EN), after the matching section.
import "dotenv/config";
import sharp from "sharp";
import { PrismaClient } from "@prisma/client";
import { uploadToR2 } from "../src/lib/r2";

const db = new PrismaClient();

type Photo = { id: number; alt: string; altEn: string };
type Plan = {
  slug: string;
  cover: Photo;
  inline: Photo & { afterFr: string; afterEn: string }; // inserted after the paragraph that follows this H2
};

const PLANS: Plan[] = [
  {
    slug: "que-faire-vallee-ourika",
    cover: { id: 37672163, alt: "Rivière et village au pied des montagnes de l'Atlas, dans une vallée près de Marrakech", altEn: "River and village at the foot of the Atlas mountains, in a valley near Marrakech" },
    inline: { id: 37714714, alt: "Maisons en terre d'un village berbère au milieu des cultures, dans l'Atlas", altEn: "Earth houses of a Berber village among the fields, in the Atlas", afterFr: "Villages berbères et artisanat", afterEn: "Berber villages and crafts" },
  },
  {
    slug: "golf-marrakech-route-ourika",
    cover: { id: 39480848, alt: "Parcours de golf bordé de palmiers, sous un ciel bleu", altEn: "Golf course lined with palm trees under a blue sky" },
    inline: { id: 137523, alt: "Balle de golf sur un fairway bien entretenu", altEn: "Golf ball on a well-kept fairway" , afterFr: "Pourquoi jouer au golf à Marrakech", afterEn: "Why play golf in Marrakech" },
  },
  {
    slug: "marrakech-en-famille",
    cover: { id: 35910049, alt: "Dromadaires dans le désert d'Agafay, avec l'Atlas enneigé à l'horizon", altEn: "Camels in the Agafay desert, with the snowy Atlas on the horizon" },
    inline: { id: 36579389, alt: "Dromadaires sellés pour une balade dans le désert d'Agafay, près de Marrakech", altEn: "Camels saddled for a ride in the Agafay desert, near Marrakech", afterFr: "Des excursions à hauteur d'enfant", afterEn: "Excursions for children" },
  },
];

async function toR2(p: Photo) {
  const res = await fetch(`https://images.pexels.com/photos/${p.id}/pexels-photo-${p.id}.jpeg?auto=compress&cs=tinysrgb&w=2000`);
  if (!res.ok) throw new Error(`Pexels ${p.id}: ${res.status}`);
  const webp = await sharp(Buffer.from(await res.arrayBuffer())).resize({ width: 2000, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
  const url = await uploadToR2(`blog/pexels-${p.id}.webp`, webp, "image/webp");
  console.log("  uploaded", p.id, Math.round(webp.length / 1024) + " KB");
  return url;
}

/** Inserts <img> after the first block (</p>, </ul> or </table>) that follows the given H2. */
function insertAfterSection(html: string, heading: string, img: string) {
  const at = html.indexOf(`<h2>${heading}</h2>`);
  if (at === -1) throw new Error(`Heading not found: ${heading}`);
  const ends = ["</p>", "</ul>", "</table>"].map((t) => ({ t, i: html.indexOf(t, at) })).filter((x) => x.i !== -1);
  const first = ends.sort((a, b) => a.i - b.i)[0];
  const pos = first.i + first.t.length;
  if (html.slice(pos, pos + 200).includes("pexels-")) return html; // already inserted
  return html.slice(0, pos) + "\n" + img + html.slice(pos);
}

(async () => {
  for (const plan of PLANS) {
    console.log(plan.slug);
    const post = await db.blogPost.findUnique({ where: { slug: plan.slug } });
    if (!post) { console.log("  not found"); continue; }
    const coverUrl = await toR2(plan.cover);
    const inlineUrl = await toR2(plan.inline);
    await db.blogPost.update({
      where: { id: post.id },
      data: {
        image: coverUrl,
        imageAlt: plan.cover.alt,
        imageAltEn: plan.cover.altEn,
        content: insertAfterSection(post.content, plan.inline.afterFr, `<img src="${inlineUrl}" alt="${plan.inline.alt.replace(/"/g, "&quot;")}">`),
        contentEn: insertAfterSection(post.contentEn, plan.inline.afterEn, `<img src="${inlineUrl}" alt="${plan.inline.altEn.replace(/"/g, "&quot;")}">`),
      },
    });
    console.log("  updated");
  }
})()
  .catch((e) => { console.error("FAIL", e.message); process.exit(1); })
  .finally(() => db.$disconnect());
