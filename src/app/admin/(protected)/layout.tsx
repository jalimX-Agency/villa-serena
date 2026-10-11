import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SessionProvider } from "@/components/admin/SessionProvider";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  const pendingCount = await db.booking.count({ where: { status: "pending" } }).catch(() => 0);

  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-stone-50 text-stone-900">
        <AdminSidebar pendingCount={pendingCount} userEmail={session.user?.email ?? ""} />
        <main className="flex-1 min-w-0 px-4 pt-20 pb-10 sm:px-6 lg:px-10 lg:pt-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </SessionProvider>
  );
}
