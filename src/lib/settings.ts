import { db } from "@/lib/db";

export type BankDetails = { holder: string; bank: string; iban: string; swift: string; rib: string };

/** Bank details for transfers (edited in /admin/paiements). Empty strings until filled. */
export async function getBankDetails(): Promise<BankDetails> {
  const rows = await db.setting.findMany({ where: { key: { startsWith: "bank_" } } }).catch(() => []);
  const v = (k: string) => rows.find((r) => r.key === k)?.value ?? "";
  return { holder: v("bank_holder"), bank: v("bank_name"), iban: v("bank_iban"), swift: v("bank_swift"), rib: v("bank_rib") };
}

export const hasBankDetails = (b: BankDetails) => Boolean(b.holder && (b.iban || b.rib));
