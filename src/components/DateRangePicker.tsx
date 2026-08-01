"use client";
import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type BookedRange = { checkIn: string; checkOut: string };

function toDateKey(d: Date) {
  return format(d, "yyyy-MM-dd");
}

/** Booked ranges block [checkIn, checkOut) — the checkout day itself stays bookable. */
function buildDisabledSet(ranges: BookedRange[]): Set<string> {
  const set = new Set<string>();
  for (const r of ranges) {
    const start = startOfDay(new Date(r.checkIn));
    const end = startOfDay(new Date(r.checkOut));
    let d = start;
    while (isBefore(d, end)) {
      set.add(toDateKey(d));
      d = new Date(d.getTime() + 86400000);
    }
  }
  return set;
}

export function DateRangePicker({
  bookedRanges,
  locale,
  checkIn,
  checkOut,
  onChange,
}: {
  bookedRanges: BookedRange[];
  locale: string;
  checkIn: Date | null;
  checkOut: Date | null;
  onChange: (checkIn: Date | null, checkOut: Date | null) => void;
}) {
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));
  const disabled = useMemo(() => buildDisabledSet(bookedRanges), [bookedRanges]);
  const today = startOfDay(new Date());
  const dfLocale = locale === "fr" ? fr : enUS;

  function isDisabled(day: Date) {
    return isBefore(day, today) || disabled.has(toDateKey(day));
  }

  function rangeHasConflict(start: Date, end: Date) {
    let d = start;
    while (isBefore(d, end)) {
      if (disabled.has(toDateKey(d))) return true;
      d = new Date(d.getTime() + 86400000);
    }
    return false;
  }

  function handleClick(day: Date) {
    if (isDisabled(day)) return;

    if (!checkIn || (checkIn && checkOut)) {
      onChange(day, null);
      return;
    }
    // checkIn is set, checkOut is not
    if (!isBefore(checkIn, day)) {
      onChange(day, null);
      return;
    }
    if (rangeHasConflict(checkIn, day)) {
      onChange(day, null);
      return;
    }
    onChange(checkIn, day);
  }

  const monthStart = startOfMonth(visibleMonth);
  const monthEnd = endOfMonth(visibleMonth);
  const firstWeekday = (monthStart.getDay() + 6) % 7; // Monday-first
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const weekdayLabels =
    locale === "fr" ? ["L", "M", "M", "J", "V", "S", "D"] : ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="border border-border bg-background p-4">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setVisibleMonth((m) => subMonths(m, 1))}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="size-4" />
        </button>
        <p className="font-sans text-xs tracking-[0.15em] uppercase text-foreground">
          {format(visibleMonth, "MMMM yyyy", { locale: dfLocale })}
        </p>
        <button
          type="button"
          onClick={() => setVisibleMonth((m) => addMonths(m, 1))}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekdayLabels.map((w, i) => (
          <div key={i} className="text-center font-sans text-[10px] text-muted-foreground uppercase">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const disabledDay = isDisabled(day);
          const isCheckIn = checkIn && isSameDay(day, checkIn);
          const isCheckOut = checkOut && isSameDay(day, checkOut);
          const inRange =
            checkIn && checkOut && isBefore(checkIn, day) && isBefore(day, checkOut);

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={disabledDay}
              onClick={() => handleClick(day)}
              className={cn(
                "aspect-square text-xs font-sans transition-colors",
                disabledDay && "text-muted-foreground/30 line-through cursor-not-allowed",
                !disabledDay && !isCheckIn && !isCheckOut && !inRange && "text-foreground hover:bg-muted",
                inRange && "bg-villa-terracotta/15 text-foreground",
                (isCheckIn || isCheckOut) && "bg-villa-terracotta text-white"
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
      {!isSameMonth(visibleMonth, today) && (
        <button
          type="button"
          onClick={() => setVisibleMonth(startOfMonth(today))}
          className="mt-3 font-sans text-[10px] tracking-wide uppercase text-villa-terracotta"
        >
          {locale === "fr" ? "Revenir à aujourd'hui" : "Back to today"}
        </button>
      )}
    </div>
  );
}
