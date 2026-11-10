import type { Booking, Payment } from "@prisma/client";
import { LEGAL, legalHref } from "@/lib/legal";
import { SITE_URL } from "@/lib/seo";
import { formatEUR } from "@/lib/payments/policy";
import type { Mail } from "@/lib/mailer";

/** Base address for links in emails: the real domain once live, the Vercel address until then. */
export function baseUrl() {
  if (process.env.PUBLIC_BASE_URL) return process.env.PUBLIC_BASE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.NODE_ENV !== "production") return "http://localhost:3050";
  return SITE_URL;
}

export const paymentUrl = (p: Payment, locale: string) => `${baseUrl()}/${locale === "en" ? "en" : "fr"}/paiement/${p.token}`;

const fmtDate = (d: Date | null, en: boolean) =>
  d ? new Intl.DateTimeFormat(en ? "en-GB" : "fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(d) : "";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Plain, readable layout in the villa's colours; every email also has a text version. */
function layout(en: boolean, title: string, paragraphs: string[], cta?: { label: string; url: string }) {
  const body = paragraphs.map((p) => `<p style="margin:0 0 14px;line-height:1.6">${p}</p>`).join("");
  const button = cta
    ? `<p style="margin:24px 0"><a href="${cta.url}" style="display:inline-block;background:#A9553B;color:#fff;text-decoration:none;padding:12px 26px;font:600 13px/1 Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase">${esc(cta.label)}</a></p>
       <p style="margin:0 0 14px;font-size:12px;color:#6F6B4F">${en ? "If the button does not work, copy this address:" : "Si le bouton ne fonctionne pas, copiez cette adresse :"}<br><span style="word-break:break-all">${cta.url}</span></p>`
    : "";
  return `<!doctype html><html><body style="margin:0;background:#F6F0E6;padding:24px 12px;font-family:Arial,sans-serif;color:#2B2B2B">
  <div style="max-width:560px;margin:0 auto;background:#FBF8F2;border-top:4px solid #A9553B;padding:28px 26px">
    <p style="margin:0 0 4px;font:11px/1 Arial,sans-serif;letter-spacing:.25em;text-transform:uppercase;color:#A9553B">Villa Serena Marrakech</p>
    <h1 style="margin:0 0 20px;font:400 26px/1.25 Georgia,serif;color:#14213D">${esc(title)}</h1>
    ${body}${button}
    <p style="margin:24px 0 0;font-size:12px;color:#6F6B4F;border-top:1px solid #D9C9A8;padding-top:14px">Villa Serena · ${en ? "Ourika road, km 17, Marrakech" : "route de l'Ourika, km 17, Marrakech"} · +212 663 524 991 · guest@villaserenamarrakech.com</p>
  </div></body></html>`;
}

const text = (title: string, paragraphs: string[], cta?: { label: string; url: string }) =>
  [title, "", ...paragraphs.map((p) => p.replace(/<[^>]+>/g, "")), ...(cta ? ["", `${cta.label} : ${cta.url}`] : []), "", "Villa Serena Marrakech · +212 663 524 991 · guest@villaserenamarrakech.com"].join("\n");

function mail(b: Booking, subject: string, title: string, paragraphs: string[], cta?: { label: string; url: string }): Mail {
  const en = b.locale === "en";
  return { to: b.email, subject, html: layout(en, title, paragraphs, cta), text: text(title, paragraphs, cta) };
}

function stay(b: Booking) {
  const en = b.locale === "en";
  return en
    ? `Stay from <strong>${fmtDate(b.checkIn, en)}</strong> to <strong>${fmtDate(b.checkOut, en)}</strong>, ${b.guests} guests, whole villa: <strong>${formatEUR(b.totalAmount, "en")}</strong> (tourist tax not included).`
    : `Séjour du <strong>${fmtDate(b.checkIn, en)}</strong> au <strong>${fmtDate(b.checkOut, en)}</strong>, ${b.guests} personnes, villa entière : <strong>${formatEUR(b.totalAmount)}</strong> (hors taxe de séjour).`;
}

function termsLine(b: Booking) {
  if (!LEGAL.published) return [];
  const en = b.locale === "en";
  const l = en ? "en" : "fr";
  const terms = `${baseUrl()}/${l}${legalHref("terms", l)}`;
  const rules = `${baseUrl()}/${l}${legalHref("rules", l)}`;
  return [
    en
      ? `Our <a href="${terms}">terms of sale</a> and <a href="${rules}">house rules</a> apply to your stay.`
      : `Nos <a href="${terms}">conditions générales de vente</a> et notre <a href="${rules}">règlement intérieur</a> s'appliquent à votre séjour.`,
  ];
}

export function depositLinkMail(b: Booking, p: Payment) {
  const en = b.locale === "en";
  const url = paymentUrl(p, b.locale);
  const full = p.kind === "full";
  const until = p.expiresAt ? new Intl.DateTimeFormat(en ? "en-GB" : "fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Casablanca" }).format(p.expiresAt) : "";
  return mail(
    b,
    en ? "Your stay at Villa Serena: confirm with your payment" : "Votre séjour à la Villa Serena : confirmez par votre paiement",
    en ? `${b.firstName}, the villa is yours` : `${b.firstName}, la villa vous attend`,
    [
      en ? "Good news: the villa is available for your dates." : "Bonne nouvelle : la villa est disponible pour vos dates.",
      stay(b),
      en
        ? `To confirm, please pay ${full ? "the full amount" : "the 50 % deposit"} of <strong>${formatEUR(p.amount, "en")}</strong> through the secure link below, before <strong>${until}</strong> (Marrakech time). After that, the dates are released.`
        : `Pour confirmer, merci de régler ${full ? "la totalité du séjour" : "l'acompte de 50 %"}, soit <strong>${formatEUR(p.amount)}</strong>, par le lien sécurisé ci-dessous, avant le <strong>${until}</strong> (heure de Marrakech). Passé ce délai, les dates sont libérées.`,
      ...(full ? [] : [en ? "The balance is due 30 days before your arrival; we will send you a link." : "Le solde est à régler 30 jours avant votre arrivée ; nous vous enverrons un lien."]),
      ...termsLine(b),
    ],
    { label: en ? "Pay securely" : "Payer en toute sécurité", url }
  );
}

export function paymentReceivedMail(b: Booking, p: Payment) {
  const en = b.locale === "en";
  const balance = p.kind === "balance";
  const full = p.kind === "full" || balance;
  return mail(
    b,
    en ? (full ? "Payment received: your stay is fully paid" : "Deposit received: your stay is confirmed") : full ? "Paiement reçu : votre séjour est réglé" : "Acompte reçu : votre séjour est confirmé",
    en ? "Thank you" : "Merci",
    [
      en
        ? `We have received your payment of <strong>${formatEUR(p.amount, "en")}</strong> on ${fmtDate(p.paidAt, en)}. This email is your receipt.`
        : `Nous avons bien reçu votre paiement de <strong>${formatEUR(p.amount)}</strong> le ${fmtDate(p.paidAt, en)}. Cet e-mail vaut reçu.`,
      stay(b),
      full
        ? en ? "Your stay is now fully paid. We will write to you a few days before your arrival with the practical details." : "Votre séjour est désormais entièrement réglé. Nous vous écrirons quelques jours avant votre arrivée avec les informations pratiques."
        : en ? "Your dates are now reserved. The balance is due 30 days before your arrival; we will send you the link." : "Vos dates sont désormais réservées. Le solde est à régler 30 jours avant votre arrivée ; nous vous enverrons le lien.",
      en ? "A 1,500 € card pre-authorisation (no debit) is made for the security deposit, as set out in our terms." : "Une empreinte bancaire de 1 500 € (sans débit) est réalisée pour la caution, comme prévu par nos conditions.",
      ...termsLine(b),
    ]
  );
}

export function balanceLinkMail(b: Booking, p: Payment, reminder: "first" | "reminder" | "overdue") {
  const en = b.locale === "en";
  const url = paymentUrl(p, b.locale);
  const due = fmtDate(new Date(b.checkIn!.getTime() - 30 * 86_400_000), en);
  const lead = {
    first: en ? `Your stay is getting close. The balance of <strong>${formatEUR(p.amount, "en")}</strong> is due by <strong>${due}</strong>.` : `Votre séjour approche. Le solde de <strong>${formatEUR(p.amount)}</strong> est à régler au plus tard le <strong>${due}</strong>.`,
    reminder: en ? `A friendly reminder: the balance of <strong>${formatEUR(p.amount, "en")}</strong> is due by <strong>${due}</strong>.` : `Petit rappel : le solde de <strong>${formatEUR(p.amount)}</strong> est à régler au plus tard le <strong>${due}</strong>.`,
    overdue: en ? `We have not yet received the balance of <strong>${formatEUR(p.amount, "en")}</strong>, due today. Without payment within 7 days, the booking will be cancelled under our terms of sale.` : `Nous n'avons pas encore reçu le solde de <strong>${formatEUR(p.amount)}</strong>, dû aujourd'hui. Sans paiement dans les 7 jours, la réservation sera annulée, conformément à nos conditions générales de vente.`,
  }[reminder];
  return mail(
    b,
    en ? (reminder === "overdue" ? "Balance overdue: your stay at Villa Serena" : "Balance of your stay at Villa Serena") : reminder === "overdue" ? "Solde en attente : votre séjour à la Villa Serena" : "Solde de votre séjour à la Villa Serena",
    en ? "The balance of your stay" : "Le solde de votre séjour",
    [lead, stay(b), ...termsLine(b)],
    { label: en ? "Pay the balance" : "Régler le solde", url }
  );
}

export function linkExpiredMail(b: Booking) {
  const en = b.locale === "en";
  return mail(
    b,
    en ? "Your payment link has expired" : "Votre lien de paiement a expiré",
    en ? "The dates have been released" : "Les dates ont été libérées",
    [
      en ? "We did not receive the payment within 72 hours, so the dates have been released." : "Nous n'avons pas reçu le paiement dans les 72 heures : les dates ont donc été libérées.",
      en ? "If you still wish to stay with us, simply reply to this email and we will check availability again." : "Si vous souhaitez toujours séjourner chez nous, répondez simplement à cet e-mail et nous vérifierons à nouveau les disponibilités.",
    ]
  );
}

export function cancelledMail(b: Booking, refund: number) {
  const en = b.locale === "en";
  const byVilla = b.cancelledBy === "villa";
  return mail(
    b,
    en ? "Your booking at Villa Serena has been cancelled" : "Votre réservation à la Villa Serena est annulée",
    en ? "Booking cancelled" : "Réservation annulée",
    [
      stay(b),
      b.cancelReason ? esc(b.cancelReason) : "",
      refund > 0
        ? en ? `A refund of <strong>${formatEUR(refund, "en")}</strong> will be made within 30 days${byVilla ? "" : ", under article 7 of our terms of sale"}.` : `Un remboursement de <strong>${formatEUR(refund)}</strong> vous sera versé sous 30 jours${byVilla ? "" : ", conformément à l'article 7 de nos conditions générales de vente"}.`
        : "",
      en ? "For any question, simply reply to this email." : "Pour toute question, répondez simplement à cet e-mail.",
    ].filter(Boolean)
  );
}

export function arrivalReminderMail(b: Booking) {
  const en = b.locale === "en";
  return mail(
    b,
    en ? "See you soon at Villa Serena" : "À très bientôt à la Villa Serena",
    en ? "Your arrival" : "Votre arrivée",
    [
      stay(b),
      en ? "Check-in from 4 pm, check-out before 11 am. Please let us know your arrival time, and send us the identity details of each adult guest (passport or ID), as required in Morocco." : "Arrivée à partir de 16 h, départ avant 11 h. Merci de nous indiquer votre heure d'arrivée, et de prévoir la pièce d'identité de chaque hôte majeur (passeport ou carte d'identité), comme l'exige la réglementation marocaine.",
      en ? "Address: Ourika road, km 17, Sidi Bouzguia, Marrakech. Need a transfer from Marrakech airport? Just ask." : "Adresse : route de l'Ourika, km 17, Sidi Bouzguia, Marrakech. Besoin d'un transfert depuis l'aéroport de Marrakech ? Il suffit de nous le demander.",
      en ? "Phone and WhatsApp: +212 663 524 991." : "Téléphone et WhatsApp : +212 663 524 991.",
    ]
  );
}

/** Short alert for the villa team. */
export function adminAlertMail(to: string, subject: string, lines: string[], bookingId: string): Mail {
  const url = `${baseUrl()}/admin/demandes/${bookingId}`;
  return { to, subject, html: layout(false, subject, lines.map(esc), { label: "Ouvrir la réservation", url }), text: text(subject, lines, { label: "Ouvrir la réservation", url }) };
}
