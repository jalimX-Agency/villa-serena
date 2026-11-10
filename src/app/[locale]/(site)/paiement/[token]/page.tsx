import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { db } from "@/lib/db";
import { LEGAL, legalHref } from "@/lib/legal";
import { formatEUR } from "@/lib/payments/policy";
import { getPaymentProvider } from "@/lib/payments/provider";
import { getBankDetails, hasBankDetails } from "@/lib/settings";
import { PaymentAction, type PaymentLabels } from "@/components/PaymentAction";
import { StarDivider } from "@/components/StarDivider";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "payment" });
  return { title: { absolute: t("meta_title") }, robots: { index: false, follow: false } };
}

const LABEL_KEYS = [
  "accept_before", "accept_terms", "accept_and", "accept_rules", "accept_after", "accept_required", "pay_card", "continue",
  "transfer_title", "transfer_intro", "holder", "bank", "iban", "swift", "rib", "reference", "no_method", "contact", "secure", "error",
] as const;

/** Payment page reached from the link in the email (never linked from the site). */
export default async function PaymentPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; token: string }>;
  searchParams: Promise<{ retour?: string }>;
}) {
  const { locale, token } = await params;
  const { retour } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("payment");
  const en = locale === "en";

  const p = await db.payment.findUnique({ where: { token }, include: { booking: true } });
  if (!p || !["deposit", "full", "balance"].includes(p.kind)) notFound();
  const b = p.booking;
  const fmt = (d: Date | null, opts: Intl.DateTimeFormatOptions = {}) =>
    d ? new Intl.DateTimeFormat(en ? "en-GB" : "fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC", ...opts }).format(d) : "";

  const timedOut = p.status === "pending" && p.expiresAt !== null && p.expiresAt < new Date();
  const state = p.status === "paid" ? "paid" : p.status !== "pending" || timedOut ? "expired" : retour ? "return" : "pay";
  const title = p.kind === "balance" ? t("title_balance") : p.kind === "full" ? t("title_full") : t("title_deposit");
  const heading = { paid: t("paid_title"), expired: t("expired_title"), return: t("return_title"), pay: title }[state];

  const bank = await getBankDetails();
  const labels = Object.fromEntries(LABEL_KEYS.map((k) => [k, t(k)])) as PaymentLabels;

  return (
    <section className="mx-auto max-w-2xl px-6 pt-32 lg:pt-40 pb-24">
      <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-villa-terracotta mb-4">{t("eyebrow")}</p>
      <h1 className="font-serif text-4xl lg:text-5xl text-villa-ink">{heading}</h1>
      <StarDivider className="my-6 max-w-[10rem]" tone="terracotta" />

      {state === "paid" && <p className="font-sans text-foreground/80 leading-relaxed">{t("paid_body")}</p>}
      {state === "expired" && <p className="font-sans text-foreground/80 leading-relaxed">{t("expired_body")}</p>}
      {state === "return" && <p className="font-sans text-foreground/80 leading-relaxed">{t("return_body")}</p>}

      {state === "pay" && (
        <>
          <dl className="mb-8 divide-y divide-border border-y border-border font-sans text-sm">
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-muted-foreground">{t("dates")}</dt>
              <dd className="text-right text-villa-ink">
                {fmt(b.checkIn)} → {fmt(b.checkOut)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-muted-foreground">{t("guests")}</dt>
              <dd className="text-villa-ink">{b.guests}</dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-muted-foreground">{t("total")}</dt>
              <dd className="text-villa-ink">{formatEUR(b.totalAmount, locale)}</dd>
            </div>
            <div className="flex justify-between gap-4 py-4">
              <dt className="font-medium text-villa-ink">{t("due_now")}</dt>
              <dd className="font-serif text-2xl text-villa-terracotta">{formatEUR(p.amount, locale)}</dd>
            </div>
          </dl>
          <p className="mb-2 font-sans text-xs text-muted-foreground">{t("tax_note")}</p>
          {p.expiresAt && (
            <p className="mb-8 font-sans text-xs text-muted-foreground">
              {t("expires", { date: fmt(p.expiresAt, { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Casablanca" }) })}
            </p>
          )}
          <PaymentAction
            token={token}
            providerReady={getPaymentProvider() !== null}
            legal={{ published: LEGAL.published, termsHref: `/${locale}${legalHref("terms", locale)}`, rulesHref: `/${locale}${legalHref("rules", locale)}` }}
            bank={hasBankDetails(bank) ? bank : null}
            reference={`VS-${b.id.slice(-6).toUpperCase()}`}
            labels={labels}
            contactHref={`/${locale}/contact`}
          />
        </>
      )}
    </section>
  );
}
