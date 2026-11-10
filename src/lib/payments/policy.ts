/**
 * Payment rules, from the terms of sale (8 Nov 2026) and V4 chapter 19. Pure functions, no I/O.
 * Days are counted in whole calendar days before the arrival date.
 */

export const DEPOSIT_RATE = 0.5; // CGV art. 6: 50 % to book
export const FULL_PAYMENT_WITHIN_DAYS = 30; // booked less than 30 days ahead: everything at once
export const DEPOSIT_LINK_HOURS = 72; // the deposit link is valid 72 hours, then the dates are released
export const BALANCE_LINK_DAYS = 37; // balance link sent 37 days before arrival
export const BALANCE_REMINDER_DAYS = 32; // reminder
export const BALANCE_DUE_DAYS = 30; // balance due 30 days before arrival
export const BALANCE_CANCEL_DAYS = 23; // unpaid 7 days after the D-30 reminder: cancelled by the client
export const ARRIVAL_REMINDER_DAYS = 3;
export const CAUTION_AMOUNT = 1500; // CGV art. 8: card pre-authorisation

const DAY = 86_400_000;

/** Whole days from `from` (default now) to the arrival date (midnight UTC). */
export function daysBeforeArrival(checkIn: Date, from: Date = new Date()) {
  const a = Date.UTC(checkIn.getUTCFullYear(), checkIn.getUTCMonth(), checkIn.getUTCDate());
  const b = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate());
  return Math.round((a - b) / DAY);
}

export const round2 = (n: number) => Math.round(n * 100) / 100;

/** What the guest pays to book: 50 %, or the whole stay when arriving within 30 days. */
export function firstPayment(total: number, checkIn: Date, now: Date = new Date()) {
  const full = daysBeforeArrival(checkIn, now) < FULL_PAYMENT_WITHIN_DAYS;
  return { kind: full ? ("full" as const) : ("deposit" as const), amount: full ? round2(total) : round2(total * DEPOSIT_RATE) };
}

/** Date the balance is due (D-30). */
export function balanceDueDate(checkIn: Date) {
  return new Date(checkIn.getTime() - BALANCE_DUE_DAYS * DAY);
}

/**
 * CGV art. 7, cancellation by the client: share of the sums already paid that is refunded,
 * according to the date the written notice is received.
 */
export function clientRefundRate(daysBefore: number) {
  if (daysBefore >= 90) return 1;
  if (daysBefore >= 60) return 0.7;
  if (daysBefore >= 14) return 0.5;
  return 0.2;
}

export function refundFor(paid: number, checkIn: Date, by: "client" | "villa", at: Date = new Date()) {
  // CGV art. 13: cancelled by the villa, everything is refunded.
  const rate = by === "villa" ? 1 : clientRefundRate(daysBeforeArrival(checkIn, at));
  return { rate, amount: round2(paid * rate) };
}

export const formatEUR = (n: number, locale = "fr") =>
  new Intl.NumberFormat(locale === "en" ? "en-GB" : "fr-FR", { style: "currency", currency: "EUR" }).format(n);
