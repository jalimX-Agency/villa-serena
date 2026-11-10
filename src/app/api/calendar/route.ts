import { db } from "@/lib/db";
import { FIRM_STATUSES } from "@/lib/booking-status";

export const dynamic = "force-dynamic";

const ymd = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, "");

/**
 * Booked dates as an iCal feed, to sync with other platforms (Airbnb, Booking…):
 * /api/calendar?key=<ICAL_KEY>. Only firm bookings (deposit received), no guest details.
 */
export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get("key");
  if (!process.env.ICAL_KEY || key !== process.env.ICAL_KEY) return new Response("Not found", { status: 404 });

  const bookings = await db.booking.findMany({
    where: { serviceType: "villa", status: { in: FIRM_STATUSES }, checkIn: { not: null }, checkOut: { not: null } },
    select: { id: true, checkIn: true, checkOut: true, updatedAt: true },
  });
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Villa Serena Marrakech//Reservations//FR",
    "CALSCALE:GREGORIAN",
    ...bookings.flatMap((b) => [
      "BEGIN:VEVENT",
      `UID:${b.id}@villaserenamarrakech.com`,
      `DTSTAMP:${b.updatedAt.toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "")}`,
      `DTSTART;VALUE=DATE:${ymd(b.checkIn!)}`,
      `DTEND;VALUE=DATE:${ymd(b.checkOut!)}`,
      "SUMMARY:Réservé – Villa Serena",
      "END:VEVENT",
    ]),
    "END:VCALENDAR",
  ];
  return new Response(lines.join("\r\n"), { headers: { "Content-Type": "text/calendar; charset=utf-8", "Cache-Control": "no-store" } });
}
