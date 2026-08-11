import Link from "next/link";
import { db } from "@/lib/db";

export default async function AdminDashboardPage() {
  const [pendingCount, totalBookings, roomCount, recentBookings] = await Promise.all([
    db.booking.count({ where: { status: "pending" } }),
    db.booking.count(),
    db.room.count(),
    db.booking.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const stats = [
    { label: "Demandes en attente", value: pendingCount },
    { label: "Demandes au total", value: totalBookings },
    { label: "Chambres", value: roomCount },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl text-foreground mb-1">Tableau de bord</h1>
      <p className="font-sans text-sm text-muted-foreground mb-8">Villa Serena Marrakech</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border p-6">
            <p className="font-serif text-3xl text-villa-terracotta mb-1">{s.value}</p>
            <p className="font-sans text-xs tracking-wide uppercase text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-sans text-xs tracking-[0.15em] uppercase text-muted-foreground">
            Demandes récentes
          </h2>
          <Link href="/admin/demandes" className="font-sans text-xs text-villa-terracotta hover:underline">
            Voir tout →
          </Link>
        </div>
        {recentBookings.length === 0 ? (
          <p className="px-6 py-6 font-sans text-sm text-muted-foreground">Aucune demande pour le moment.</p>
        ) : (
          <ul>
            {recentBookings.map((b) => (
              <li key={b.id} className="flex items-center justify-between px-6 py-3 border-b border-border last:border-0">
                <div>
                  <p className="font-sans text-sm text-foreground">
                    {b.firstName} {b.lastName}
                  </p>
                  <p className="font-sans text-xs text-muted-foreground">
                    {b.serviceType} · {b.email}
                  </p>
                </div>
                <span className="font-sans text-[10px] tracking-wide uppercase text-muted-foreground">
                  {b.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
