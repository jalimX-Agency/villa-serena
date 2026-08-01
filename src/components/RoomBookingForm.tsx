"use client";
import { useActionState, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import { useTranslations } from "next-intl";
import { DateRangePicker, type BookedRange } from "@/components/DateRangePicker";
import { submitRoomBooking, type RoomBookingState } from "@/lib/actions/room-booking";

const initialState: RoomBookingState = { status: "idle" };

const ERROR_MESSAGES: Record<string, { fr: string; en: string }> = {
  missing_fields: {
    fr: "Merci de remplir les champs obligatoires et de choisir vos dates.",
    en: "Please fill in the required fields and choose your dates.",
  },
  invalid_dates: {
    fr: "Dates invalides — la date de départ doit suivre la date d'arrivée.",
    en: "Invalid dates — check-out must be after check-in.",
  },
  unavailable: {
    fr: "Ces dates viennent d'être réservées. Merci d'en choisir d'autres.",
    en: "Those dates were just booked. Please choose different ones.",
  },
  unknown: {
    fr: "Une erreur est survenue, merci de réessayer.",
    en: "Something went wrong, please try again.",
  },
};

export function RoomBookingForm({
  roomId,
  pricePerNight,
  bookedRanges,
  locale,
}: {
  roomId: string;
  pricePerNight: number;
  bookedRanges: BookedRange[];
  locale: string;
}) {
  const t = useTranslations();
  const isEn = locale === "en";
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const boundAction = submitRoomBooking.bind(null, roomId, pricePerNight);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  const nights = checkIn && checkOut ? differenceInCalendarDays(checkOut, checkIn) : 0;
  const total = nights > 0 ? nights * pricePerNight : 0;

  if (state.status === "success") {
    return (
      <div className="bg-card border border-border p-8 text-center">
        <p className="font-serif text-xl text-foreground mb-2">✓</p>
        <p className="font-sans text-foreground/80">{t("contact.form_success")}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="bg-card border border-border p-6 space-y-5">
      <div>
        <p className="font-sans text-xs text-muted-foreground uppercase tracking-wide mb-1">
          {t("suites.from")}
        </p>
        <p className="font-serif text-3xl text-villa-terracotta tabular-nums">
          {pricePerNight}€{" "}
          <span className="text-sm text-muted-foreground font-sans">/ {t("suites.per_night")}</span>
        </p>
      </div>

      <DateRangePicker
        bookedRanges={bookedRanges}
        locale={locale}
        checkIn={checkIn}
        checkOut={checkOut}
        onChange={(ci, co) => {
          setCheckIn(ci);
          setCheckOut(co);
        }}
      />
      <input type="hidden" name="checkIn" value={checkIn ? checkIn.toISOString() : ""} />
      <input type="hidden" name="checkOut" value={checkOut ? checkOut.toISOString() : ""} />

      {nights > 0 && (
        <div className="flex items-center justify-between font-sans text-sm border-t border-border pt-4">
          <span className="text-muted-foreground">
            {nights} {isEn ? (nights > 1 ? "nights" : "night") : nights > 1 ? "nuits" : "nuit"}
          </span>
          <span className="text-foreground font-medium tabular-nums">{total}€</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-sans text-xs tracking-wide uppercase text-muted-foreground block mb-1.5">
            {t("contact.form_name")}
          </label>
          <input
            name="firstName"
            required
            className="w-full border border-border bg-background px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-villa-terracotta"
          />
        </div>
        <div>
          <label className="font-sans text-xs tracking-wide uppercase text-muted-foreground block mb-1.5 opacity-0">
            &nbsp;
          </label>
          <input
            name="lastName"
            required
            className="w-full border border-border bg-background px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-villa-terracotta"
          />
        </div>
      </div>
      <div>
        <label className="font-sans text-xs tracking-wide uppercase text-muted-foreground block mb-1.5">
          {t("contact.form_email")}
        </label>
        <input
          type="email"
          name="email"
          required
          className="w-full border border-border bg-background px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-villa-terracotta"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-sans text-xs tracking-wide uppercase text-muted-foreground block mb-1.5">
            {t("contact.form_phone")}
          </label>
          <input
            name="phone"
            className="w-full border border-border bg-background px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-villa-terracotta"
          />
        </div>
        <div>
          <label className="font-sans text-xs tracking-wide uppercase text-muted-foreground block mb-1.5">
            {t("contact.form_guests")}
          </label>
          <input
            type="number"
            name="guests"
            min={1}
            defaultValue={2}
            className="w-full border border-border bg-background px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-villa-terracotta"
          />
        </div>
      </div>
      <div>
        <label className="font-sans text-xs tracking-wide uppercase text-muted-foreground block mb-1.5">
          {t("contact.form_message")}
        </label>
        <textarea
          name="message"
          rows={3}
          className="w-full border border-border bg-background px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-villa-terracotta"
        />
      </div>

      {state.status === "error" && (
        <p className="font-sans text-sm text-destructive">
          {ERROR_MESSAGES[state.error ?? "unknown"][isEn ? "en" : "fr"]}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || nights === 0}
        className="w-full px-6 py-3.5 bg-villa-terracotta hover:bg-villa-terracotta/90 disabled:opacity-50 text-white font-sans text-xs tracking-[0.15em] uppercase transition-colors"
      >
        {pending ? "…" : t("suites.book_this_room")}
      </button>
    </form>
  );
}
