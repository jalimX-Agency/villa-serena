"use client";
import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight, Maximize2, BedDouble } from "lucide-react";
import { cn } from "@/lib/utils";

export type CompareSuite = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
  size: string;
  bedType: string;
};

export function SuiteCompareStrip({
  rooms,
  perNightLabel,
  reserveLabel,
}: {
  rooms: CompareSuite[];
  perNightLabel: string;
  reserveLabel: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const n = rooms.length;

  function go(delta: number) {
    setActiveIndex((i) => (i + delta + n) % n);
  }

  const prevIndex = (activeIndex - 1 + n) % n;
  const nextIndex = (activeIndex + 1) % n;

  return (
    <div>
      <div className="relative overflow-hidden py-6">
        <div className="flex items-center justify-center gap-4 sm:gap-6 lg:gap-10">
          <button
            type="button"
            onClick={() => setActiveIndex(prevIndex)}
            aria-label={rooms[prevIndex].name}
            className="hidden sm:block shrink-0 w-[190px] lg:w-[250px]"
          >
            <SuiteCardVisual room={rooms[prevIndex]} perNightLabel={perNightLabel} reserveLabel={reserveLabel} active={false} />
          </button>

          <Link
            href={`/suites/${rooms[activeIndex].slug}`}
            className="shrink-0 w-[260px] sm:w-[400px] lg:w-[500px]"
          >
            <SuiteCardVisual room={rooms[activeIndex]} perNightLabel={perNightLabel} reserveLabel={reserveLabel} active />
          </Link>

          <button
            type="button"
            onClick={() => setActiveIndex(nextIndex)}
            aria-label={rooms[nextIndex].name}
            className="hidden sm:block shrink-0 w-[190px] lg:w-[250px]"
          >
            <SuiteCardVisual room={rooms[nextIndex]} perNightLabel={perNightLabel} reserveLabel={reserveLabel} active={false} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous"
          className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 size-11 sm:size-12 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-foreground hover:border-villa-terracotta hover:text-villa-terracotta transition-colors"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next"
          className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 size-11 sm:size-12 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-foreground hover:border-villa-terracotta hover:text-villa-terracotta transition-colors"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 mt-6">
        {rooms.map((room, i) => (
          <button
            key={room.id}
            type="button"
            onClick={() => setActiveIndex(i)}
            aria-label={room.name}
            className={cn(
              "size-1.5 rounded-full transition-colors",
              i === activeIndex ? "bg-villa-terracotta" : "bg-border"
            )}
          />
        ))}
      </div>
    </div>
  );
}

function SuiteCardVisual({
  room,
  perNightLabel,
  reserveLabel,
  active,
}: {
  room: CompareSuite;
  perNightLabel: string;
  reserveLabel: string;
  active: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-card rounded-lg overflow-hidden shadow-[0_8px_30px_rgba(30,20,10,0.1)] transition-all duration-500 ease-out",
        active ? "scale-100 opacity-100" : "scale-[0.92] opacity-50"
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        {room.image && (
          <Image
            src={room.image}
            alt={room.name}
            fill
            sizes="(max-width: 640px) 260px, (max-width: 1024px) 400px, 500px"
            className="object-cover"
            priority={active}
          />
        )}
      </div>

      <div className={cn(active ? "p-5 sm:p-7" : "p-4")}>
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className={cn("font-serif text-foreground leading-snug", active ? "text-xl sm:text-2xl" : "text-sm")}>
            {room.name}
          </h3>
          {active && (
            <span className="font-sans text-sm text-muted-foreground whitespace-nowrap shrink-0 tabular-nums">
              <span className="text-villa-terracotta font-medium">{room.price}€</span> /{perNightLabel}
            </span>
          )}
        </div>

        {active && (
          <>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-4">{room.subtitle}</p>

            <div className="grid grid-cols-2 gap-4 py-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Maximize2 className="size-4 text-muted-foreground shrink-0" />
                <span className="font-sans text-sm text-foreground/80">{room.size}</span>
              </div>
              <div className="flex items-center gap-2">
                <BedDouble className="size-4 text-muted-foreground shrink-0" />
                <span className="font-sans text-sm text-foreground/80">{room.bedType}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <span className="inline-flex items-center px-6 py-2.5 bg-villa-terracotta text-white font-sans text-xs tracking-[0.15em] uppercase">
                {reserveLabel}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
