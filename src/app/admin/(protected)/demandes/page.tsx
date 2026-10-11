import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import {
  Card,
  EmptyState,
  PageHeader,
  SERVICE_LABELS,
  StatusBadge,
  field,
  formatDate,
  nightsBetween,
} from "@/components/admin/ui";

export const dynamic = "force-dynamic";

const TABS = [
  { value: "", label: "Toutes" },
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmées" },
  { value: "cancelled", label: "Annulées" },
];

export default async function AdminDemandesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; type?: string }>;
}) {
  const { status = "", q = "", type = "" } = await searchParams;

  const where: Prisma.BookingWhereInput = {};
  if (status) where.status = status;
  if (type === "villa") where.serviceType = "villa";
  if (type === "other") where.serviceType = { not: "villa" };
  if (q.trim()) {
    const s = q.trim();
    where.OR = [
      { firstName: { contains: s, mode: "insensitive" } },
      { lastName: { contains: s, mode: "insensitive" } },
      { email: { contains: s, mode: "insensitive" } },
      { phone: { contains: s } },
    ];
  }

  const [bookings, counts] = await Promise.all([
    db.booking.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 }),
    db.booking.groupBy({ by: ["status"], _count: true }),
  ]);
  const countOf = (s: string) =>
    s ? counts.find((c) => c.status === s)?._count ?? 0 : counts.reduce((n, c) => n + c._count, 0);

  const qs = (patch: Record<string, string>) => {
    const p = new URLSearchParams({ status, q, type, ...patch });
    for (const [k, v] of [...p.entries()]) if (!v) p.delete(k);
    const s = p.toString();
    return s ? `?${s}` : "";
  };

  return (
    <div>
      <PageHeader title="Demandes" description="Séjours, devis et messages reçus depuis le site." />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-4">
        <div className="flex gap-1 overflow-x-auto rounded-xl bg-stone-100 p-1">
          {TABS.map((t) => (
            <Link
              key={t.value}
              href={`/admin/demandes${qs({ status: t.value })}`}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition",
                status === t.value ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-800"
              )}
            >
              {t.label}
              <span className="text-[11px] text-stone-400 tabular-nums">{countOf(t.value)}</span>
            </Link>
          ))}
        </div>
        <form className="flex gap-2" action="/admin/demandes">
          {status && <input type="hidden" name="status" value={status} />}
          <select name="type" defaultValue={type} className={cn(field, "w-auto")}>
            <option value="">Tous les types</option>
            <option value="villa">Séjours villa</option>
            <option value="other">Devis & contact</option>
          </select>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
            <input name="q" defaultValue={q} placeholder="Nom, email, téléphone…" className={cn(field, "pl-9 w-56")} />
          </div>
        </form>
      </div>

      <Card className="overflow-hidden">
        {bookings.length === 0 ? (
          <EmptyState>Aucune demande ne correspond.</EmptyState>
        ) : (
          <ul className="divide-y divide-stone-100">
            {bookings.map((b) => (
              <li key={b.id}>
                <Link href={`/admin/demandes/${b.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-stone-50">
                  <span className="hidden sm:flex size-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-semibold text-stone-600">
                    {b.firstName[0]}{b.lastName[0]}
                  </span>
                  <div className="min-w-0 flex-1 grid gap-1 md:grid-cols-[1.4fr_1fr_1.2fr] md:items-center md:gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-stone-900">{b.firstName} {b.lastName}</p>
                      <p className="truncate text-xs text-stone-500">{b.email}</p>
                    </div>
                    <p className="text-sm text-stone-600">{SERVICE_LABELS[b.serviceType] ?? b.serviceType}</p>
                    <p className="text-xs text-stone-500 md:text-sm">
                      {b.checkIn ? (
                        <>
                          {formatDate(b.checkIn, { year: undefined })} → {formatDate(b.checkOut)}
                          <span className="text-stone-400"> · {nightsBetween(b.checkIn, b.checkOut)} n. · {b.guests} pers.</span>
                        </>
                      ) : (
                        <span className="text-stone-400">Reçue le {formatDate(b.createdAt)}</span>
                      )}
                    </p>
                  </div>
                  <StatusBadge status={b.status} />
                  <ChevronRight className="size-4 shrink-0 text-stone-300" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
