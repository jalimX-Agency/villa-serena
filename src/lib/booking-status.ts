/** Booking statuses (online payment, V4 ch. 19). Shared by the site, the admin and the daily job. */
export const BOOKING_STATUSES = ["pending", "confirmed", "deposit_paid", "paid", "completed", "cancelled", "expired"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const STATUS_LABELS: Record<string, string> = {
  pending: "Demande reçue",
  confirmed: "Acompte attendu",
  deposit_paid: "Acompte payé",
  paid: "Soldée",
  completed: "Séjour terminé",
  cancelled: "Annulée",
  expired: "Expirée",
};

/** Requests and bookings that hold their dates (the date picker on the site greys them out). */
export const HOLDING_STATUSES = ["pending", "confirmed", "deposit_paid", "paid", "completed"];
/** Firm bookings: deposit received. */
export const FIRM_STATUSES = ["deposit_paid", "paid", "completed"];
