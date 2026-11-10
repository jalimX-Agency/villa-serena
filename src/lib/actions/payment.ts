"use server";
import { db } from "@/lib/db";
import { LEGAL } from "@/lib/legal";
import { logEvent } from "@/lib/mailer";
import { baseUrl } from "@/lib/payments/emails";
import { getPaymentProvider } from "@/lib/payments/provider";

export type StartPaymentResult =
  | { ok: true; type: "redirect"; url: string }
  | { ok: true; type: "form"; action: string; fields: Record<string, string> }
  | { ok: true; type: "transfer" }
  | { ok: false; error: "expired" | "terms" | "unknown" };

/** Guest side: records the acceptance of the terms, then starts the payment (provider page or transfer). */
export async function startPayment(token: string, acceptTerms: boolean): Promise<StartPaymentResult> {
  const p = await db.payment.findUnique({ where: { token }, include: { booking: true } });
  if (!p || p.status !== "pending" || (p.expiresAt && p.expiresAt < new Date())) return { ok: false, error: "expired" };
  if (LEGAL.published && !acceptTerms) return { ok: false, error: "terms" };

  if (LEGAL.published && !p.termsAcceptedAt) {
    await db.payment.update({ where: { id: p.id }, data: { termsAcceptedAt: new Date(), termsVersion: LEGAL.version } });
    await logEvent(p.bookingId, "terms", `CGV et règlement intérieur acceptés sur la page de paiement (version ${LEGAL.version}).`);
  }

  const provider = getPaymentProvider();
  if (!provider) return { ok: true, type: "transfer" };
  try {
    const locale = p.booking.locale === "en" ? "en" : "fr";
    const page = `${baseUrl()}/${locale}/paiement/${token}`;
    const start = await provider.startCheckout({ payment: p, booking: p.booking, returnUrl: `${page}?retour=1`, cancelUrl: page, locale });
    return start.type === "redirect" ? { ok: true, type: "redirect", url: start.url } : { ok: true, type: "form", action: start.action, fields: start.fields };
  } catch (e) {
    console.error("[payment start]", e);
    return { ok: false, error: "unknown" };
  }
}
