"use server";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export type AdminRoomState = { status: "idle" | "success" | "error"; error?: string };

export async function updateRoom(
  roomId: string,
  _prevState: AdminRoomState,
  formData: FormData
): Promise<AdminRoomState> {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const price = Number.parseFloat(String(formData.get("price") || ""));
  const maxGuests = Number.parseInt(String(formData.get("maxGuests") || ""), 10);
  const order = Number.parseInt(String(formData.get("order") || ""), 10);

  if (Number.isNaN(price) || price < 0) {
    return { status: "error", error: "Prix invalide." };
  }

  await db.room.update({
    where: { id: roomId },
    data: {
      subtitle: String(formData.get("subtitle") || "").trim(),
      subtitleEn: String(formData.get("subtitleEn") || "").trim(),
      price,
      size: String(formData.get("size") || "").trim(),
      bedType: String(formData.get("bedType") || "").trim(),
      bedTypeEn: String(formData.get("bedTypeEn") || "").trim(),
      maxGuests: Number.isNaN(maxGuests) ? undefined : maxGuests,
      amenities: String(formData.get("amenities") || "").trim(),
      amenitiesEn: String(formData.get("amenitiesEn") || "").trim(),
      order: Number.isNaN(order) ? undefined : order,
      featured: formData.get("featured") === "on",
    },
  });

  revalidatePath("/admin/chambres");
  revalidatePath(`/admin/chambres/${roomId}`);
  redirect("/admin/chambres");
}
