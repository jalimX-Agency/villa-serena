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

  const prevIndex = (activeIndex - 1 + n) % n;
  const nextIndex = (activeIndex + 1) % n;

  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-8">
      <div className="flex items-center justify-center gap-3 sm:gap-6 lg:gap-10">
        <SideCard room={rooms[prevIndex]} onClick={() => setActiveIndex(prevIndex)} />

        <Link href={`/suites/${rooms[activeIndex].slug}`} className="shrink-0 w-[220px] sm:w-[320px] lg:w-[400px]">
          <div className="relative aspect-[3/4] overflow-hidden mb-5 shadow-xl">
            {rooms[activeIndex].image && (
              <Image
                key={rooms[activeIndex].id}
                src={rooms[activeIndex].image}
                alt={rooms[activeIndex].name}
                fill
                sizes="(max-width: 640px) 220px, (max-width: 1024px) 320px, 400px"
                className="object-cover"
                priority
              />
            )}
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-foreground mb-1">{rooms[activeIndex].name}</h3>
          <p className="font-sans text-sm text-muted-foreground mb-4 leading-relaxed">
            {rooms[activeIndex].subtitle}
          </p>
          <div className="flex items-center justify-between font-sans text-xs text-foreground/70 border-t border-border pt-3">
            <span>{rooms[activeIndex].size}</span>
            <span>{rooms[activeIndex].bedType}</span>
          </div>
          <p className="font-sans text-sm text-villa-terracotta mt-2 tabular-nums">
            {fromLabel} {rooms[activeIndex].price}€ / {perNightLabel}
          </p>
        </Link>

        <SideCard room={rooms[nextIndex]} onClick={() => setActiveIndex(nextIndex)} />
      </div>

      <div className="flex items-center justify-center gap-6 mt-8">
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

function SideCard({ room, onClick }: { room: CompareSuite; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={room.name}
      className="shrink-0 hidden sm:block w-[130px] lg:w-[180px] opacity-45 hover:opacity-70 transition-opacity"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        {room.image && (
          <Image
            key={room.id}
            src={room.image}
            alt={room.name}
            fill
            sizes="(max-width: 1024px) 130px, 180px"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-villa-ink/70 via-transparent to-transparent" />
        <p className="absolute bottom-3 left-0 right-0 px-2 font-serif text-sm text-white text-center">
          {room.name}
        </p>
      </div>
    </button>
  );
}
