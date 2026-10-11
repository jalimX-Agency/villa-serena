import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type CalendarBooking = {
  id: string;
  name: string;
  status: string;
  checkIn: Date;
  checkOut: Date;
};

const TZ = "Africa/Casablanca";
const dayKey = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(d); // YYYY-MM-DD
const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

function monthDays(year: number, month: number) {
  const first = new Date(Date.UTC(year, month, 1, 12));
  const count = new Date(Date.UTC(year, month + 1, 0, 12)).getUTCDate();
  const lead = (first.getUTCDay() + 6) % 7; // Monday-first
  const days = Array.from({ length: count }, (_, i) => new Date(Date.UTC(year, month, i + 1, 12)).toISOString().slice(0, 10));
  return { lead, days, label: new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" }).format(first) };
}

/** Two-month villa occupancy view. Ranges are half-open: the check-out day is free. */
export function AvailabilityCalendar({
  bookings,
  offset,
  basePath,
}: {
  bookings: CalendarBooking[];
  offset: number;
  basePath: string;
}) {
  const ranges = bookings.map((b) => ({ ...b, from: dayKey(b.checkIn), to: dayKey(b.checkOut) }));
  const today = dayKey(new Date());
  const now = new Date();
  const months = [0, 1].map((i) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + offset + i, 1));
    return monthDays(d.getUTCFullYear(), d.getUTCMonth());
  });

  function find(day: string) {
    const hits = ranges.filter((r) => r.from <= day && day < r.to);
    return hits.find((h) => h.status === "confirmed") ?? hits[0];
  }

  return (
    <div>
      <div className="flex items-center justify-between px-5 pt-4">
        <Link href={`${basePath}?m=${offset - 1}`} className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-100" aria-label="Mois précédent">
          <ChevronLeft className="size-4" />
        </Link>
        <div className="flex items-center gap-4 text-[11px] text-stone-500">
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-villa-terracotta" /> Confirmé</span>
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-amber-300" /> En attente</span>
        </div>
        <Link href={`${basePath}?m=${offset + 1}`} className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-100" aria-label="Mois suivant">
          <ChevronRight className="size-4" />
        </Link>
      </div>
      <div className="grid gap-6 p-5 sm:grid-cols-2">
        {months.map((m) => (
          <div key={m.label}>
            <p className="mb-3 text-sm font-semibold capitalize text-stone-800">{m.label}</p>
            <div className="grid grid-cols-7 gap-1 text-center">
              {WEEKDAYS.map((w, i) => (
                <span key={i} className="pb-1 text-[10px] font-medium text-stone-400">{w}</span>
              ))}
              {Array.from({ length: m.lead }, (_, i) => <span key={`l${i}`} />)}
              {m.days.map((day) => {
                const b = find(day);
                const cls = cn(
                  "flex aspect-square items-center justify-center rounded-md text-xs tabular-nums",
                  b?.status === "confirmed" && "bg-villa-terracotta text-white",
                  b && b.status !== "confirmed" && "bg-amber-200 text-amber-900",
                  !b && day < today && "text-stone-300",
                  !b && day >= today && "text-stone-700 hover:bg-stone-100",
                  day === today && "ring-2 ring-stone-900 ring-offset-1"
                );
                const n = Number(day.slice(8));
                return b ? (
                  <Link key={day} href={`/admin/demandes/${b.id}`} title={`${b.name}`} className={cls}>
                    {n}
                  </Link>
                ) : (
                  <span key={day} className={cls}>{n}</span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
