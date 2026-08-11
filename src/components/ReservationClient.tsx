"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { differenceInCalendarDays } from "date-fns";
import { VillaEnquiryForm } from "@/components/VillaEnquiryForm";
import { DateRangePicker, type BookedRange } from "@/components/DateRangePicker";
import { cn } from "@/lib/utils";

type Step = "dates" | "details" | "done";

const STEP_ORDER: Step[] = ["dates", "details", "done"];

export function ReservationClient({
  bookedRanges,
  locale,
}: {
  bookedRanges: BookedRange[];
  locale: string;
}) {
  const t = useTranslations();
  const isEn = locale === "en";
  const [step, setStep] = useState<Step>("dates");
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const steps: { key: Step; label: string }[] = [
    { key: "dates", label: t("reservation.step_dates") },
    { key: "details", label: t("reservation.step_details") },
    { key: "done", label: t("reservation.step_done") },
  ];
  const currentIndex = STEP_ORDER.indexOf(step);
  const nights = checkIn && checkOut ? differenceInCalendarDays(checkOut, checkIn) : 0;

  return (
    <div className="max-w-2xl mx-auto">
      <ol className="flex items-center justify-center mb-10">
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
                    "h-px w-16 sm:w-32 mx-2 sm:mx-4 mb-5",
                    isComplete ? "bg-villa-terracotta" : "bg-border"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>

      <div className="mb-8 text-center">
        <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-villa-terracotta mb-2">
          {t("reservation.villa_label")}
        </p>
        <p className="font-serif text-xl sm:text-2xl text-foreground">{t("reservation.villa_summary")}</p>
      </div>

      {step === "dates" && (
        <div className="bg-card border border-border p-6 sm:p-8 space-y-5">
          <DateRangePicker
            bookedRanges={bookedRanges}
            locale={locale}
            checkIn={checkIn}
            checkOut={checkOut}
            onChange={(ci, co) => {
              setCheckIn(ci);
              setCheckOut(co);
            }}
          />

          {nights > 0 && (
            <p className="font-sans text-sm text-muted-foreground border-t border-border pt-4">
              {nights} {isEn ? (nights > 1 ? "nights" : "night") : nights > 1 ? "nuits" : "nuit"}
            </p>
          )}

          <button
            type="button"
            disabled={nights === 0}
            onClick={() => setStep("details")}
            className="w-full px-6 py-3.5 bg-villa-terracotta hover:bg-villa-terracotta/90 disabled:opacity-50 text-white font-sans text-xs tracking-[0.15em] uppercase transition-colors"
          >
            {t("reservation.continue")}
          </button>
        </div>
      )}

      {step === "details" && checkIn && checkOut && (
        <VillaEnquiryForm
          checkIn={checkIn}
          checkOut={checkOut}
          locale={locale}
          onBack={() => setStep("dates")}
          onStatusChange={(status) => {
            if (status === "success") setStep("done");
          }}
        />
      )}

      {step === "done" && (
        <div className="bg-card border border-border p-8 text-center">
          <p className="font-serif text-xl text-foreground mb-2">✓</p>
          <p className="font-sans text-foreground/80">{t("reservation.success")}</p>
        </div>
      )}
    </div>
  );
}
