import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD env vars before running.");
    process.exit(1);
  }
  const hash = await bcrypt.hash(password, 12);
  await db.user.upsert({
    where: { email },
    update: { password: hash },
    create: { email, password: hash, name: "Admin", role: "admin" },
  });
  console.log(`Admin user ready: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
