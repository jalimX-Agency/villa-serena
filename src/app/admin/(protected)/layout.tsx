import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "@/components/admin/SessionProvider";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-villa-cream">
        <AdminSidebar />
        <main className="flex-1 p-8 lg:p-10 overflow-auto">{children}</main>
      </div>
    </SessionProvider>
  );
}
