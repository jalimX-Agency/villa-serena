"use server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { uploadToR2, deleteFromR2 } from "@/lib/r2";
import { sanitizeArticle, readingMinutes } from "@/lib/sanitize";
import { BLOG_CATEGORIES } from "@/lib/blog";

async function assertAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
}

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

function toSlug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

async function uniqueSlug(base: string, excludeId?: string) {
  let slug = base || "article";
  for (let i = 2; ; i++) {
    const hit = await db.blogPost.findUnique({ where: { slug }, select: { id: true } });
    if (!hit || hit.id === excludeId) return slug;
    slug = `${base}-${i}`;
  }
}

function refresh(slug?: string) {
  revalidatePath("/admin/blog");
  for (const l of ["fr", "en"]) {
    revalidatePath(`/${l}/blog`);
    if (slug) revalidatePath(`/${l}/blog/${slug}`);
  }
}

export type BlogFormState = { status: "idle" | "success" | "error"; error?: string; id?: string };

/** Creates (no id) or updates a post. HTML is sanitised; slug and reading time are derived. */
export async function saveBlogPost(id: string | null, _prev: BlogFormState, fd: FormData): Promise<BlogFormState> {
  await assertAdmin();
  const title = str(fd, "title");
  if (!title) return { status: "error", error: "Le titre (FR) est obligatoire." };
  const content = sanitizeArticle(str(fd, "content"));
  if (!content) return { status: "error", error: "Le contenu (FR) est vide." };
  const category = str(fd, "category");

  const existing = id ? await db.blogPost.findUnique({ where: { id } }) : null;
  if (id && !existing) return { status: "error", error: "Article introuvable." };

  const wantedSlug = toSlug(str(fd, "slug") || title);
  const slug = await uniqueSlug(wantedSlug, id ?? undefined);
  const contentEn = sanitizeArticle(str(fd, "contentEn"));
  const order = Number.parseInt(str(fd, "order"), 10);

  const data = {
    title,
    titleEn: str(fd, "titleEn"),
    slug,
    category: (BLOG_CATEGORIES as readonly string[]).includes(category) ? category : "guides",
    excerpt: str(fd, "excerpt"),
    excerptEn: str(fd, "excerptEn"),
    content,
    contentEn,
    readTime: readingMinutes(content),
    image: str(fd, "image"),
    imageAlt: str(fd, "imageAlt"),
    imageAltEn: str(fd, "imageAltEn"),
    metaTitle: str(fd, "metaTitle"),
    metaTitleEn: str(fd, "metaTitleEn"),
    metaDescription: str(fd, "metaDescription"),
    metaDescriptionEn: str(fd, "metaDescriptionEn"),
    published: fd.get("published") === "on",
    featured: fd.get("featured") === "on",
    order: Number.isNaN(order) ? 0 : order,
  };

  const saved = existing
    ? await db.blogPost.update({ where: { id: existing.id }, data })
    : await db.blogPost.create({ data: { ...data, author: "L'équipe de la Villa Serena" } });

  // Replaced cover uploaded through the admin: remove the old file.
  if (existing?.image && existing.image !== data.image && existing.image.includes("/blog/")) {
    await deleteFromR2(existing.image).catch((e) => console.error("[blog image delete]", e));
  }
  refresh(saved.slug);
  if (existing && existing.slug !== saved.slug) refresh(existing.slug);
  return { status: "success", id: saved.id };
}

export async function deleteBlogPost(id: string) {
  await assertAdmin();
  const post = await db.blogPost.findUnique({ where: { id } });
  if (!post) return;
  await db.blogPost.delete({ where: { id } });
  if (post.image.includes("/blog/")) await deleteFromR2(post.image).catch(() => {});
  refresh(post.slug);
}

const ALLOWED = new Set(["image/webp", "image/jpeg", "image/png"]);

/** Uploads one (client-compressed) cover image; the URL is saved with the form. */
export async function uploadBlogImage(fd: FormData): Promise<{ url?: string; error?: string }> {
  await assertAdmin();
  const file = fd.get("file");
  if (!(file instanceof File) || !ALLOWED.has(file.type)) return { error: "Format non pris en charge." };
  if (file.size > 3.5 * 1024 * 1024) return { error: "Image trop lourde (max 3,5 Mo)." };
  const ext = file.type === "image/png" ? "png" : file.type === "image/jpeg" ? "jpg" : "webp";
  try {
    const url = await uploadToR2(`blog/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`, Buffer.from(await file.arrayBuffer()), file.type);
    return { url };
  } catch (e) {
    console.error("[blog image upload]", e);
    return { error: "Échec de l'envoi vers le stockage." };
  }
}
