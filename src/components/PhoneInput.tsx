"use client";
import { useMemo, useState } from "react";
import { useLocale } from "next-intl";

/** Country dialling codes, the villa's main markets first (recette of 11 Nov 2026). */
const COUNTRIES: [iso: string, code: string][] = [
  ["FR", "+33"], ["BE", "+32"], ["CH", "+41"], ["LU", "+352"], ["GB", "+44"], ["DE", "+49"], ["NL", "+31"],
  ["ES", "+34"], ["IT", "+39"], ["PT", "+351"], ["IE", "+353"], ["AT", "+43"], ["SE", "+46"], ["NO", "+47"],
  ["DK", "+45"], ["FI", "+358"], ["PL", "+48"], ["MA", "+212"], ["US", "+1"], ["CA", "+1"], ["AE", "+971"],
  ["SA", "+966"], ["QA", "+974"], ["KW", "+965"], ["IL", "+972"], ["AU", "+61"],
];

const flag = (iso: string) => String.fromCodePoint(...[...iso].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));

/**
 * Phone with its country code, sent as one "phone" field: "+33 612345678".
 * A leading 0 is dropped after the code; a number typed with +/00 is kept as typed.
 */
export function PhoneInput({ name = "phone", className, required }: { name?: string; className?: string; required?: boolean }) {
  const locale = useLocale();
  const [iso, setIso] = useState(locale === "en" ? "GB" : "FR");
  const [number, setNumber] = useState("");

  const names = useMemo(() => new Intl.DisplayNames([locale === "en" ? "en" : "fr"], { type: "region" }), [locale]);
  const code = COUNTRIES.find(([i]) => i === iso)?.[1] ?? "";
  const raw = number.trim();
  // The field style without its width: the code takes 6 rem, the number the rest.
  const base = (className ?? "").replace(/w-full/g, "");
  const value = !raw ? "" : /^(\+|00)/.test(raw) ? raw.replace(/^00/, "+") : `${code} ${raw.replace(/^0+/, "")}`;

  return (
    <div className="flex">
      <input type="hidden" name={name} value={value} />
      <select
        aria-label={locale === "en" ? "Country code" : "Indicatif du pays"}
        value={iso}
        onChange={(e) => setIso(e.target.value)}
        className={`${base} shrink-0 border-r-0 pr-1`}
        style={{ width: "6rem" }}
      >
        {COUNTRIES.map(([i, c]) => (
          <option key={i} value={i}>
            {flag(i)} {c} · {names.of(i)}
          </option>
        ))}
      </select>
      <input
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        required={required}
        value={number}
        onChange={(e) => setNumber(e.target.value.replace(/[^\d\s+().-]/g, ""))}
        placeholder={iso === "FR" ? "6 12 34 56 78" : iso === "MA" ? "6 63 52 49 91" : ""}
        className={`${base} min-w-0 flex-1`}
      />
    </div>
  );
}
