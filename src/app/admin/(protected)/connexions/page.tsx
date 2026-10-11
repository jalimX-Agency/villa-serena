import { Monitor, Smartphone, Tablet, MapPin, ShieldAlert, ShieldCheck } from "lucide-react";
import { db } from "@/lib/db";
import { Card, EmptyState, PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

const DEVICE_ICON = { Mobile: Smartphone, Tablette: Tablet } as Record<string, typeof Monitor>;

const when = (d: Date) =>
  new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Casablanca",
  }).format(d);

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);

function countryName(code: string) {
  if (!code) return "";
  try {
    return new Intl.DisplayNames(["fr"], { type: "region" }).of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

export default async function AdminConnexionsPage() {
  const since = daysAgo(30);
  const [logs, failed30] = await Promise.all([
    db.loginLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    db.loginLog.count({ where: { success: false, createdAt: { gte: since } } }),
  ]);

  return (
    <div>
      <PageHeader
        title="Connexions"
        description="Historique des connexions à l'administration : date, appareil, adresse IP et localisation."
      />

      {failed30 > 0 && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
          <ShieldAlert className="size-4 shrink-0" />
          {failed30} tentative{failed30 > 1 ? "s" : ""} échouée{failed30 > 1 ? "s" : ""} sur les 30 derniers jours.
        </div>
      )}

      <Card className="overflow-hidden">
        {logs.length === 0 ? (
          <EmptyState>Aucune connexion enregistrée pour le moment.</EmptyState>
        ) : (
          <ul className="divide-y divide-stone-100">
            {logs.map((l) => {
              const Icon = DEVICE_ICON[l.device] ?? Monitor;
              const place = [l.city, countryName(l.country)].filter(Boolean).join(", ");
              return (
                <li key={l.id} className="flex items-center gap-4 px-5 py-3.5">
                  <span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${l.success ? "bg-stone-100 text-stone-600" : "bg-red-50 text-red-600"}`}>
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1 grid gap-0.5 md:grid-cols-[1.3fr_1fr_1.2fr] md:items-center md:gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-stone-900">{l.email}</p>
                      <p className="text-xs text-stone-500">{when(l.createdAt)}</p>
                    </div>
                    <p className="text-sm text-stone-600">
                      {[l.device, l.browser, l.os].filter(Boolean).join(" · ") || "Appareil inconnu"}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-stone-500 md:text-sm">
                      <MapPin className="size-3.5 shrink-0 text-stone-400" />
                      <span className="truncate">
                        {place || "Localisation indisponible"}
                        {l.ip && <span className="text-stone-400"> · {l.ip}</span>}
                      </span>
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${
                      l.success ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-red-50 text-red-700 ring-red-200"
                    }`}
                  >
                    {l.success ? <ShieldCheck className="size-3" /> : <ShieldAlert className="size-3" />}
                    {l.success ? "Réussie" : "Échouée"}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
      <p className="mt-3 text-xs text-stone-400">Les 200 connexions les plus récentes sont affichées. Heure de Marrakech.</p>
    </div>
  );
}
