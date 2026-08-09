"use client";
import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type SuiteOption = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
  color: string;
  mood: string;
};

export function SuitesMoodGrid({
  rooms,
  fromLabel,
  perNightLabel,
  hint,
}: {
  rooms: SuiteOption[];
  fromLabel: string;
  perNightLabel: string;
  hint: string;
}) {
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const active = rooms.find((r) => r.id === activeId);

  return (
    <div>
      <div className="relative h-40 lg:h-52 flex items-center justify-center overflow-hidden mb-14 border border-border">
        <div
          className="absolute inset-0 transition-colors duration-700 ease-out"
          style={{ backgroundColor: active?.color ?? "transparent", opacity: active ? 0.1 : 0 }}
          aria-hidden
        />
        {rooms.map((r) => (
          <span
            key={r.id}
            className={cn(
              "absolute font-serif text-4xl sm:text-5xl lg:text-7xl tracking-tight transition-all duration-500 ease-out",
              r.id === activeId ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            )}
            style={{ color: r.color }}
          >
            {r.mood}
          </span>
        ))}
        <span
          className={cn(
            "font-sans text-[11px] tracking-[0.2em] uppercase text-muted-foreground transition-opacity duration-300",
            activeId ? "opacity-0" : "opacity-100"
          )}
        >
          {hint}
        </span>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12"
        onMouseLeave={() => setActiveId(undefined)}
      >
        {rooms.map((room, i) => (
          <Link
            key={room.id}
            href={`/suites/${room.slug}`}
            className="group block"
            onMouseEnter={() => setActiveId(room.id)}
            onFocus={() => setActiveId(room.id)}
            onBlur={() => setActiveId(undefined)}
          >
            <div className="relative aspect-[4/5] overflow-hidden mb-4">
              {room.image && (
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority={i === 0}
                />
              )}
              <span
                className="absolute top-4 left-4 size-2.5 rounded-full border border-white/70"
                style={{ backgroundColor: room.color || undefined }}
                aria-hidden
              />
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{ backgroundColor: room.color, opacity: room.id === activeId ? 0.12 : 0 }}
                aria-hidden
              />
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <h3 className="font-serif text-xl text-foreground group-hover:text-villa-terracotta transition-colors">
                  {room.name}
                </h3>
                <p className="font-sans text-xs text-muted-foreground mt-0.5">{room.subtitle}</p>
              </div>
              <p className="font-sans text-sm text-villa-terracotta whitespace-nowrap tabular-nums">
                {fromLabel} {room.price}€
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
