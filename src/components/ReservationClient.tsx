"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { VillaEnquiryForm } from "@/components/VillaEnquiryForm";
import { type BookedRange } from "@/components/DateRangePicker";
import { cn } from "@/lib/utils";

type Step = "details" | "done";

const STEP_ORDER: Step[] = ["details", "done"];

export function ReservationClient({
  bookedRanges,
  locale,
}: {
  bookedRanges: BookedRange[];
  locale: string;
}) {
  const t = useTranslations();
  const [step, setStep] = useState<Step>("details");

  const steps: { key: Step; label: string }[] = [
    { key: "details", label: t("reservation.step_details") },
    { key: "done", label: t("reservation.step_done") },
  ];
  const currentIndex = STEP_ORDER.indexOf(step);

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

      <VillaEnquiryForm
        bookedRanges={bookedRanges}
        locale={locale}
        onStatusChange={(status) => {
          if (status === "success") setStep("done");
        }}
      />
    </div>
  );
}
