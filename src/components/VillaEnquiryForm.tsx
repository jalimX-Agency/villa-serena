"use client";
import { useActionState, useEffect } from "react";
import { differenceInCalendarDays } from "date-fns";
import { useTranslations } from "next-intl";
import { submitVillaBooking, type VillaBookingState } from "@/lib/actions/villa-booking";
import { LEGAL, legalHref } from "@/lib/legal";

const initialState: VillaBookingState = { status: "idle" };

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
    fr: "Ces dates viennent d'être demandées par un autre groupe. Merci d'en choisir d'autres.",
    en: "Those dates have just been requested by another group. Please choose different ones.",
  },
  terms_required: {
    fr: "Merci d'accepter les conditions générales de vente et le règlement intérieur.",
    en: "Please accept the terms of sale and the house rules.",
  },
  unknown: {
    fr: "Une erreur est survenue, merci de réessayer.",
    en: "Something went wrong, please try again.",
  },
};

export function VillaEnquiryForm({
  checkIn,
  checkOut,
  locale,
  onBack,
  onStatusChange,
}: {
  checkIn: Date;
  checkOut: Date;
  locale: string;
  onBack: () => void;
  onStatusChange?: (status: VillaBookingState["status"]) => void;
}) {
  const t = useTranslations();
  const isEn = locale === "en";

  const [state, formAction, pending] = useActionState(submitVillaBooking, initialState);

  useEffect(() => {
    onStatusChange?.(state.status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  const nights = differenceInCalendarDays(checkOut, checkIn);

  return (
    <form action={formAction} className="bg-card border border-border p-6 sm:p-8 space-y-5">
      <input type="hidden" name="locale" value={locale} />
      <div className="flex items-center justify-between border-b border-border pb-4">
        <p className="font-sans text-sm text-foreground">
          {new Intl.DateTimeFormat(isEn ? "en-GB" : "fr-FR", { day: "numeric", month: "short" }).format(checkIn)}
          {" → "}
          {new Intl.DateTimeFormat(isEn ? "en-GB" : "fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(
            checkOut
          )}
          <span className="text-muted-foreground">
            {" · "}
            {nights} {isEn ? (nights > 1 ? "nights" : "night") : nights > 1 ? "nuits" : "nuit"}
          </span>
        </p>
        <button
          type="button"
          onClick={onBack}
          className="font-sans text-[11px] tracking-wide uppercase text-villa-terracotta hover:underline shrink-0"
        >
          {isEn ? "Change dates" : "Changer les dates"}
        </button>
      </div>

      <input type="hidden" name="checkIn" value={checkIn.toISOString()} />
      <input type="hidden" name="checkOut" value={checkOut.toISOString()} />

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
            max={14}
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

      {/* Avenant 1, M48: never pre-ticked, required, links open in a new tab. Shown once both
          documents are published. */}
      {LEGAL.published && (
        <label className="flex items-start gap-3 font-sans text-sm text-foreground/85 leading-relaxed">
          <input
            type="checkbox"
            name="acceptTerms"
            required
            className="mt-1 size-4 shrink-0 accent-villa-terracotta"
            onInvalid={(e) => e.currentTarget.setCustomValidity(t("legal.accept_required"))}
            onChange={(e) => e.currentTarget.setCustomValidity("")}
          />
          <span>
            {t("legal.accept_before")}
            <a href={`/${locale}${legalHref("terms", locale)}`} target="_blank" rel="noopener noreferrer" className="text-villa-terracotta underline underline-offset-2">
              {t("legal.accept_terms")}
            </a>
            {t("legal.accept_and")}
            <a href={`/${locale}${legalHref("rules", locale)}`} target="_blank" rel="noopener noreferrer" className="text-villa-terracotta underline underline-offset-2">
              {t("legal.accept_rules")}
            </a>
            {t("legal.accept_after")}
          </span>
        </label>
      )}

      {state.status === "error" && (
        <p className="font-sans text-sm text-destructive">
          {ERROR_MESSAGES[state.error ?? "unknown"][isEn ? "en" : "fr"]}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full px-6 py-3.5 bg-villa-terracotta hover:bg-villa-terracotta/90 disabled:opacity-50 text-white font-sans text-xs tracking-[0.15em] uppercase transition-colors"
      >
        {pending ? "…" : t("reservation.submit")}
      </button>
    </form>
  );
}
