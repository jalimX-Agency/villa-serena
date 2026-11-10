import Link from "next/link";
import { Download } from "lucide-react";
import { db } from "@/lib/db";
import { getBankDetails } from "@/lib/settings";
import { getPaymentProvider } from "@/lib/payments/provider";
import { BankDetailsForm } from "@/components/admin/BankDetailsForm";
import { Card, CardHeader, EmptyState, PageHeader, btn, formatDate } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const KIND: Record<string, string> = { deposit: "Acompte", full: "Paiement total", balance: "Solde", refund: "Remboursement", caution: "Caution" };
const STATUS: Record<string, string> = {
  pending: "En attente", paid: "Reçu", refunded: "Remboursé", expired: "Expiré", cancelled: "Désactivé", failed: "Échoué",
  authorized: "Empreinte", released: "Libérée", captured: "Encaissée",
};
const METHOD: Record<string, string> = { paypal: "PayPal", cmi: "CMI", transfer: "Virement", cash: "Espèces", other: "Autre" };
const eur = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

function monthRange(m: string) {
  const [y, mo] = m.split("-").map(Number);
  return { from: new Date(Date.UTC(y, mo - 1, 1)), to: new Date(Date.UTC(y, mo, 1)) };
}

export default async function AdminPaymentsPage({ searchParams }: { searchParams: Promise<{ m?: string }> }) {
  const now = new Date();
  const current = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const { m = current } = await searchParams;
  const month = /^\d{4}-\d{2}$/.test(m) ? m : current;
  const { from, to } = monthRange(month);

  const [payments, pending, bank] = await Promise.all([
    db.payment.findMany({
      where: { OR: [{ paidAt: { gte: from, lt: to } }, { paidAt: null, createdAt: { gte: from, lt: to } }] },
      include: { booking: { select: { id: true, firstName: true, lastName: true, checkIn: true } } },
      orderBy: [{ paidAt: "desc" }, { createdAt: "desc" }],
    }),
    db.payment.findMany({
      where: { status: "pending" },
      include: { booking: { select: { id: true, firstName: true, lastName: true, checkIn: true } } },
      orderBy: { createdAt: "asc" },
    }),
    getBankDetails(),
  ]);

  const received = payments.filter((p) => p.status === "paid" && p.kind !== "caution").reduce((n, p) => n + p.amount, 0);
  const refunded = payments.filter((p) => p.status === "refunded").reduce((n, p) => n + p.amount, 0);
  const shift = (k: number) => {
    const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + k, 1));
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  };
  const monthLabel = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" }).format(from);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Paiements"
        description="Acomptes, soldes, remboursements et cautions. Le paiement en ligne (PayPal ou CMI) se branchera ici dès l'ouverture du compte."
        actions={
          <a href={`/admin/paiements/export?m=${month}`} className={btn.secondary}>
            <Download className="size-4" /> Export comptable ({monthLabel})
          </a>
        }
      />

      {!getPaymentProvider() && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
          Paiement en ligne pas encore activé : les liens envoyés aux clients affichent vos coordonnées bancaires (ci-dessous) pour un virement. Enregistrez chaque paiement reçu depuis la fiche de la réservation.
        </p>
      )}

      {pending.length > 0 && (
        <Card>
          <CardHeader title={`En attente (${pending.length})`} />
          <Table rows={pending} />
        </Card>
      )}

      <Card>
        <CardHeader
          title={`Mouvements de ${monthLabel}`}
          action={
            <div className="flex items-center gap-1 text-sm">
              <Link href={`/admin/paiements?m=${shift(-1)}`} className="rounded-lg px-2 py-1 text-stone-500 hover:bg-stone-100">←</Link>
              <Link href={`/admin/paiements?m=${shift(1)}`} className="rounded-lg px-2 py-1 text-stone-500 hover:bg-stone-100">→</Link>
            </div>
          }
        />
        <div className="grid grid-cols-2 gap-px bg-stone-100 sm:grid-cols-3">
          <Stat label="Encaissé" value={eur(received)} />
          <Stat label="Remboursé" value={eur(refunded)} />
          <Stat label="Net" value={eur(received - refunded)} />
        </div>
        {payments.length === 0 ? <EmptyState>Aucun mouvement ce mois-ci.</EmptyState> : <Table rows={payments} />}
      </Card>

      <Card>
        <CardHeader title="Coordonnées bancaires (virement)" />
        <BankDetailsForm initial={bank} />
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white px-5 py-4">
      <p className="text-xs text-stone-500">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums text-stone-900">{value}</p>
    </div>
  );
}

type Row = {
  id: string;
  kind: string;
  amount: number;
  status: string;
  method: string;
  paidAt: Date | null;
  createdAt: Date;
  booking: { id: string; firstName: string; lastName: string; checkIn: Date | null };
};

function Table({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-stone-100 text-left text-xs text-stone-500">
            <th className="px-5 py-3 font-medium">Date</th>
            <th className="px-5 py-3 font-medium">Client</th>
            <th className="px-5 py-3 font-medium">Type</th>
            <th className="px-5 py-3 font-medium">Mode</th>
            <th className="px-5 py-3 font-medium">Statut</th>
            <th className="px-5 py-3 text-right font-medium">Montant</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {rows.map((p) => (
            <tr key={p.id} className="hover:bg-stone-50">
              <td className="px-5 py-3 tabular-nums text-stone-500">{formatDate(p.paidAt ?? p.createdAt)}</td>
              <td className="px-5 py-3">
                <Link href={`/admin/demandes/${p.booking.id}`} className="font-medium text-stone-900 hover:underline">
                  {p.booking.firstName} {p.booking.lastName}
                </Link>
                {p.booking.checkIn && <span className="ml-2 text-xs text-stone-400">arrivée {formatDate(p.booking.checkIn)}</span>}
              </td>
              <td className="px-5 py-3 text-stone-700">{KIND[p.kind] ?? p.kind}</td>
              <td className="px-5 py-3 text-stone-500">{METHOD[p.method] ?? "—"}</td>
              <td className="px-5 py-3 text-stone-500">{STATUS[p.status] ?? p.status}</td>
              <td className={cn("px-5 py-3 text-right tabular-nums", p.kind === "refund" ? "text-red-700" : "text-stone-900")}>
                {p.kind === "refund" ? "−" : ""}
                {eur(p.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
