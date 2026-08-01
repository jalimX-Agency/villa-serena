"use client";
import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
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

type Step = "room" | "details" | "done";

const STEP_ORDER: Step[] = ["room", "details", "done"];

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
  const isEn = locale === "en";
  const initialRoom = rooms.find((r) => r.slug === initialSlug);
  const [selectedId, setSelectedId] = useState<string | undefined>(initialRoom?.id);
  const [step, setStep] = useState<Step>(initialRoom ? "details" : "room");
  const selected = rooms.find((r) => r.id === selectedId);

  const steps: { key: Step; label: string }[] = [
    { key: "room", label: t("reservation.step_room") },
    { key: "details", label: t("reservation.step_details") },
    { key: "done", label: t("reservation.step_done") },
  ];
  const currentIndex = STEP_ORDER.indexOf(step);

  function selectRoom(room: RoomOption) {
    setSelectedId(room.id);
    setStep("details");
  }

  return (
    <div className="max-w-3xl mx-auto">
      <ol className="flex items-center justify-center mb-12">
        {steps.map((s, i) => {
          const isActive = i === currentIndex;
          const isComplete = i < currentIndex;
          return (
            <li key={s.key} className="flex items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "size-8 flex items-center justify-center rounded-full font-sans text-xs border transition-colors",
                    isComplete && "bg-villa-terracotta border-villa-terracotta text-white",
                    isActive && "border-villa-terracotta text-villa-terracotta",
                    !isActive && !isComplete && "border-border text-muted-foreground"
                  )}
                >
                  {isComplete ? <Check className="size-4" /> : i + 1}
                </div>
                <span
                  className={cn(
                    "font-sans text-[10px] tracking-[0.15em] uppercase whitespace-nowrap",
                    isActive || isComplete ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "h-px w-12 sm:w-24 mx-2 sm:mx-4 mb-5",
                    isComplete ? "bg-villa-terracotta" : "bg-border"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>

      {step === "room" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <button
              key={room.id}
              type="button"
              onClick={() => selectRoom(room)}
              className="text-left border border-border hover:border-villa-terracotta transition-colors group"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {room.image && (
                  <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-3">
                <p className="font-serif text-base text-foreground leading-tight mb-0.5">{room.name}</p>
                <p className="font-sans text-xs text-muted-foreground tabular-nums">
                  {room.price}€ / {t("suites.per_night")}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {step === "details" && selected && (
        <div>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              {selected.image && (
                <div className="relative size-12 overflow-hidden shrink-0">
                  <Image src={selected.image} alt={selected.name} fill className="object-cover" />
                </div>
              )}
              <div>
                <p className="font-serif text-lg text-foreground leading-tight">{selected.name}</p>
                <p className="font-sans text-xs text-muted-foreground tabular-nums">
                  {selected.price}€ / {t("suites.per_night")}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep("room")}
              className="font-sans text-[11px] tracking-wide uppercase text-villa-terracotta hover:underline shrink-0"
            >
              {isEn ? "Change suite" : "Changer de suite"}
            </button>
          </div>

          <RoomBookingForm
            key={selected.id}
            roomId={selected.id}
            pricePerNight={selected.price}
            bookedRanges={bookedRangesByRoom[selected.id] ?? []}
            locale={locale}
            onStatusChange={(status) => {
              if (status === "success") setStep("done");
            }}
          />
        </div>
      )}

      {step === "done" && (
        <div className="text-center py-16 border border-border">
          <p className="font-serif text-2xl text-foreground mb-2">✓</p>
          <p className="font-sans text-foreground/80">{t("contact.form_success")}</p>
        </div>
      )}
    </div>
  );
}
