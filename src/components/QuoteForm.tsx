"use client";
import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { submitQuoteRequest, type QuoteFormState } from "@/lib/actions/booking";

const initialState: QuoteFormState = { status: "idle" };

export function QuoteForm({ serviceType }: { serviceType: string }) {
  const t = useTranslations();
  const boundAction = submitQuoteRequest.bind(null, serviceType);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  if (state.status === "success") {
    return (
      <div className="bg-card border border-border p-8 text-center">
        <p className="font-serif text-xl text-foreground mb-2">✓</p>
        <p className="font-sans text-foreground/80">{t("contact.form_success")}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="bg-card border border-border p-6 sm:p-8 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
          <label className="font-sans text-xs tracking-wide uppercase text-muted-foreground block mb-1.5 opacity-0 sm:opacity-100">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
          rows={4}
          className="w-full border border-border bg-background px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-villa-terracotta"
        />
      </div>

      {state.status === "error" && (
        <p className="font-sans text-sm text-destructive">
          {state.error === "missing_fields"
            ? "Merci de remplir les champs obligatoires."
            : "Une erreur est survenue, merci de réessayer."}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full px-6 py-3.5 bg-villa-terracotta hover:bg-villa-terracotta/90 disabled:opacity-60 text-white font-sans text-xs tracking-[0.15em] uppercase transition-colors"
      >
        {pending ? "…" : t("experiences.quote_button")}
      </button>
    </form>
  );
}
