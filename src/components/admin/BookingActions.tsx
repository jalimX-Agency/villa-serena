"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X, RotateCcw } from "lucide-react";
import { updateBookingStatus } from "@/lib/actions/admin-bookings";
import { btn } from "@/components/admin/ui";

export function BookingActions({ bookingId, status }: { bookingId: string; status: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const set = (next: string, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return;
    start(async () => {
      await updateBookingStatus(bookingId, next);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {status !== "confirmed" && (
        <button type="button" disabled={pending} onClick={() => set("confirmed")} className={btn.primary}>
          <Check className="size-4" /> Confirmer
        </button>
      )}
      {status !== "cancelled" && (
        <button
          type="button"
          disabled={pending}
          onClick={() => set("cancelled", "Annuler cette demande ? Les dates redeviendront disponibles sur le site.")}
          className={btn.danger}
        >
          <X className="size-4" /> Annuler
        </button>
      )}
      {status !== "pending" && (
        <button type="button" disabled={pending} onClick={() => set("pending")} className={btn.secondary}>
          <RotateCcw className="size-4" /> Remettre en attente
        </button>
      )}
    </div>
  );
}
