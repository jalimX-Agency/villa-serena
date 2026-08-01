"use client";
import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { RoomBookingForm } from "@/components/RoomBookingForm";
import { type BookedRange } from "@/components/DateRangePicker";
import { cn } from "@/lib/utils";

export type RoomOption = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
};

export function ReservationClient({
  rooms,
  bookedRangesByRoom,
  locale,
  initialSlug,
}: {
  rooms: RoomOption[];
  bookedRangesByRoom: Record<string, BookedRange[]>;
  locale: string;
  initialSlug?: string;
}) {
  const t = useTranslations();
  const initial = rooms.find((r) => r.slug === initialSlug) ?? rooms[0];
  const [selectedId, setSelectedId] = useState<string | undefined>(initial?.id);
  const selected = rooms.find((r) => r.id === selectedId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
      <div className="lg:col-span-2">
        <h2 className="font-sans text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-5">
          {t("reservation.choose_room")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
          {rooms.map((room) => {
            const active = room.id === selectedId;
            return (
              <button
                key={room.id}
                type="button"
                onClick={() => setSelectedId(room.id)}
                className={cn(
                  "text-left border transition-colors",
                  active ? "border-villa-terracotta" : "border-border hover:border-foreground/30"
                )}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {room.image && (
                    <Image
                      src={room.image}
                      alt={room.name}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  )}
                  {active && (
                    <div className="absolute inset-0 bg-villa-terracotta/15 border-2 border-villa-terracotta" />
                  )}
                </div>
                <div className="p-3">
                  <p className="font-serif text-base text-foreground leading-tight mb-0.5">{room.name}</p>
                  <p className="font-sans text-xs text-muted-foreground tabular-nums">{room.price}€ / {t("suites.per_night")}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-3">
        <h2 className="font-sans text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-5">
          {t("reservation.your_dates")}
        </h2>
        {selected && (
          <RoomBookingForm
            key={selected.id}
            roomId={selected.id}
            pricePerNight={selected.price}
            bookedRanges={bookedRangesByRoom[selected.id] ?? []}
            locale={locale}
          />
        )}
      </div>
    </div>
  );
}
