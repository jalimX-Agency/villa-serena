"use client";
import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { saveBankDetails } from "@/lib/actions/admin-payments";
import type { BankDetails } from "@/lib/settings";
import { btn, field, labelCls } from "@/components/admin/ui";

/** Bank details shown to guests on the payment page while online payment is not active. */
export function BankDetailsForm({ initial }: { initial: BankDetails }) {
  const [busy, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const fields: [keyof BankDetails, string, string][] = [
    ["holder", "bank_holder", "Titulaire du compte (ex. GAUTAMA SARL AU)"],
    ["bank", "bank_name", "Banque"],
    ["iban", "bank_iban", "IBAN"],
    ["swift", "bank_swift", "BIC / SWIFT"],
    ["rib", "bank_rib", "RIB (24 chiffres)"],
  ];
  return (
    <form
      action={(fd) =>
        start(async () => {
          const r = await saveBankDetails(fd);
          setMsg(r.ok ? { ok: true, text: r.message ?? "Enregistré." } : { ok: false, text: r.error });
        })
      }
      className="grid gap-4 p-5 sm:grid-cols-2"
    >
      {fields.map(([k, name, label]) => (
        <div key={name} className={k === "holder" ? "sm:col-span-2" : ""}>
          <label className={labelCls}>{label}</label>
          <input name={name} defaultValue={initial[k]} className={field} autoComplete="off" />
        </div>
      ))}
      <div className="flex items-center gap-3 sm:col-span-2">
        <button type="submit" disabled={busy} className={btn.primary}>
          {busy && <Loader2 className="size-4 animate-spin" />} Enregistrer
        </button>
        {msg && <span className={msg.ok ? "flex items-center gap-1 text-sm text-emerald-600" : "text-sm text-red-600"}>{msg.ok && <Check className="size-4" />}{msg.text}</span>}
      </div>
      <p className="text-xs text-stone-400 sm:col-span-2">Ces coordonnées n&apos;apparaissent que sur la page de paiement d&apos;un client qui a reçu un lien, jamais ailleurs sur le site.</p>
    </form>
  );
}
