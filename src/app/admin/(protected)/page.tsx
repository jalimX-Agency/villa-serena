import Link from "next/link";
import { ArrowRight, CalendarCheck, Inbox, Moon, Images } from "lucide-react";
import { db } from "@/lib/db";
import { AvailabilityCalendar } from "@/components/admin/AvailabilityCalendar";
import {
  Card,
  CardHeader,
  EmptyState,
  PageHeader,
  SERVICE_LABELS,
  StatusBadge,
  formatDate,
  nightsBetween,
} from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage({ searchParams }: { searchParams: Promise<{ m?: string }> }) {
  const offset = Number.parseInt((await searchParams).m ?? "0", 10) || 0;
  const now = new Date();
  const in30 = new Date(now.getTime() + 30 * 86_400_000);

  const [pending, upcoming, stays, galleryCount] = await Promise.all([
    db.booking.findMany({ where: { status: "pending" }, orderBy: { createdAt: "desc" }, take: 6 }),
    db.booking.findMany({
      where: { serviceType: "villa", status: "confirmed", checkOut: { gte: now } },
      orderBy: { checkIn: "asc" },
      take: 5,
    }),
    db.booking.findMany({
      where: { serviceType: "villa", status: { not: "cancelled" }, checkIn: { not: null }, checkOut: { not: null } },
      select: { id: true, firstName: true, lastName: true, status: true, checkIn: true, checkOut: true },
    }),
    db.galleryImage.count(),
  ]);

  // Booked (confirmed) nights in the next 30 days.
  const bookedNext30 = stays
    .filter((s) => s.status === "confirmed")
    .reduce((sum, s) => {
      const from = Math.max(s.checkIn!.getTime(), now.getTime());
      const to = Math.min(s.checkOut!.getTime(), in30.getTime());
      return sum + Math.max(0, Math.round((to - from) / 86_400_000));
    }, 0);
  const pendingTotal = await db.booking.count({ where: { status: "pending" } });

  const kpis = [
    { label: "Demandes à traiter", value: pendingTotal, icon: Inbox, href: "/admin/demandes?status=pending", accent: pendingTotal > 0 },
    { label: "Séjours confirmés à venir", value: upcoming.length, icon: CalendarCheck, href: "/admin/demandes?status=confirmed" },
    { label: "Taux d'occupation · 30 j", value: `${Math.round((bookedNext30 / 30) * 100)} %`, icon: Moon },
    { label: "Photos dans la galerie", value: galleryCount, icon: Images, href: "/admin/galerie" },
  ];

  const hour = Number(new Intl.DateTimeFormat("fr-FR", { hour: "numeric", hour12: false, timeZone: "Africa/Casablanca" }).format(now));
  const greeting = hour < 18 ? "Bonjour" : "Bonsoir";

  return (
    <div>
      <PageHeader
        title={greeting}
        description={new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "Africa/Casablanca" }).format(now)}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4 mb-6">
        {kpis.map((k) => {
          const inner = (
            <Card className={`p-4 lg:p-5 h-full transition ${k.href ? "hover:ring-stone-300" : ""}`}>
              <div className="flex items-center justify-between">
                <span className={`rounded-lg p-2 ${k.accent ? "bg-villa-terracotta/10 text-villa-terracotta" : "bg-stone-100 text-stone-500"}`}>
                  <k.icon className="size-4" />
                </span>
                {k.href && <ArrowRight className="size-3.5 text-stone-300" />}
              </div>
              <p className="mt-4 font-serif text-3xl text-stone-900 tabular-nums">{k.value}</p>
              <p className="mt-0.5 text-xs text-stone-500">{k.label}</p>
            </Card>
          );
          return k.href ? <Link key={k.label} href={k.href}>{inner}</Link> : <div key={k.label}>{inner}</div>;
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader title="Disponibilités de la villa" />
          <AvailabilityCalendar
            basePath="/admin"
            offset={offset}
            bookings={stays.map((s) => ({
              id: s.id,
              name: `${s.firstName} ${s.lastName}`,
              status: s.status,
              checkIn: s.checkIn!,
              checkOut: s.checkOut!,
            }))}
          />
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title="À traiter"
              action={<Link href="/admin/demandes?status=pending" className="text-xs text-villa-terracotta hover:underline">Tout voir</Link>}
            />
            {pending.length === 0 ? (
              <EmptyState>Aucune demande en attente. 🎉</EmptyState>
            ) : (
              <ul className="divide-y divide-stone-100">
                {pending.map((b) => (
                  <li key={b.id}>
                    <Link href={`/admin/demandes/${b.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-stone-50">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-semibold text-stone-600">
                        {b.firstName[0]}{b.lastName[0]}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-stone-800">{b.firstName} {b.lastName}</p>
                        <p className="truncate text-xs text-stone-500">
                          {SERVICE_LABELS[b.serviceType] ?? b.serviceType}
                          {b.checkIn && ` · ${formatDate(b.checkIn, { year: undefined })} → ${formatDate(b.checkOut, { year: undefined })}`}
                        </p>
                      </div>
                      <span className="text-[11px] text-stone-400 whitespace-nowrap">{formatDate(b.createdAt, { year: undefined })}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeader title="Prochains séjours" />
            {upcoming.length === 0 ? (
              <EmptyState>Aucun séjour confirmé à venir.</EmptyState>
            ) : (
              <ul className="divide-y divide-stone-100">
                {upcoming.map((b) => (
                  <li key={b.id}>
                    <Link href={`/admin/demandes/${b.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-stone-50">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-stone-800">{b.firstName} {b.lastName}</p>
                        <p className="text-xs text-stone-500">
                          {formatDate(b.checkIn, { year: undefined })} → {formatDate(b.checkOut, { year: undefined })} ·{" "}
                          {nightsBetween(b.checkIn, b.checkOut)} nuits · {b.guests} pers.
                        </p>
                      </div>
                      <StatusBadge status={b.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
