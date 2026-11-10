import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const KIND: Record<string, string> = { deposit: "Acompte", full: "Paiement total", balance: "Solde", refund: "Remboursement", caution: "Caution" };
const METHOD: Record<string, string> = { paypal: "PayPal", cmi: "CMI", transfer: "Virement", cash: "Espèces", other: "Autre" };

/** Monthly accounting export (CSV, opens in Excel): money received and refunded in the month. */
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const m = new URL(req.url).searchParams.get("m") ?? "";
  if (!/^\d{4}-\d{2}$/.test(m)) return new Response("Bad month", { status: 400 });
  const [y, mo] = m.split("-").map(Number);
  const from = new Date(Date.UTC(y, mo - 1, 1));
  const to = new Date(Date.UTC(y, mo, 1));

  const rows = await db.payment.findMany({
    where: { paidAt: { gte: from, lt: to }, status: { in: ["paid", "refunded", "captured"] } },
    include: { booking: true },
    orderBy: { paidAt: "asc" },
  });

  const cell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const day = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : "");
  const lines = [
    ["Date", "Référence", "Client", "E-mail", "Arrivée", "Départ", "Type", "Mode", "Montant (EUR)", "Réf. prestataire", "Note"].map(cell).join(";"),
    ...rows.map((p) =>
      [
        day(p.paidAt),
        `VS-${p.booking.id.slice(-6).toUpperCase()}`,
        `${p.booking.firstName} ${p.booking.lastName}`,
        p.booking.email,
        day(p.booking.checkIn),
        day(p.booking.checkOut),
        KIND[p.kind] ?? p.kind,
        METHOD[p.method] ?? p.method,
        (p.kind === "refund" ? -p.amount : p.amount).toFixed(2).replace(".", ","),
        p.providerRef,
        p.note,
      ]
        .map(cell)
        .join(";")
    ),
  ];
  // BOM so that Excel reads the accents correctly.
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="villa-serena-paiements-${m}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
