"use server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export type PasswordState = { status: "idle" | "success" | "error"; error?: string };

export async function changePassword(_prev: PasswordState, formData: FormData): Promise<PasswordState> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) throw new Error("Unauthorized");

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (next.length < 10) return { status: "error", error: "Le nouveau mot de passe doit contenir au moins 10 caractères." };
  if (next !== confirm) return { status: "error", error: "Les deux mots de passe ne correspondent pas." };

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(current, user.password))) {
    return { status: "error", error: "Mot de passe actuel incorrect." };
  }

  await db.user.update({ where: { id: user.id }, data: { password: await bcrypt.hash(next, 12) } });
  return { status: "success" };
}
