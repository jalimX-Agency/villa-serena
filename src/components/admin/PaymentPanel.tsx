"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, CreditCard, Link2, Loader2, RotateCcw, Send, ShieldCheck, X } from "lucide-react";
import {
  cancelPaymentLink,
  cancelReservation,
  completeRefund,
  confirmAndSendDepositLink,
  recordManualPayment,
  reopenRequest,
  requestBalance,
  resendPaymentEmail,
  setBookingTotal,
  setCaution,
  type ActionResult,
} from "@/lib/actions/admin-payments";
import { Card, CardHeader, btn, field, labelCls } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export type PanelPayment = {
  id: string;
  kind: string;
  amount: number;
  status: string;
  method: string;
  url: string | null;
  expiresAt: string | null;
  paidAt: string | null;
  createdAt: string;
  note: string;
};

export type PanelProps = {
  bookingId: string;
  status: string;
  total: number;
  hasDates: boolean;
  first: { kind: "deposit" | "full"; amount: number } | null;
  balanceDue: string | null;
  paid: number;
  refundClient: { amount: number; rate: number };
  refundVilla: number;
  payments: PanelPayment[];
  events: { id: string; type: string; message: string; createdAt: string }[];
  providerReady: boolean;
};

const eur = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
const dt = (s: string | null) => (s ? new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Casablanca" }).format(new Date(s)) : "");

const KIND: Record<string, string> = { deposit: "Acompte 50 %", full: "Paiement total", balance: "Solde", refund: "Remboursement", caution: "Caution (empreinte)" };
const PSTATUS: Record<string, [string, string]> = {
  pending: ["En attente", "bg-amber-50 text-amber-700 ring-amber-200"],
  paid: ["Reçu", "bg-emerald-50 text-emerald-700 ring-emerald-200"],
  refunded: ["Remboursé", "bg-emerald-50 text-emerald-700 ring-emerald-200"],
  expired: ["Expiré", "bg-stone-100 text-stone-500 ring-stone-200"],
  cancelled: ["Désactivé", "bg-stone-100 text-stone-500 ring-stone-200"],
  failed: ["Échoué", "bg-red-50 text-red-700 ring-red-200"],
  authorized: ["Autorisée", "bg-sky-50 text-sky-700 ring-sky-200"],
  released: ["Libérée", "bg-stone-100 text-stone-600 ring-stone-200"],
  captured: ["Encaissée", "bg-amber-50 text-amber-800 ring-amber-200"],
};

export function PaymentPanel(props: PanelProps) {
  const router = useRouter();
  const [busy, start] = useTransition();
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(null);
  const [total, setTotal] = useState(props.total ? String(props.total) : "");
  const [copied, setCopied] = useState<string | null>(null);

  const act = (fn: () => Promise<ActionResult>, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return;
    start(async () => {
      const r = await fn();
      setFlash(r.ok ? (r.message ? { ok: true, text: r.message } : null) : { ok: false, text: r.error });
      router.refresh();
    });
  };

  const copy = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(id);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      window.prompt("Copiez le lien :", url);
    }
  };

  const s = props.status;
  const canPrice = ["pending", "confirmed", "expired"].includes(s) && props.paid === 0;
  const activeFirst = props.payments.find((p) => (p.kind === "deposit" || p.kind === "full") && p.status === "pending");
  const pendingBalance = props.payments.find((p) => p.kind === "balance" && p.status === "pending");
  const caution = props.payments.find((p) => p.kind === "caution");
  const closed = ["cancelled", "completed", "expired"].includes(s);

  return (
    <Card>
      <CardHeader title="Paiement" action={busy ? <Loader2 className="size-4 animate-spin text-stone-400" /> : undefined} />
      <div className="space-y-6 p-5">
        {flash && (
          <p className={cn("rounded-lg px-3 py-2 text-sm ring-1", flash.ok ? "bg-emerald-50 text-emerald-800 ring-emerald-200" : "bg-red-50 text-red-700 ring-red-200")}>{flash.text}</p>
        )}
        {!props.providerReady && (
          <p className="rounded-lg bg-stone-50 px-3 py-2 text-xs text-stone-500 ring-1 ring-stone-200">
            Paiement en ligne (PayPal ou CMI) pas encore branché : le lien affiche les coordonnées bancaires pour un virement, et vous enregistrez le paiement ici à réception.
          </p>
        )}

        {/* 1. Price and first payment */}
        {canPrice && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-end gap-2">
              <div className="w-44">
                <label className={labelCls}>Prix du séjour (€, villa entière)</label>
                <input type="number" min={0} step="0.01" value={total} onChange={(e) => setTotal(e.target.value)} className={field} />
              </div>
              <button type="button" disabled={busy} onClick={() => act(() => setBookingTotal(props.bookingId, Number(total)))} className={btn.secondary}>
                Enregistrer
              </button>
            </div>
            {props.first && props.total > 0 && (
              <p className="text-sm text-stone-600">
                {props.first.kind === "full" ? (
                  <>Arrivée dans moins de 30 jours : <strong>paiement total de {eur(props.first.amount)}</strong> à la réservation.</>
                ) : (
                  <>Acompte : <strong>{eur(props.first.amount)}</strong> (50 %), puis solde de {eur(props.total - props.first.amount)} au plus tard le {props.balanceDue}.</>
                )}
              </p>
            )}
            {!activeFirst && (
              <button
                type="button"
                disabled={busy || !(props.total > 0) || !props.hasDates}
                onClick={() => act(() => confirmAndSendDepositLink(props.bookingId), "Confirmer la disponibilité et envoyer au client le lien de paiement (valable 72 heures) ?")}
                className={btn.primary}
              >
                <Send className="size-4" /> Confirmer et envoyer le lien de paiement
              </button>
            )}
          </div>
        )}

        {/* 2. Payments */}
        {props.payments.length > 0 && (
          <ul className="divide-y divide-stone-100 rounded-xl ring-1 ring-stone-200">
            {props.payments.map((p) => (
              <PaymentRow key={p.id} p={p} busy={busy} copied={copied === p.id} onCopy={() => p.url && copy(p.url, p.id)} act={act} />
            ))}
          </ul>
        )}

        {/* 3. Balance */}
        {s === "deposit_paid" && !pendingBalance && (
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" disabled={busy} onClick={() => act(() => requestBalance(props.bookingId), "Envoyer maintenant au client le lien du solde ?")} className={btn.secondary}>
              <Link2 className="size-4" /> Envoyer le lien du solde maintenant
            </button>
            <span className="text-xs text-stone-500">Sinon, il part automatiquement 37 jours avant l&apos;arrivée (rappels à J-32 et J-30).</span>
          </div>
        )}

        {/* 4. Security deposit (card hold) */}
        {["deposit_paid", "paid", "completed"].includes(s) && <CautionBox caution={caution} busy={busy} act={act} bookingId={props.bookingId} />}

        {/* 5. Cancel / reopen */}
        {!closed && s !== "pending" && <CancelBox {...props} busy={busy} act={act} />}
        {["expired", "cancelled"].includes(s) && props.paid === 0 && (
          <button type="button" disabled={busy} onClick={() => act(() => reopenRequest(props.bookingId))} className={btn.secondary}>
            <RotateCcw className="size-4" /> Rouvrir la demande
          </button>
        )}

        {/* 6. Timeline */}
        {props.events.length > 0 && (
          <div>
            <p className={labelCls}>Historique</p>
            <ol className="space-y-1.5 border-l border-stone-200 pl-4">
              {props.events.map((e) => (
                <li key={e.id} className="text-xs text-stone-600">
                  <span className="tabular-nums text-stone-400">{dt(e.createdAt)}</span> · {e.message}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </Card>
  );
}

function PaymentRow({ p, busy, copied, onCopy, act }: { p: PanelPayment; busy: boolean; copied: boolean; onCopy: () => void; act: (fn: () => Promise<ActionResult>, c?: string) => void }) {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState(p.kind === "refund" ? "transfer" : "transfer");
  const [note, setNote] = useState("");
  const [label, cls] = PSTATUS[p.status] ?? [p.status, "bg-stone-100 text-stone-600 ring-stone-200"];
  const inflow = ["deposit", "full", "balance"].includes(p.kind);
  return (
    <li className="space-y-2 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm">
          <span className="font-medium text-stone-900">{KIND[p.kind] ?? p.kind}</span> · <span className="tabular-nums">{eur(p.amount)}</span>
          <span className={cn("ml-2 rounded-full px-2 py-0.5 text-[11px] ring-1 ring-inset", cls)}>{label}</span>
          <p className="mt-0.5 text-xs text-stone-500">
            {p.paidAt ? `Le ${dt(p.paidAt)}` : p.expiresAt && p.status === "pending" ? `Expire le ${dt(p.expiresAt)}` : `Créé le ${dt(p.createdAt)}`}
            {p.method ? ` · ${p.method === "transfer" ? "virement" : p.method}` : ""}
            {p.note ? ` · ${p.note}` : ""}
          </p>
        </div>
        {p.status === "pending" && (
          <div className="flex flex-wrap gap-1.5">
            {p.url && (
              <button type="button" onClick={onCopy} className={btn.secondary}>
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />} {copied ? "Copié" : "Copier le lien"}
              </button>
            )}
            {inflow && (
              <button type="button" disabled={busy} onClick={() => act(() => resendPaymentEmail(p.id))} className={btn.secondary}>
                <Send className="size-4" /> Renvoyer
              </button>
            )}
            <button type="button" onClick={() => setOpen(!open)} className={btn.primary}>
              <Check className="size-4" /> {p.kind === "refund" ? "Marquer remboursé" : "Marquer reçu"}
            </button>
            {inflow && (
              <button type="button" disabled={busy} onClick={() => act(() => cancelPaymentLink(p.id), "Désactiver ce lien de paiement ?")} className={btn.danger} aria-label="Désactiver le lien">
                <X className="size-4" />
              </button>
            )}
          </div>
        )}
      </div>
      {open && p.status === "pending" && (
        <div className="flex flex-wrap items-end gap-2 rounded-lg bg-stone-50 p-3">
          <div>
            <label className={labelCls}>Mode</label>
            <select value={method} onChange={(e) => setMethod(e.target.value)} className={field}>
              <option value="transfer">Virement</option>
              <option value="cash">Espèces</option>
              <option value="other">Autre</option>
            </select>
          </div>
          <div className="min-w-48 flex-1">
            <label className={labelCls}>Note (référence, date de valeur…)</label>
            <input value={note} onChange={(e) => setNote(e.target.value)} className={field} />
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              act(
                () => (p.kind === "refund" ? completeRefund(p.id, method, note) : recordManualPayment(p.id, method, note)),
                p.kind === "refund" ? `Confirmer le remboursement de ${eur(p.amount)} ?` : `Confirmer la réception de ${eur(p.amount)} ? Le client recevra son reçu.`
              )
            }
            className={btn.primary}
          >
            Valider
          </button>
        </div>
      )}
    </li>
  );
}

function CautionBox({ caution, busy, act, bookingId }: { caution?: PanelPayment; busy: boolean; act: (fn: () => Promise<ActionResult>, c?: string) => void; bookingId: string }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const st = caution?.status;
  return (
    <div className="rounded-xl bg-stone-50 p-4">
      <p className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-800">
        <ShieldCheck className="size-4 text-stone-400" /> Caution : empreinte de 1 500 € (CGV, art. 8)
      </p>
      <p className="mb-3 text-xs text-stone-500">
        {!caution ? "Pas encore d'empreinte enregistrée (à faire le jour de l'arrivée)." : `${PSTATUS[st!]?.[0] ?? st} · ${eur(caution.amount)}${caution.note ? ` · ${caution.note}` : ""}`}
      </p>
      <div className="flex flex-wrap items-end gap-2">
        {(!caution || st === "released" || st === "captured") && (
          <button type="button" disabled={busy} onClick={() => act(() => setCaution(bookingId, "authorized", 1500, ""))} className={btn.secondary}>
            <CreditCard className="size-4" /> Empreinte autorisée
          </button>
        )}
        {st === "authorized" && (
          <>
            <button type="button" disabled={busy} onClick={() => act(() => setCaution(bookingId, "released", 0, ""), "L'empreinte a bien été libérée ?")} className={btn.secondary}>
              Libérée
            </button>
            <input type="number" placeholder="Montant retenu" value={amount} onChange={(e) => setAmount(e.target.value)} className={cn(field, "w-36")} />
            <input placeholder="Motif (casse, ménage…)" value={note} onChange={(e) => setNote(e.target.value)} className={cn(field, "w-56")} />
            <button
              type="button"
              disabled={busy || !amount}
              onClick={() => act(() => setCaution(bookingId, "captured", Number(amount), note), `Encaisser ${amount} € sur la caution ? Joignez un justificatif au client (CGV, art. 8).`)}
              className={btn.danger}
            >
              Encaisser
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function CancelBox(props: PanelProps & { busy: boolean; act: (fn: () => Promise<ActionResult>, c?: string) => void }) {
  const [open, setOpen] = useState(false);
  const [by, setBy] = useState<"client" | "villa">("client");
  const [reason, setReason] = useState("");
  const [notify, setNotify] = useState(true);
  const refund = by === "villa" ? props.refundVilla : props.refundClient.amount;
  if (!open)
    return (
      <button type="button" onClick={() => setOpen(true)} className={btn.danger}>
        <X className="size-4" /> Annuler la réservation…
      </button>
    );
  return (
    <div className="space-y-3 rounded-xl bg-red-50/50 p-4 ring-1 ring-red-100">
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="radio" checked={by === "client"} onChange={() => setBy("client")} /> Annulée par le client
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" checked={by === "villa"} onChange={() => setBy("villa")} /> Annulée par la villa
        </label>
      </div>
      <p className="text-sm text-stone-700">
        Déjà versé : <strong>{eur(props.paid)}</strong> · Remboursement dû : <strong>{eur(refund)}</strong>
        {by === "client" ? ` (${Math.round(props.refundClient.rate * 100)} %, barème de l'article 7 à la date d'aujourd'hui)` : " (totalité, article 13)"}
      </p>
      <input placeholder="Motif (affiché dans l'e-mail au client)" value={reason} onChange={(e) => setReason(e.target.value)} className={field} />
      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} /> Prévenir le client par e-mail
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={props.busy}
          onClick={() => props.act(() => cancelReservation(props.bookingId, by, reason, notify), "Annuler définitivement cette réservation ? Les dates seront libérées.")}
          className={btn.danger}
        >
          Confirmer l&apos;annulation
        </button>
        <button type="button" onClick={() => setOpen(false)} className={btn.secondary}>
          Retour
        </button>
      </div>
    </div>
  );
}
