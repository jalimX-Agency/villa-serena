"use client";
import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const [activeIndex, setActiveIndex] = useState(0);
  const n = rooms.length;

  function go(delta: number) {
    setActiveIndex((i) => (i + delta + n) % n);
  }

  return (
    <div>
      <div className="relative h-[440px] sm:h-[560px] lg:h-[620px] overflow-hidden">
        {rooms.map((room, i) => {
          let diff = i - activeIndex;
          if (diff > n / 2) diff -= n;
          if (diff < -n / 2) diff += n;
          const abs = Math.abs(diff);
          const isCenter = diff === 0;
          const visible = abs <= 1;

          return (
            <Link
              key={room.id}
              href={`/suites/${room.slug}`}
              onClick={(e) => {
                if (!isCenter) {
                  e.preventDefault();
                  setActiveIndex(i);
                }
              }}
              className="absolute top-1/2 left-1/2 w-[220px] sm:w-[300px] lg:w-[340px] transition-all duration-500 ease-out"
              style={{
                transform: `translate(-50%, -50%) translateX(${diff * 58}%) scale(${isCenter ? 1 : 0.82})`,
                opacity: visible ? (isCenter ? 1 : 0.4) : 0,
                zIndex: isCenter ? 10 : 5 - abs,
                pointerEvents: visible ? "auto" : "none",
              }}
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-4 shadow-xl">
                {room.image && (
                  <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    sizes="(max-width: 640px) 220px, (max-width: 1024px) 300px, 340px"
                    className="object-cover"
                    priority={isCenter}
                  />
                )}
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-foreground mb-1">{room.name}</h3>
              <p className="font-sans text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">
                {room.subtitle}
              </p>
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

      <div className="flex items-center justify-center gap-6 mt-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous"
          className="size-10 flex items-center justify-center border border-border hover:border-villa-terracotta hover:text-villa-terracotta text-foreground transition-colors"
        >
          <ChevronLeft className="size-4" />
        </button>

        <div className="flex items-center gap-2">
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

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next"
          className="size-10 flex items-center justify-center border border-border hover:border-villa-terracotta hover:text-villa-terracotta text-foreground transition-colors"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
