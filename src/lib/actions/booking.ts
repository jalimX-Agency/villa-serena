"use server";
import { db } from "@/lib/db";

export type QuoteFormState = {
  status: "idle" | "success" | "error";
  error?: string;
};

export async function submitQuoteRequest(
  serviceType: string,
  _prevState: QuoteFormState,
  formData: FormData
): Promise<QuoteFormState> {
  const firstName = String(formData.get("firstName") || "").trim();
  const lastName = String(formData.get("lastName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const guestsRaw = String(formData.get("guests") || "");
  const guests = Number.parseInt(guestsRaw, 10) || 2;
  const message = String(formData.get("message") || "").trim();

  if (!firstName || !lastName || !email) {
    return { status: "error", error: "missing_fields" };
  }

  await db.booking.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      serviceType,
      guests,
      message,
      status: "pending",
    },
  });

  // TODO Phase 10: notify via Resend once RESEND_API_KEY exists.
  console.log(`New ${serviceType} quote request from ${email}`);

  return { status: "success" };
}
