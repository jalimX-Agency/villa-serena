"use server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { uploadToR2, deleteFromR2 } from "@/lib/r2";

const ALLOWED = new Set(["image/webp", "image/jpeg", "image/png"]);
const EXT: Record<string, string> = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png" };
const MAX_BYTES = 3.5 * 1024 * 1024;

async function assertAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
}

function refresh() {
  revalidatePath("/admin/galerie");
  revalidatePath("/fr/galerie");
  revalidatePath("/en/galerie");
}

export type UploadResult = { ok: true } | { ok: false; error: string };

/** Uploads one (client-compressed) image to R2 and records it. */
export async function uploadGalleryImage(formData: FormData): Promise<UploadResult> {
  await assertAdmin();
  const file = formData.get("file");
  const category = String(formData.get("category") || "garden");
  if (!(file instanceof File)) return { ok: false, error: "Fichier manquant." };
  if (!ALLOWED.has(file.type)) return { ok: false, error: "Format non pris en charge (JPG, PNG, WebP)." };
  if (file.size > MAX_BYTES) return { ok: false, error: "Image trop lourde (max 3,5 Mo)." };

  const key = `gallery/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${EXT[file.type]}`;
  try {
    const url = await uploadToR2(key, Buffer.from(await file.arrayBuffer()), file.type);
    const last = await db.galleryImage.findFirst({ orderBy: { order: "desc" }, select: { order: true } });
    await db.galleryImage.create({ data: { url, category, order: (last?.order ?? 0) + 1 } });
  } catch (e) {
    console.error("[gallery upload]", e);
    return { ok: false, error: "Échec de l'envoi vers le stockage." };
  }
  refresh();
  return { ok: true };
}

export async function updateGalleryImage(id: string, formData: FormData) {
  await assertAdmin();
  await db.galleryImage.update({
    where: { id },
    data: {
      alt: String(formData.get("alt") || "").trim(),
      altEn: String(formData.get("altEn") || "").trim(),
      category: String(formData.get("category") || "garden"),
      featured: formData.get("featured") === "on",
    },
  });
  refresh();
}

export async function deleteGalleryImage(id: string) {
  await assertAdmin();
  const img = await db.galleryImage.findUnique({ where: { id } });
  if (!img) return;
  await db.galleryImage.delete({ where: { id } });
  await deleteFromR2(img.url).catch((e) => console.error("[gallery delete]", e));
  refresh();
}
