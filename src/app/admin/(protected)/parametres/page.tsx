import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PasswordForm } from "@/components/admin/PasswordForm";
import { Card, CardHeader, PageHeader } from "@/components/admin/ui";

export default async function AdminParametresPage() {
  const session = await getServerSession(authOptions);
  return (
    <div className="max-w-2xl">
      <PageHeader title="Paramètres" />
      <div className="space-y-6">
        <Card>
          <CardHeader title="Compte" />
          <div className="px-5 py-4 text-sm">
            <p className="text-stone-500">Connecté en tant que</p>
            <p className="font-medium text-stone-900">{session?.user?.email}</p>
          </div>
        </Card>
        <Card>
          <CardHeader title="Changer le mot de passe" />
          <PasswordForm />
        </Card>
      </div>
    </div>
  );
}
