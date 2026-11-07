"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Sticky in-page navigation for single pages split into anchored blocks (Services, Expériences). */
export function AnchorBar({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav className="sticky top-20 xl:top-[92px] z-30 bg-villa-cream/95 backdrop-blur border-y border-border">
      <ul className="mx-auto max-w-7xl px-6 lg:px-8 flex gap-1 overflow-x-auto [scrollbar-width:none]">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              className={cn(
                "block whitespace-nowrap px-4 py-4 font-sans text-[11px] tracking-[0.18em] uppercase transition-colors border-b-2",
                active === i.id ? "text-villa-terracotta border-villa-terracotta" : "text-muted-foreground border-transparent hover:text-villa-ink"
              )}
            >
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
