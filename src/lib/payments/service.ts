import { randomBytes } from "crypto";
import type { Booking, Payment } from "@prisma/client";
import { db } from "@/lib/db";
import { ADMIN_EMAIL, logEvent, sendMail } from "@/lib/mailer";
import {
  ARRIVAL_REMINDER_DAYS,
  BALANCE_CANCEL_DAYS,
  BALANCE_DUE_DAYS,
  BALANCE_LINK_DAYS,
  BALANCE_REMINDER_DAYS,
  DEPOSIT_LINK_HOURS,
  daysBeforeArrival,
  firstPayment,
  formatEUR,
  refundFor,
  round2,
} from "@/lib/payments/policy";
import {
  adminAlertMail,
  arrivalReminderMail,
  balanceLinkMail,
  cancelledMail,
  depositLinkMail,
  linkExpiredMail,
  paymentReceivedMail,
} from "@/lib/payments/emails";

/** Money actually received for the stay (deposit, full, balance), minus refunds already made. */
export function paidSoFar(payments: Payment[]) {
  const inflow = payments.filter((p) => ["deposit", "full", "balance"].includes(p.kind) && p.status === "paid").reduce((n, p) => n + p.amount, 0);
  const refunded = payments.filter((p) => p.kind === "refund" && p.status === "refunded").reduce((n, p) => n + p.amount, 0);
  return round2(inflow - refunded);
}

const newToken = () => randomBytes(24).toString("base64url");

async function loadBooking(id: string) {
  const b = await db.booking.findUnique({ where: { id }, include: { payments: true } });
  if (!b) throw new Error("Réservation introuvable.");
  return b;
}

/** The villa confirms: the guest gets a link for the deposit (or the full amount within 30 days), valid 72 h. */
export async function sendFirstPaymentLink(bookingId: string) {
  const b = await loadBooking(bookingId);
  if (!b.checkIn || !b.checkOut) throw new Error("Les dates du séjour manquent.");
  if (!(b.totalAmount > 0)) throw new Error("Indiquez d'abord le prix du séjour.");
  if (paidSoFar(b.payments) > 0) throw new Error("Un paiement a déjà été reçu pour cette réservation.");

  const { kind, amount } = firstPayment(b.totalAmount, b.checkIn);
  // A new link replaces any previous one that was not paid.
  await db.payment.updateMany({ where: { bookingId, kind: { in: ["deposit", "full"] }, status: "pending" }, data: { status: "cancelled" } });
  const payment = await db.payment.create({
    data: { bookingId, kind, amount, token: newToken(), expiresAt: new Date(Date.now() + DEPOSIT_LINK_HOURS * 3_600_000) },
  });
  const booking = await db.booking.update({ where: { id: bookingId }, data: { status: "confirmed", confirmedAt: new Date(), depositAmount: amount } });
  await logEvent(bookingId, "link_created", `Lien ${kind === "full" ? "de paiement total" : "d'acompte"} créé : ${formatEUR(amount)}, valable 72 h.`);
  await sendMail(depositLinkMail(booking, payment), bookingId);
  return payment;
}

/** Balance link (sent automatically at D-37, or by hand from the admin). */
export async function sendBalanceLink(bookingId: string) {
  const b = await loadBooking(bookingId);
  if (b.status !== "deposit_paid") throw new Error("Le solde ne peut être demandé qu'après l'acompte.");
  const due = round2(b.totalAmount - paidSoFar(b.payments));
  if (due <= 0) throw new Error("Il ne reste rien à payer.");
  let payment = b.payments.find((p) => p.kind === "balance" && p.status === "pending");
  if (!payment) payment = await db.payment.create({ data: { bookingId, kind: "balance", amount: due, token: newToken() } });
  const booking = await db.booking.update({ where: { id: bookingId }, data: { balanceLinkSentAt: new Date() } });
  await logEvent(bookingId, "link_created", `Lien du solde envoyé : ${formatEUR(payment.amount)}.`);
  await sendMail(balanceLinkMail(booking, payment, "first"), bookingId);
  return payment;
}

/** A payment is confirmed: by the provider's notification, or by hand (transfer received). */
export async function markPaymentPaid(paymentId: string, info: { method: string; providerRef?: string; note?: string; provider?: string }) {
  const p = await db.payment.findUnique({ where: { id: paymentId }, include: { booking: true } });
  if (!p) throw new Error("Paiement introuvable.");
  if (p.status === "paid") return p; // notifications can arrive twice
  if (!["deposit", "full", "balance"].includes(p.kind)) throw new Error("Ce mouvement n'est pas un encaissement.");

  const paid = await db.payment.update({
    where: { id: paymentId },
    data: { status: "paid", paidAt: new Date(), method: info.method, provider: info.provider ?? "", providerRef: info.providerRef ?? "", note: info.note ?? p.note },
  });
  const status = p.kind === "deposit" ? "deposit_paid" : "paid";
  const booking = await db.booking.update({ where: { id: p.bookingId }, data: { status } });
  if (p.kind !== "balance") {
    await db.payment.updateMany({ where: { bookingId: p.bookingId, kind: { in: ["deposit", "full"] }, status: "pending" }, data: { status: "cancelled" } });
  }
  await logEvent(p.bookingId, "payment_received", `${p.kind === "balance" ? "Solde" : p.kind === "full" ? "Paiement total" : "Acompte"} reçu : ${formatEUR(p.amount)} (${methodLabel(info.method)}).`);
  await sendMail(paymentReceivedMail(booking, paid), p.bookingId);
  await sendMail(
    adminAlertMail(ADMIN_EMAIL, `Paiement reçu : ${booking.firstName} ${booking.lastName}`, [`${formatEUR(p.amount)} (${methodLabel(info.method)}).`, `Statut : ${status === "paid" ? "séjour soldé" : "acompte payé, dates bloquées"}.`], booking.id),
    p.bookingId
  );
  return paid;
}

export function methodLabel(m: string) {
  return ({ paypal: "PayPal", cmi: "carte bancaire (CMI)", transfer: "virement", cash: "espèces", other: "autre" } as Record<string, string>)[m] ?? m;
}

/** Cancellation: by the client (refund under CGV art. 7) or by the villa (full refund). */
export async function cancelBooking(bookingId: string, by: "client" | "villa", reason: string, notify = true) {
  const b = await loadBooking(bookingId);
  if (b.status === "cancelled") return { refund: 0 };
  const paid = paidSoFar(b.payments);
  const { amount: refund, rate } = b.checkIn ? refundFor(paid, b.checkIn, by) : { amount: by === "villa" ? paid : 0, rate: 0 };

  await db.payment.updateMany({ where: { bookingId, status: "pending", kind: { in: ["deposit", "full", "balance"] } }, data: { status: "cancelled" } });
  if (refund > 0) {
    await db.payment.create({ data: { bookingId, kind: "refund", amount: refund, status: "pending", note: `${Math.round(rate * 100)} % de ${formatEUR(paid)}` } });
  }
  const booking = await db.booking.update({
    where: { id: bookingId },
    data: { status: "cancelled", cancelledAt: new Date(), cancelledBy: by, cancelReason: reason },
  });
  await logEvent(bookingId, "cancelled", `Annulée par ${by === "villa" ? "la villa" : "le client"}${reason ? ` : ${reason}` : ""}. Remboursement dû : ${formatEUR(refund)}.`);
  if (notify && b.email) await sendMail(cancelledMail(booking, refund), bookingId);
  return { refund };
}

/** A refund was made (by transfer, or through the provider). */
export async function markRefundDone(paymentId: string, method: string, note: string) {
  const p = await db.payment.update({ where: { id: paymentId }, data: { status: "refunded", paidAt: new Date(), method, note } });
  await logEvent(p.bookingId, "refund_done", `Remboursement effectué : ${formatEUR(p.amount)} (${methodLabel(method)}).`);
  return p;
}

/** Card hold for the 1 500 € deposit, recorded by hand until the provider does it. */
export async function recordCaution(bookingId: string, status: "authorized" | "released" | "captured", amount: number, note: string) {
  const existing = await db.payment.findFirst({ where: { bookingId, kind: "caution" }, orderBy: { createdAt: "desc" } });
  const p =
    existing && status !== "authorized"
      ? await db.payment.update({ where: { id: existing.id }, data: { status, note: note || existing.note, paidAt: new Date(), ...(status === "captured" ? { amount } : {}) } })
      : await db.payment.create({ data: { bookingId, kind: "caution", amount, status, note, paidAt: new Date() } });
  const label = { authorized: "Empreinte de caution autorisée", released: "Empreinte de caution libérée", captured: "Caution encaissée" }[status];
  await logEvent(bookingId, "caution", `${label} : ${formatEUR(p.amount)}${note ? ` (${note})` : ""}.`);
  return p;
}

type JobReport = Record<string, number>;

/**
 * Daily job (Vercel cron): expires unpaid deposit links, sends the balance link and reminders,
 * cancels unpaid balances, sends the arrival reminder and closes finished stays.
 * Each step is recorded on the booking, so running it twice the same day does nothing more.
 */
export async function runDailyJobs(now: Date = new Date()): Promise<JobReport> {
  const report: JobReport = { expired: 0, balanceLinks: 0, reminders: 0, overdue: 0, autoCancelled: 0, arrival: 0, completed: 0 };

  // 1. Deposit links not paid within 72 h: dates released.
  const stale = await db.payment.findMany({
    where: { kind: { in: ["deposit", "full"] }, status: "pending", expiresAt: { lt: now } },
    include: { booking: true },
  });
  for (const p of stale) {
    await db.payment.update({ where: { id: p.id }, data: { status: "expired" } });
    if (p.booking.status === "confirmed") {
      const b = await db.booking.update({ where: { id: p.bookingId }, data: { status: "expired" } });
      await logEvent(b.id, "expired", "Lien d'acompte expiré sans paiement : dates libérées.");
      await sendMail(linkExpiredMail(b), b.id);
      report.expired++;
    }
  }

  // 2–5. Balance of firm bookings.
  const awaitingBalance = await db.booking.findMany({ where: { status: "deposit_paid", checkIn: { not: null } }, include: { payments: true } });
  for (const b of awaitingBalance) {
    const days = daysBeforeArrival(b.checkIn!, now);
    try {
      if (days <= BALANCE_LINK_DAYS && !b.balanceLinkSentAt) {
        await sendBalanceLink(b.id);
        report.balanceLinks++;
        continue;
      }
      const link = b.payments.find((p) => p.kind === "balance" && p.status === "pending");
      if (!link) continue;
      if (days <= BALANCE_CANCEL_DAYS) {
        await cancelBooking(b.id, "client", "Solde non réglé dans les délais (CGV, article 6).");
        await sendMail(adminAlertMail(ADMIN_EMAIL, `Réservation annulée (solde impayé) : ${b.firstName} ${b.lastName}`, ["Le solde n'a pas été réglé 7 jours après le rappel : la réservation est passée en « annulée par le client ».", "Vérifiez le remboursement dû dans la fiche."], b.id), b.id);
        report.autoCancelled++;
      } else if (days <= BALANCE_DUE_DAYS && !b.balanceAlertAt) {
        await db.booking.update({ where: { id: b.id }, data: { balanceAlertAt: now } });
        await sendMail(balanceLinkMail(b, link, "overdue"), b.id);
        await sendMail(adminAlertMail(ADMIN_EMAIL, `Solde non reçu : ${b.firstName} ${b.lastName}`, [`Le solde de ${formatEUR(link.amount)} était dû aujourd'hui (J-30).`, "Sans paiement dans 7 jours, la réservation sera annulée automatiquement."], b.id), b.id);
        report.overdue++;
      } else if (days <= BALANCE_REMINDER_DAYS && !b.balanceReminderAt) {
        await db.booking.update({ where: { id: b.id }, data: { balanceReminderAt: now } });
        await sendMail(balanceLinkMail(b, link, "reminder"), b.id);
        report.reminders++;
      }
    } catch (e) {
      console.error("[daily job]", b.id, e);
    }
  }

  // 6. Arrival reminder (D-3), for paid stays.
  const soon = await db.booking.findMany({ where: { status: "paid", arrivalReminderAt: null, checkIn: { not: null } } });
  for (const b of soon) {
    const days = daysBeforeArrival(b.checkIn!, now);
    if (days <= ARRIVAL_REMINDER_DAYS && days >= 0) {
      await db.booking.update({ where: { id: b.id }, data: { arrivalReminderAt: now } });
      await sendMail(arrivalReminderMail(b), b.id);
      report.arrival++;
    }
  }

  // 7. Finished stays.
  const done = await db.booking.updateMany({ where: { status: "paid", checkOut: { lt: now } }, data: { status: "completed" } });
  report.completed = done.count;

  return report;
}

export type BookingWithPayments = Booking & { payments: Payment[] };
