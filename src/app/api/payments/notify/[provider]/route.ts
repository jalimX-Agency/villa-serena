import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments/provider";
import { markPaymentPaid } from "@/lib/payments/service";

export const dynamic = "force-dynamic";

/**
 * Payment notification from the provider (PayPal webhook / CMI callback). The signature is checked
 * by the adapter before anything changes; a booking only moves on a verified notification.
 */
export async function POST(req: Request, { params }: { params: Promise<{ provider: string }> }) {
  const { provider: id } = await params;
  const provider = getPaymentProvider();
  if (!provider || provider.id !== id) return NextResponse.json({ error: "not found" }, { status: 404 });
  try {
    const n = await provider.verifyNotification(req);
    if (n.paid) await markPaymentPaid(n.paymentId, { method: provider.id, provider: provider.id, providerRef: n.providerRef });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[payment notify]", e);
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
}
