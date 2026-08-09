"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
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
  fromLabel,
  perNightLabel,
}: {
  rooms: CompareSuite[];
  fromLabel: string;
  perNightLabel: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    const containerCenter = el.scrollLeft + el.clientWidth / 2;
    let closest = 0;
    let closestDist = Infinity;
    children.forEach((child, i) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const dist = Math.abs(childCenter - containerCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    setActiveIndex(closest);
  }

  function scrollToIndex(i: number) {
    const el = scrollRef.current;
    const child = el?.children[i] as HTMLElement | undefined;
    if (el && child) {
      el.scrollTo({ left: child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2, behavior: "smooth" });
    }
  }

  return (
    <div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 px-[calc(50vw-120px)] sm:px-[calc(50vw-140px)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {rooms.map((room, i) => {
          const active = i === activeIndex;
          return (
            <Link
              key={room.id}
              href={`/suites/${room.slug}`}
              className={cn(
                "snap-center shrink-0 w-[240px] sm:w-[280px] transition-all duration-500 ease-out",
                active ? "scale-100 opacity-100" : "scale-[0.9] opacity-50"
              )}
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-4">
                {room.image && (
                  <Image src={room.image} alt={room.name} fill sizes="280px" className="object-cover" />
                )}
              </div>
              <h3 className="font-serif text-lg text-foreground mb-1">{room.name}</h3>
              <p className="font-sans text-xs text-muted-foreground mb-3 leading-relaxed">{room.subtitle}</p>
              <div className="flex items-center justify-between font-sans text-xs text-foreground/70 border-t border-border pt-3">
                <span>{room.size}</span>
                <span>{room.bedType}</span>
              </div>
              <p className="font-sans text-sm text-villa-terracotta mt-2 tabular-nums">
                {fromLabel} {room.price}€ / {perNightLabel}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2 mt-2">
        {rooms.map((room, i) => (
          <button
            key={room.id}
            type="button"
            onClick={() => scrollToIndex(i)}
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
