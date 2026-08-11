import { db } from "@/lib/db";
import { BookingStatusSelect } from "@/components/admin/BookingStatusSelect";

const SERVICE_LABELS: Record<string, string> = {
  villa: "Villa (Séjour)",
  general: "Contact Général",
  golf: "Golf",
  "retraites-yoga": "Retraites & Yoga",
  "mariages-events": "Mariages & Events",
  restauration: "Restauration",
  "bien-etre": "Bien Être",
  excursions: "Excursions",
};

function formatDate(d: Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(d);
}

export default async function AdminDemandesPage() {
  const bookings = await db.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { room: { select: { name: true } } },
  });

  return (
    <div>
      <h1 className="font-serif text-2xl text-foreground mb-1">Demandes</h1>
      <p className="font-sans text-sm text-muted-foreground mb-8">
        {bookings.length} demande{bookings.length !== 1 ? "s" : ""} au total.
      </p>

      {bookings.length === 0 ? (
        <div className="bg-card border border-border p-8 text-center">
          <p className="font-sans text-sm text-muted-foreground">Aucune demande pour le moment.</p>
        </div>
      ) : (
        <div className="bg-card border border-border overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-border">
                <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-muted-foreground px-4 py-3">
                  Contact
                </th>
                <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-muted-foreground px-4 py-3">
                  Type
                </th>
                <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-muted-foreground px-4 py-3">
                  Dates
                </th>
                <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-muted-foreground px-4 py-3">
                  Hôtes
                </th>
                <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-muted-foreground px-4 py-3">
                  Reçue le
                </th>
                <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-muted-foreground px-4 py-3">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0 align-top">
                  <td className="px-4 py-4">
                    <p className="font-sans text-sm text-foreground">
                      {b.firstName} {b.lastName}
                    </p>
                    <p className="font-sans text-xs text-muted-foreground">{b.email}</p>
                    {b.phone && <p className="font-sans text-xs text-muted-foreground">{b.phone}</p>}
                    {b.message && (
                      <p className="font-sans text-xs text-foreground/70 mt-1 max-w-xs">{b.message}</p>
                    )}
                  </td>
                  <td className="px-4 py-4 font-sans text-sm text-foreground/80 whitespace-nowrap">
                    {SERVICE_LABELS[b.serviceType] ?? b.serviceType}
                    {b.room && <span className="block text-xs text-muted-foreground">{b.room.name}</span>}
                  </td>
                  <td className="px-4 py-4 font-sans text-sm text-foreground/80 whitespace-nowrap">
                    {b.checkIn || b.checkOut ? (
                      <>
                        {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-4 font-sans text-sm text-foreground/80">{b.guests}</td>
                  <td className="px-4 py-4 font-sans text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(b.createdAt)}
                  </td>
                  <td className="px-4 py-4">
                    <BookingStatusSelect bookingId={b.id} status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
