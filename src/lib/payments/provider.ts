import type { Booking, Payment } from "@prisma/client";

/**
 * Online payment provider (V4 ch. 19). The module is provider-independent: PayPal Business or the
 * CMI (via CFG Bank) plugs in here, the booking flow does not change. Card data never touches the
 * site: the guest pays on the provider's hosted page (3-D Secure), and the provider notifies us.
 */
export type CheckoutStart =
  | { type: "redirect"; url: string }
  /** The CMI posts a signed HTML form to its payment page. */
  | { type: "form"; action: string; fields: Record<string, string> };

export interface PaymentProvider {
  id: "paypal" | "cmi";
  label: string;
  /** Start the hosted payment for one Payment row. */
  startCheckout(input: { payment: Payment; booking: Booking; returnUrl: string; cancelUrl: string; locale: string }): Promise<CheckoutStart>;
  /** Check a notification (webhook / callback) and return the payment it confirms. Throws if the signature is wrong. */
  verifyNotification(req: Request): Promise<{ paymentId: string; providerRef: string; paid: boolean }>;
  /** Refund all or part of a paid payment. */
  refund?(payment: Payment, amount: number): Promise<{ providerRef: string }>;
  /** Card hold for the 1 500 € deposit, and its release or capture. */
  authorizeHold?(booking: Booking, amount: number): Promise<{ providerRef: string }>;
  releaseHold?(providerRef: string): Promise<void>;
  captureHold?(providerRef: string, amount: number): Promise<void>;
}

/**
 * The provider in use, from PAYMENT_PROVIDER ("paypal" | "cmi"), or null while none is set up:
 * the payment page then offers bank transfer, and the admin records payments by hand.
 */
export function getPaymentProvider(): PaymentProvider | null {
  const id = process.env.PAYMENT_PROVIDER;
  if (!id) return null;
  // Adapters are added when the villa's account is open (CFG Bank's answer pending).
  console.warn(`[payments] PAYMENT_PROVIDER="${id}" is set but no adapter is installed yet.`);
  return null;
}
