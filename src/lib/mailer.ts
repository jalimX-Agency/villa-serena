import { Resend } from "resend";
import { db } from "@/lib/db";

/**
 * Transactional email. Sends through Resend when RESEND_API_KEY and MAIL_FROM are set; until the
 * domain is configured it only records the email in the booking timeline (nothing is lost: the
 * admin sees what would have been sent and can copy the payment link by hand).
 */
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.MAIL_FROM ?? ""; // e.g. "Villa Serena <reservation@villaserenamarrakech.com>"
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "guest@villaserenamarrakech.com";

export type Mail = { to: string; subject: string; html: string; text: string; replyTo?: string };

export async function sendMail(mail: Mail, bookingId?: string): Promise<{ sent: boolean }> {
  let sent = false;
  let error = "";
  if (resend && FROM) {
    try {
      const res = await resend.emails.send({ from: FROM, to: mail.to, subject: mail.subject, html: mail.html, text: mail.text, replyTo: mail.replyTo ?? ADMIN_EMAIL });
      if (res.error) error = res.error.message;
      else sent = true;
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
  }
  if (bookingId) {
    await db.bookingEvent.create({
      data: {
        bookingId,
        type: sent ? "email_sent" : "email_not_sent",
        message: `${mail.subject} → ${mail.to}${error ? ` (erreur : ${error})` : sent ? "" : " (envoi des e-mails pas encore configuré)"}`,
      },
    });
  }
  if (!sent) console.log(`[mail${error ? " error" : " not configured"}] ${mail.subject} → ${mail.to}`);
  return { sent };
}

export async function logEvent(bookingId: string, type: string, message: string) {
  await db.bookingEvent.create({ data: { bookingId, type, message } });
}
