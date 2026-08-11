"use client";
import { useTransition } from "react";
import { updateBookingStatus } from "@/lib/actions/admin-bookings";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  pending: "border-amber-400 text-amber-700 bg-amber-50",
  confirmed: "border-emerald-400 text-emerald-700 bg-emerald-50",
  cancelled: "border-border text-muted-foreground bg-muted/30",
};

export function BookingStatusSelect({ bookingId, status }: { bookingId: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value;
        startTransition(() => {
          updateBookingStatus(bookingId, next);
        });
      }}
      className={cn(
        "font-sans text-xs tracking-wide uppercase border px-2 py-1.5 focus:outline-none disabled:opacity-50",
        STATUS_STYLES[status] ?? STATUS_STYLES.pending
      )}
    >
      <option value="pending">En attente</option>
      <option value="confirmed">Confirmée</option>
      <option value="cancelled">Annulée</option>
    </select>
  );
}
