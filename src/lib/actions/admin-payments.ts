"use server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { logEvent, sendMail } from "@/lib/mailer";
import { depositLinkMail, balanceLinkMail } from "@/lib/payments/emails";
import { CAUTION_AMOUNT, round2 } from "@/lib/payments/policy";
import { cancelBooking, markPaymentPaid, markRefundDone, recordCaution, sendBalanceLink, sendFirstPaymentLink } from "@/lib/payments/service";

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string };

async function assertAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
}

function refresh(bookingId?: string) {
  if (bookingId) revalidatePath(`/admin/demandes/${bookingId}`);
  revalidatePath("/admin/demandes");
  revalidatePath("/admin/paiements");
  revalidatePath("/admin", "layout");
  revalidatePath("/fr/reservation");
  revalidatePath("/en/reservation");
}

async function run(bookingId: string | undefined, fn: () => Promise<string | void>): Promise<ActionResult> {
  await assertAdmin();
  try {
    const message = await fn();
    refresh(bookingId);
    return { ok: true, message: message || undefined };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Erreur inattendue." };
  }
}

/** Agreed price of the stay (EUR, incl. VAT, tourist tax apart). */
export async function setBookingTotal(bookingId: string, total: number) {
  return run(bookingId, async () => {
    if (!(total > 0) || total > 1_000_000) throw new Error("Montant invalide.");
    const b = await db.booking.findUnique({ where: { id: bookingId }, include: { payments: true } });
    if (!b) throw new Error("Réservation introuvable.");
    if (b.payments.some((p) => p.status === "paid" && p.kind !== "caution")) throw new Error("Un paiement a déjà été reçu : le prix ne peut plus être changé ici.");
    await db.booking.update({ where: { id: bookingId }, data: { totalAmount: round2(total) } });
    await logEvent(bookingId, "price", `Prix du séjour fixé à ${round2(total)} €.`);
  });
}

export async function confirmAndSendDepositLink(bookingId: string) {
  return run(bookingId, async () => {
    await sendFirstPaymentLink(bookingId);
    return "Lien envoyé au client.";
  });
}

export async function requestBalance(bookingId: string) {
  return run(bookingId, async () => {
    await sendBalanceLink(bookingId);
    return "Lien du solde envoyé.";
  });
}

/** Sends the email of a pending payment link again. */
export async function resendPaymentEmail(paymentId: string) {
  const p = await db.payment.findUnique({ where: { id: paymentId }, include: { booking: true } });
  return run(p?.bookingId, async () => {
    if (!p || p.status !== "pending") throw new Error("Ce lien n'est plus actif.");
    const mail = p.kind === "balance" ? balanceLinkMail(p.booking, p, "reminder") : depositLinkMail(p.booking, p);
    const { sent } = await sendMail(mail, p.bookingId);
    return sent ? "E-mail renvoyé." : "Envoi des e-mails pas encore configuré : copiez le lien et envoyez-le par WhatsApp.";
  });
}

/** Payment received outside the site (transfer, cash…). */
export async function recordManualPayment(paymentId: string, method: string, note: string) {
  const p = await db.payment.findUnique({ where: { id: paymentId } });
  return run(p?.bookingId, async () => {
    if (!p) throw new Error("Paiement introuvable.");
    if (!["transfer", "cash", "other"].includes(method)) throw new Error("Mode de paiement invalide.");
    await markPaymentPaid(paymentId, { method, note: note.slice(0, 300) });
    return "Paiement enregistré.";
  });
}

export async function cancelPaymentLink(paymentId: string) {
  const p = await db.payment.findUnique({ where: { id: paymentId } });
  return run(p?.bookingId, async () => {
    if (!p || p.status !== "pending") throw new Error("Ce lien n'est plus actif.");
    await db.payment.update({ where: { id: paymentId }, data: { status: "cancelled" } });
    await logEvent(p.bookingId, "link_cancelled", "Lien de paiement désactivé.");
  });
}

export async function cancelReservation(bookingId: string, by: "client" | "villa", reason: string, notify: boolean) {
  return run(bookingId, async () => {
    const { refund } = await cancelBooking(bookingId, by === "villa" ? "villa" : "client", reason.slice(0, 500), notify);
    return refund > 0 ? `Réservation annulée. Remboursement à effectuer : ${refund} €.` : "Réservation annulée.";
  });
}

export async function completeRefund(paymentId: string, method: string, note: string) {
  const p = await db.payment.findUnique({ where: { id: paymentId } });
  return run(p?.bookingId, async () => {
    if (!p || p.kind !== "refund" || p.status !== "pending") throw new Error("Remboursement introuvable.");
    await markRefundDone(paymentId, method, note.slice(0, 300));
  });
}

export async function setCaution(bookingId: string, status: "authorized" | "released" | "captured", amount: number, note: string) {
  return run(bookingId, async () => {
    if (!["authorized", "released", "captured"].includes(status)) throw new Error("Statut invalide.");
    const value = status === "captured" ? round2(amount) : CAUTION_AMOUNT;
    if (status === "captured" && !(value > 0 && value <= CAUTION_AMOUNT)) throw new Error(`Montant entre 0 et ${CAUTION_AMOUNT} €.`);
    await recordCaution(bookingId, status, value, note.slice(0, 300));
  });
}

/** Back to « demande reçue » (e.g. an expired link the guest still wants). */
export async function reopenRequest(bookingId: string) {
  return run(bookingId, async () => {
    const b = await db.booking.findUnique({ where: { id: bookingId }, include: { payments: true } });
    if (!b || !["expired", "cancelled"].includes(b.status)) throw new Error("Seule une demande expirée ou annulée peut être rouverte.");
    if (b.payments.some((p) => p.status === "paid" && p.kind !== "caution")) throw new Error("Un paiement a été reçu : impossible de rouvrir.");
    await db.booking.update({ where: { id: bookingId }, data: { status: "pending", cancelledAt: null, cancelledBy: "", cancelReason: "" } });
    await logEvent(bookingId, "reopened", "Demande rouverte.");
  });
}

const BANK_KEYS = ["bank_holder", "bank_name", "bank_iban", "bank_swift", "bank_rib"] as const;

/** Bank details shown on the payment page while no online provider is set up. */
export async function saveBankDetails(formData: FormData) {
  return run(undefined, async () => {
    for (const key of BANK_KEYS) {
      const value = String(formData.get(key) ?? "").trim().slice(0, 120);
      await db.setting.upsert({ where: { key }, create: { key, value }, update: { value } });
    }
    return "Coordonnées bancaires enregistrées.";
  });
}
