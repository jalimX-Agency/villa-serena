import { cn } from "@/lib/utils";

/* Shared building blocks for the admin. Neutral surfaces, brand terracotta for actions. */

export const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  cancelled: "Annulée",
};

export const SERVICE_LABELS: Record<string, string> = {
  villa: "Séjour villa",
  room: "Chambre (ancien)",
  general: "Contact",
  golf: "Golf",
  "retraites-yoga": "Retraite & yoga",
  "mariages-events": "Mariage & événement",
  restauration: "Restauration",
  "bien-etre": "Bien-être",
  excursions: "Excursions",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-stone-100 text-stone-500 ring-stone-200",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset whitespace-nowrap",
        STATUS_STYLES[status] ?? STATUS_STYLES.pending
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8">
      <div>
        <h1 className="font-serif text-3xl text-stone-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-stone-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-2xl bg-white ring-1 ring-stone-200/80 shadow-sm", className)}>{children}</div>;
}

export function CardHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-stone-100">
      <h2 className="text-sm font-semibold text-stone-800">{title}</h2>
      {action}
    </div>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="px-5 py-10 text-center text-sm text-stone-400">{children}</p>;
}

export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-villa-terracotta px-4 py-2 text-sm font-medium text-white shadow-sm hover:brightness-95 disabled:opacity-50 transition",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-stone-700 ring-1 ring-stone-200 hover:bg-stone-50 disabled:opacity-50 transition",
  danger:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-red-600 ring-1 ring-red-200 hover:bg-red-50 disabled:opacity-50 transition",
};

export const field =
  "w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-stone-900 ring-1 ring-stone-200 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-villa-terracotta/60";

export const labelCls = "block text-xs font-medium text-stone-600 mb-1.5";

export function formatDate(d: Date | null | undefined, opts: Intl.DateTimeFormatOptions = {}) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric", ...opts }).format(d);
}

export function nightsBetween(a: Date | null, b: Date | null) {
  if (!a || !b) return 0;
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86_400_000));
}
