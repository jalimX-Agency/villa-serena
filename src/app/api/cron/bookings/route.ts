import { NextResponse } from "next/server";
import { runDailyJobs } from "@/lib/payments/service";

export const dynamic = "force-dynamic";

/**
 * Daily booking job (vercel.json: every day at 07:00 UTC, 08:00 in Marrakech).
 * Vercel sends "Authorization: Bearer <CRON_SECRET>"; anything else is refused.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const report = await runDailyJobs();
  console.log("[cron bookings]", report);
  return NextResponse.json({ ok: true, report });
}
