"use server";
import { db } from "@/lib/db";

export type RoomBookingState = {
  status: "idle" | "success" | "error";
  error?: "missing_fields" | "invalid_dates" | "unavailable" | "unknown";
};

/** Existing pending/confirmed bookings for a room — used to block dates in the picker. */
export async function getBookedRanges(roomId: string): Promise<{ checkIn: string; checkOut: string }[]> {
  const bookings = await db.booking.findMany({
    where: {
      roomId,
      status: { in: ["pending", "confirmed"] },
      checkIn: { not: null },
      checkOut: { not: null },
    },
    select: { checkIn: true, checkOut: true },
  });

  return bookings
    .filter((b) => b.checkIn && b.checkOut)
    .map((b) => ({
      checkIn: b.checkIn!.toISOString(),
      checkOut: b.checkOut!.toISOString(),
    }));
}

function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && aEnd > bStart;
}

export async function submitRoomBooking(
  roomId: string,
  pricePerNight: number,
  _prevState: RoomBookingState,
  formData: FormData
): Promise<RoomBookingState> {
  const firstName = String(formData.get("firstName") || "").trim();
  const lastName = String(formData.get("lastName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const guests = Number.parseInt(String(formData.get("guests") || ""), 10) || 2;
  const message = String(formData.get("message") || "").trim();
  const checkInRaw = String(formData.get("checkIn") || "");
  const checkOutRaw = String(formData.get("checkOut") || "");

  if (!firstName || !lastName || !email || !checkInRaw || !checkOutRaw) {
    return { status: "error", error: "missing_fields" };
  }

  const checkIn = new Date(checkInRaw);
  const checkOut = new Date(checkOutRaw);

  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime()) || checkOut <= checkIn) {
    return { status: "error", error: "invalid_dates" };
  }

  // Re-validate availability server-side — never trust the client-side picker alone.
  const existing = await db.booking.findMany({
    where: {
      roomId,
      status: { in: ["pending", "confirmed"] },
      checkIn: { not: null },
      checkOut: { not: null },
    },
    select: { checkIn: true, checkOut: true },
  });

  const conflict = existing.some(
    (b) => b.checkIn && b.checkOut && rangesOverlap(checkIn, checkOut, b.checkIn, b.checkOut)
  );
  if (conflict) {
    return { status: "error", error: "unavailable" };
  }

  const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const totalAmount = Math.max(nights, 1) * pricePerNight;

  await db.booking.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      serviceType: "room",
      roomId,
      checkIn,
      checkOut,
      guests,
      message,
      status: "pending",
      totalAmount,
      currency: "EUR",
    },
  });

  // TODO Phase 10: notify via Resend once RESEND_API_KEY exists.
  console.log(`New room booking request from ${email} for room ${roomId}`);

  return { status: "success" };
}
