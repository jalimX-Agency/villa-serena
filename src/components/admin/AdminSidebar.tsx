"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Inbox,
  BedDouble,
  Images,
  Settings,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { media } from "@/lib/media";

const NAV = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/demandes", label: "Demandes", icon: Inbox, badge: true },
  { href: "/admin/chambres", label: "Chambres", icon: BedDouble },
  { href: "/admin/galerie", label: "Galerie", icon: Images },
  { href: "/admin/connexions", label: "Connexions", icon: ShieldCheck },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

export function AdminSidebar({ pendingCount, userEmail }: { pendingCount: number; userEmail: string }) {
  const pathname = usePathname();
  // Drawer is tied to the path it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (v: boolean) => setOpenOn(v ? pathname : null);

  const nav = (
    <>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon, exact, badge }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className={cn("size-4 shrink-0", active ? "text-villa-gold" : "")} />
              <span className="flex-1">{label}</span>
              {badge && pendingCount > 0 && (
                <span className="rounded-full bg-villa-terracotta px-2 py-0.5 text-[10px] font-semibold text-white">
                  {pendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
        <a
          href="/fr"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="size-4" /> Voir le site
        </a>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="size-4" /> Se déconnecter
        </button>
        <p className="px-3 pt-3 text-[11px] text-white/30 truncate">{userEmail}</p>
      </div>
    </>
  );

  const brand = (
    <Link href="/admin" className="flex items-center gap-3">
      <Image src={media("/logo-white.png")} alt="Villa Serena" width={120} height={60} className="h-9 w-auto" />
      <span className="text-[10px] tracking-[0.2em] uppercase text-white/40">Admin</span>
    </Link>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-stone-950 text-white sticky top-0 h-screen">
        <div className="px-6 py-6 border-b border-white/10">{brand}</div>
        {nav}
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="lg:hidden fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between bg-stone-950 px-4">
        {brand}
        <button type="button" aria-label="Menu" onClick={() => setOpen(true)} className="text-white p-2 relative">
          <Menu className="size-5" />
          {pendingCount > 0 && <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-villa-terracotta" />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 flex flex-col bg-stone-950 text-white">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              {brand}
              <button type="button" aria-label="Fermer" onClick={() => setOpen(false)} className="p-1">
                <X className="size-5" />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
