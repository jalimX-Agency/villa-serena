"use client";
import { useRef, useState, useTransition } from "react";
import { Loader2, Lock } from "lucide-react";
import { startPayment, type StartPaymentResult } from "@/lib/actions/payment";
import type { BankDetails } from "@/lib/settings";

export type PaymentLabels = Record<
  | "accept_before" | "accept_terms" | "accept_and" | "accept_rules" | "accept_after" | "accept_required"
  | "pay_card" | "continue" | "transfer_title" | "transfer_intro" | "holder" | "bank" | "iban" | "swift" | "rib"
  | "reference" | "no_method" | "contact" | "secure" | "error",
  string
>;

/** Terms acceptance, then the provider's hosted page or the bank transfer details. */
export function PaymentAction({
  token,
  providerReady,
  legal,
  bank,
  reference,
  labels,
  contactHref,
}: {
  token: string;
  providerReady: boolean;
  legal: { published: boolean; termsHref: string; rulesHref: string };
  bank: BankDetails | null;
  reference: string;
  labels: PaymentLabels;
  contactHref: string;
}) {
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [transfer, setTransfer] = useState(false);
  const [form, setForm] = useState<Extract<StartPaymentResult, { type: "form" }> | null>(null);
  const [busy, start] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const go = () => {
    setError("");
    if (legal.published && !accepted) return setError(labels.accept_required);
    start(async () => {
      const r = await startPayment(token, accepted);
      if (!r.ok) return setError(r.error === "terms" ? labels.accept_required : labels.error);
      if (r.type === "redirect") window.location.href = r.url;
      else if (r.type === "form") {
        setForm(r);
        setTimeout(() => formRef.current?.submit(), 0);
      } else setTransfer(true);
    });
  };

  if (transfer) {
    if (!bank) {
      return (
        <div className="space-y-4">
          <p className="font-sans text-sm leading-relaxed text-foreground/80">{labels.no_method}</p>
          <a href={contactHref} className="inline-flex px-6 py-3 bg-villa-terracotta text-white font-sans text-xs tracking-[0.15em] uppercase hover:brightness-110">
            {labels.contact}
          </a>
        </div>
      );
    }
    const rows = [
      [labels.holder, bank.holder],
      [labels.bank, bank.bank],
      [labels.iban, bank.iban],
      [labels.swift, bank.swift],
      [labels.rib, bank.rib],
      [labels.reference, reference],
    ].filter(([, v]) => v);
    return (
      <div className="space-y-4">
        <h2 className="font-serif text-2xl text-villa-ink">{labels.transfer_title}</h2>
        <p className="font-sans text-sm leading-relaxed text-foreground/80">{labels.transfer_intro}</p>
        <dl className="divide-y divide-border border-y border-border">
          {rows.map(([k, v]) => (
            <div key={k} className="flex flex-wrap justify-between gap-2 py-3 font-sans text-sm">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="font-medium text-villa-ink select-all break-all">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {legal.published && (
        <label className="flex items-start gap-3 font-sans text-sm text-foreground/80">
          <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-1 size-4 accent-villa-terracotta" />
          <span>
            {labels.accept_before}
            <a href={legal.termsHref} target="_blank" rel="noopener noreferrer" className="text-villa-terracotta underline underline-offset-2">
              {labels.accept_terms}
            </a>
            {labels.accept_and}
            <a href={legal.rulesHref} target="_blank" rel="noopener noreferrer" className="text-villa-terracotta underline underline-offset-2">
              {labels.accept_rules}
            </a>
            {labels.accept_after}
          </span>
        </label>
      )}
      <button
        type="button"
        onClick={go}
        disabled={busy}
        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-3.5 bg-villa-terracotta hover:brightness-110 text-white font-sans text-xs tracking-[0.15em] uppercase transition disabled:opacity-60"
      >
        {busy ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
        {providerReady ? labels.pay_card : labels.continue}
      </button>
      {error && <p className="font-sans text-sm text-red-700">{error}</p>}
      {providerReady && <p className="font-sans text-xs text-muted-foreground">{labels.secure}</p>}
      {form && (
        <form ref={formRef} method="POST" action={form.action} className="hidden">
          {Object.entries(form.fields).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))}
        </form>
      )}
    </div>
  );
}
