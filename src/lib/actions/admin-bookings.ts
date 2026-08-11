"use server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const VALID_STATUSES = ["pending", "confirmed", "cancelled"];

export async function updateBookingStatus(bookingId: string, status: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  if (!VALID_STATUSES.includes(status)) throw new Error("Invalid status");

  await db.booking.update({ where: { id: bookingId }, data: { status } });
  revalidatePath("/admin/demandes");
  revalidatePath("/admin");
}
