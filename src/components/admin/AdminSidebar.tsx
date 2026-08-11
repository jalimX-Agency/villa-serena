"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/demandes", label: "Demandes" },
  { href: "/admin/chambres", label: "Chambres" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 bg-villa-ink text-white flex flex-col min-h-screen">
      <div className="px-6 py-6 border-b border-white/10">
        <p className="font-serif text-lg">Villa Serena</p>
        <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/50">Administration</p>
      </div>
      <nav className="flex-1 py-4">
        {NAV.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block px-6 py-2.5 font-sans text-sm transition-colors",
                active ? "bg-white/10 text-white border-l-2 border-villa-terracotta" : "text-white/60 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-4 border-t border-white/10">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="font-sans text-xs tracking-wide uppercase text-white/50 hover:text-white transition-colors"
        >
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
