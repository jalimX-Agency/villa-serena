import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, MessageCircle, CalendarDays, Users, Moon, Clock } from "lucide-react";
import { db } from "@/lib/db";
import { BookingActions } from "@/components/admin/BookingActions";
import { Card, CardHeader, SERVICE_LABELS, StatusBadge, btn, formatDate, nightsBetween } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminDemandeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = await db.booking.findUnique({ where: { id }, include: { room: { select: { name: true } } } });
  if (!b) notFound();

  // Overlapping, non-cancelled villa stays — a warning before confirming.
  const conflicts =
    b.serviceType === "villa" && b.checkIn && b.checkOut
      ? await db.booking.findMany({
          where: {
            id: { not: b.id },
            serviceType: "villa",
            status: { not: "cancelled" },
            checkIn: { lt: b.checkOut },
            checkOut: { gt: b.checkIn },
          },
          select: { id: true, firstName: true, lastName: true, status: true },
        })
      : [];

  const phoneDigits = b.phone.replace(/[^\d]/g, "");
  const nights = nightsBetween(b.checkIn, b.checkOut);

  const facts = [
    b.checkIn && { icon: CalendarDays, label: "Dates", value: `${formatDate(b.checkIn)} → ${formatDate(b.checkOut)}` },
    nights > 0 && { icon: Moon, label: "Durée", value: `${nights} nuit${nights > 1 ? "s" : ""}` },
    { icon: Users, label: "Voyageurs", value: `${b.guests} personne${b.guests > 1 ? "s" : ""}` },
    { icon: Clock, label: "Reçue le", value: formatDate(b.createdAt, { hour: "2-digit", minute: "2-digit" }) },
  ].filter(Boolean) as { icon: typeof Moon; label: string; value: string }[];

  return (
    <div>
      <Link href="/admin/demandes" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900">
        <ArrowLeft className="size-4" /> Demandes
      </Link>

      <div className="mt-4 mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl text-stone-900">{b.firstName} {b.lastName}</h1>
            <StatusBadge status={b.status} />
          </div>
          <p className="mt-1 text-sm text-stone-500">
            {SERVICE_LABELS[b.serviceType] ?? b.serviceType}
            {b.room && ` · ${b.room.name}`}
          </p>
        </div>
        <BookingActions bookingId={b.id} status={b.status} />
      </div>

      {conflicts.length > 0 && (
        <div className="mb-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
          ⚠️ Ces dates chevauchent :{" "}
          {conflicts.map((c, i) => (
            <span key={c.id}>
              {i > 0 && ", "}
              <Link href={`/admin/demandes/${c.id}`} className="font-medium underline">
                {c.firstName} {c.lastName}
              </Link>{" "}
              ({c.status === "confirmed" ? "confirmée" : "en attente"})
            </span>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Détails du séjour" />
            <dl className="grid gap-px bg-stone-100 sm:grid-cols-2">
              {facts.map((f) => (
                <div key={f.label} className="flex items-start gap-3 bg-white px-5 py-4">
                  <f.icon className="mt-0.5 size-4 text-stone-400" />
                  <div>
                    <dt className="text-xs text-stone-500">{f.label}</dt>
                    <dd className="text-sm font-medium text-stone-900">{f.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </Card>
          <Card>
            <CardHeader title="Message" />
            <p className="whitespace-pre-line px-5 py-4 text-sm leading-relaxed text-stone-700">
              {b.message || <span className="text-stone-400">Aucun message.</span>}
            </p>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader title="Contact" />
          <div className="space-y-3 px-5 py-4 text-sm">
            <p className="flex items-center gap-2 text-stone-700"><Mail className="size-4 text-stone-400" /> {b.email}</p>
            {b.phone && <p className="flex items-center gap-2 text-stone-700"><Phone className="size-4 text-stone-400" /> {b.phone}</p>}
          </div>
          <div className="grid gap-2 border-t border-stone-100 px-5 py-4">
            <a href={`mailto:${b.email}?subject=${encodeURIComponent("Votre demande — Villa Serena Marrakech")}`} className={btn.primary}>
              <Mail className="size-4" /> Répondre par email
            </a>
            {phoneDigits && (
              <>
                <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noreferrer" className={btn.secondary}>
                  <MessageCircle className="size-4" /> WhatsApp
                </a>
                <a href={`tel:${b.phone}`} className={btn.secondary}>
                  <Phone className="size-4" /> Appeler
                </a>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
