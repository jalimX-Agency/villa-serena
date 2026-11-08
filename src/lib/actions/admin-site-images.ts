"use server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { uploadToR2, deleteFromR2 } from "@/lib/r2";
import { SITE_IMAGE_SLOTS, type SiteImageKey } from "@/lib/site-images";

const ALLOWED = new Set(["image/webp", "image/jpeg", "image/png"]);
const EXT: Record<string, string> = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png" };
const MAX_BYTES = 3.5 * 1024 * 1024;

async function assertAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
}

function isSlot(key: string): key is SiteImageKey {
  return Object.prototype.hasOwnProperty.call(SITE_IMAGE_SLOTS, key);
}

/** Only files this section uploaded are ever deleted from storage. */
async function removeUploaded(url: string | undefined) {
  if (!url) return;
  if (url.includes("/site-images/")) await deleteFromR2(url).catch(() => {});
}

function refresh() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/photos");
}

export type SiteImageResult = { ok: true; url?: string } | { ok: false; error: string };

/** Replaces the photo of one slot (file already compressed in the browser). */
export async function replaceSiteImage(formData: FormData): Promise<SiteImageResult> {
  await assertAdmin();
  const key = String(formData.get("key") || "");
  const file = formData.get("file");
  if (!isSlot(key)) return { ok: false, error: "Emplacement inconnu." };
  if (!(file instanceof File)) return { ok: false, error: "Fichier manquant." };
  if (!ALLOWED.has(file.type)) return { ok: false, error: "Format non pris en charge (JPG, PNG, WebP)." };
  if (file.size > MAX_BYTES) return { ok: false, error: "Image trop lourde (max 3,5 Mo)." };

  const objectKey = `site-images/${key.replace(/\./g, "-")}-${Date.now()}.${EXT[file.type]}`;
  try {
    const url = await uploadToR2(objectKey, Buffer.from(await file.arrayBuffer()), file.type);
    const previous = await db.siteImage.findUnique({ where: { key } });
    await db.siteImage.upsert({ where: { key }, create: { key, url }, update: { url } });
    await removeUploaded(previous?.url);
    refresh();
    return { ok: true, url };
  } catch (e) {
    console.error("[site image upload]", e);
    return { ok: false, error: "Échec de l'envoi vers le stockage." };
  }
}

/** Saves the photo descriptions (FR/EN) used by Google and screen readers. */
export async function saveSiteImageAlt(key: string, alt: string, altEn: string): Promise<SiteImageResult> {
  await assertAdmin();
  if (!isSlot(key)) return { ok: false, error: "Emplacement inconnu." };
  const data = { alt: alt.trim().slice(0, 200), altEn: altEn.trim().slice(0, 200) };
  const existing = await db.siteImage.findUnique({ where: { key } });
  if (existing) await db.siteImage.update({ where: { key }, data });
  else await db.siteImage.create({ data: { key, url: "", ...data } });
  refresh();
  return { ok: true };
}

/** Back to the original photo and descriptions. */
export async function resetSiteImage(key: string): Promise<SiteImageResult> {
  await assertAdmin();
  if (!isSlot(key)) return { ok: false, error: "Emplacement inconnu." };
  const existing = await db.siteImage.findUnique({ where: { key } });
  if (existing) {
    await db.siteImage.delete({ where: { key } });
    await removeUploaded(existing.url);
  }
  refresh();
  return { ok: true };
}
