// End-to-end check of the payment flow on throw-away bookings (deleted at the end).
// npx tsx scripts/test-payments.ts  — sends no email unless MAIL_FROM is set.
import "dotenv/config";
import { db } from "../src/lib/db";
import { cancelBooking, markPaymentPaid, paidSoFar, runDailyJobs, sendFirstPaymentLink } from "../src/lib/payments/service";

const DAY = 86_400_000;
const ok = (cond: boolean, label: string) => {
  console.log(`${cond ? "✓" : "✗"} ${label}`);
  if (!cond) process.exitCode = 1;
};

async function makeBooking(daysAhead: number, total: number) {
  const checkIn = new Date(Date.UTC(2027, 0, 1) );
  checkIn.setTime(Date.now() + daysAhead * DAY);
  checkIn.setUTCHours(0, 0, 0, 0);
  return db.booking.create({
    data: {
      firstName: "TEST", lastName: "Paiement (à supprimer)", email: "test@example.invalid", serviceType: "villa",
      checkIn, checkOut: new Date(checkIn.getTime() + 5 * DAY), guests: 6, totalAmount: total, locale: "fr",
    },
  });
}

const ids: string[] = [];
(async () => {
  // The daily job runs over the whole database with simulated dates: never on real bookings.
  const real = await db.booking.count({ where: { email: { not: "test@example.invalid" }, status: { in: ["confirmed", "deposit_paid", "paid"] } } });
  if (real > 0) {
    console.log(`Stopped: ${real} real booking(s) in progress. Run this test on a copy of the database.`);
    await db.$disconnect();
    return;
  }
  try {
    // A. Full path: deposit, balance link at D-37, reminders, balance, arrival, completed.
    const a = await makeBooking(60, 4000);
    ids.push(a.id);
    const dep = await sendFirstPaymentLink(a.id);
    ok(dep.kind === "deposit" && dep.amount === 2000 && !!dep.token, "A: deposit link of 2 000 € (50 %)");
    ok((await db.booking.findUnique({ where: { id: a.id } }))!.status === "confirmed", "A: booking confirmed, waiting for deposit");
    await markPaymentPaid(dep.id, { method: "transfer", note: "test" });
    ok((await db.booking.findUnique({ where: { id: a.id } }))!.status === "deposit_paid", "A: deposit paid");
    const ci = a.checkIn!.getTime();
    let r = await runDailyJobs(new Date(ci - 37 * DAY));
    const bal = await db.payment.findFirst({ where: { bookingId: a.id, kind: "balance", status: "pending" } });
    ok(r.balanceLinks >= 1 && bal?.amount === 2000, "A: balance link of 2 000 € at D-37");
    r = await runDailyJobs(new Date(ci - 37 * DAY));
    ok((await db.payment.count({ where: { bookingId: a.id, kind: "balance" } })) === 1, "A: running the job twice does not duplicate");
    r = await runDailyJobs(new Date(ci - 32 * DAY));
    ok(!!(await db.booking.findUnique({ where: { id: a.id } }))!.balanceReminderAt, "A: reminder at D-32");
    await markPaymentPaid(bal!.id, { method: "transfer" });
    ok((await db.booking.findUnique({ where: { id: a.id } }))!.status === "paid", "A: balance paid, booking fully paid");
    r = await runDailyJobs(new Date(ci - 2 * DAY));
    ok(!!(await db.booking.findUnique({ where: { id: a.id } }))!.arrivalReminderAt, "A: arrival reminder at D-3");
    r = await runDailyJobs(new Date(ci + 6 * DAY));
    ok((await db.booking.findUnique({ where: { id: a.id } }))!.status === "completed", "A: stay completed after check-out");

    // B. Late booking (< 30 days): full payment at once.
    const b = await makeBooking(20, 3000);
    ids.push(b.id);
    const full = await sendFirstPaymentLink(b.id);
    ok(full.kind === "full" && full.amount === 3000, "B: arriving within 30 days, full payment of 3 000 €");

    // C. Deposit link not paid in 72 h: expired, dates released.
    const c = await makeBooking(100, 5000);
    ids.push(c.id);
    await sendFirstPaymentLink(c.id);
    r = await runDailyJobs(new Date(Date.now() + 73 * 3_600_000));
    ok((await db.booking.findUnique({ where: { id: c.id } }))!.status === "expired", "C: link expired after 72 h, booking expired");

    // D. Cancellation by the client 70 days ahead: 70 % of the deposit refunded.
    const d = await makeBooking(70, 4000);
    ids.push(d.id);
    const dd = await sendFirstPaymentLink(d.id);
    await markPaymentPaid(dd.id, { method: "transfer" });
    const { refund } = await cancelBooking(d.id, "client", "Test", false);
    ok(refund === 1400, `D: client cancels at D-70, refund 1 400 € (70 % of 2 000) — got ${refund}`);
    const dPays = await db.payment.findMany({ where: { bookingId: d.id } });
    ok(paidSoFar(dPays) === 2000 && dPays.some((p) => p.kind === "refund" && p.status === "pending"), "D: refund recorded as to be made");

    // E. Unpaid balance: cancelled by the client at D-23.
    const e = await makeBooking(50, 4000);
    ids.push(e.id);
    const ed = await sendFirstPaymentLink(e.id);
    await markPaymentPaid(ed.id, { method: "transfer" });
    const ei = e.checkIn!.getTime();
    await runDailyJobs(new Date(ei - 37 * DAY));
    await runDailyJobs(new Date(ei - 30 * DAY));
    ok(!!(await db.booking.findUnique({ where: { id: e.id } }))!.balanceAlertAt, "E: overdue alert at D-30");
    await runDailyJobs(new Date(ei - 23 * DAY));
    const eb = await db.booking.findUnique({ where: { id: e.id } });
    ok(eb!.status === "cancelled" && eb!.cancelledBy === "client", "E: unpaid balance, cancelled by the client at D-23");

    const events = await db.bookingEvent.count({ where: { bookingId: { in: ids } } });
    ok(events > 10, `timeline recorded (${events} events)`);
  } finally {
    await db.booking.deleteMany({ where: { id: { in: ids } } });
    const left = await db.booking.count({ where: { email: "test@example.invalid" } });
    console.log(left === 0 ? "test bookings deleted" : `!! ${left} test bookings left`);
    await db.$disconnect();
  }
})();
