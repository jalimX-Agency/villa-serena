"use server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { uploadToR2, deleteFromR2 } from "@/lib/r2";

export type AdminRoomState = { status: "idle" | "success" | "error"; error?: string };

async function assertAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
}

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

export async function updateRoom(
  roomId: string,
  _prevState: AdminRoomState,
  formData: FormData
): Promise<AdminRoomState> {
  await assertAdmin();

  const name = str(formData, "name");
  if (!name) return { status: "error", error: "Le nom (FR) est obligatoire." };

  let images: string[] = [];
  try {
    images = (JSON.parse(str(formData, "images") || "[]") as unknown[]).filter((u): u is string => typeof u === "string");
  } catch {
    return { status: "error", error: "Liste de photos invalide." };
  }

  const maxGuests = Number.parseInt(str(formData, "maxGuests"), 10);
  const order = Number.parseInt(str(formData, "order"), 10);
  const existing = await db.room.findUnique({ where: { id: roomId }, select: { images: true, slug: true } });
  if (!existing) return { status: "error", error: "Chambre introuvable." };

  await db.room.update({
    where: { id: roomId },
    data: {
      name,
      nameEn: str(formData, "nameEn"),
      subtitle: str(formData, "subtitle"),
      subtitleEn: str(formData, "subtitleEn"),
      description: str(formData, "description"),
      descriptionEn: str(formData, "descriptionEn"),
      longDescription: str(formData, "longDescription"),
      longDescriptionEn: str(formData, "longDescriptionEn"),
      size: str(formData, "size"),
      bedType: str(formData, "bedType"),
      bedTypeEn: str(formData, "bedTypeEn"),
      maxGuests: Number.isNaN(maxGuests) ? undefined : maxGuests,
      amenities: str(formData, "amenities"),
      amenitiesEn: str(formData, "amenitiesEn"),
      order: Number.isNaN(order) ? undefined : order,
      featured: formData.get("featured") === "on",
      image: images[0] ?? "",
      images: images.join(","),
    },
  });

  // Remove photos that were uploaded through the admin and are no longer used.
  const removed = existing.images.split(",").filter((u) => u && !images.includes(u) && u.includes("/rooms/"));
  await Promise.all(removed.map((u) => deleteFromR2(u).catch((e) => console.error("[room image delete]", e))));

  revalidatePath("/admin/chambres");
  revalidatePath(`/admin/chambres/${roomId}`);
  for (const l of ["fr", "en"]) {
    revalidatePath(`/${l}`);
    revalidatePath(`/${l}/suites`);
    revalidatePath(`/${l}/suites/${existing.slug}`);
  }
  return { status: "success" };
}

const ALLOWED = new Set(["image/webp", "image/jpeg", "image/png"]);

/** Uploads one (client-compressed) room photo; the URL is saved with the form. */
export async function uploadRoomImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  await assertAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || !ALLOWED.has(file.type)) return { error: "Format non pris en charge." };
  if (file.size > 3.5 * 1024 * 1024) return { error: "Image trop lourde (max 3,5 Mo)." };
  const ext = file.type === "image/png" ? "png" : file.type === "image/jpeg" ? "jpg" : "webp";
  try {
    const url = await uploadToR2(
      `rooms/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`,
      Buffer.from(await file.arrayBuffer()),
      file.type
    );
    return { url };
  } catch (e) {
    console.error("[room image upload]", e);
    return { error: "Échec de l'envoi vers le stockage." };
  }
}
