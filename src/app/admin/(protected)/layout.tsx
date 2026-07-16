import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "@/components/admin/SessionProvider";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </SessionProvider>
  );
}
