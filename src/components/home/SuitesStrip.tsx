"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Horizontal snap strip with previous / next arrows, so the cards can be reached
 * with a mouse too (touch and trackpads scroll natively).
 */
export function SuitesStrip({ children, prevLabel, nextLabel }: { children: React.ReactNode; prevLabel: string; nextLabel: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    // Snapping keeps the first card at the scroll padding, so scrollLeft is not 0 at the start.
    const first = el.firstElementChild;
    const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
    const start = first ? first.getBoundingClientRect().left - el.getBoundingClientRect().left >= pad - 4 : true;
    setEdges({ start, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const go = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const arrow = "flex size-11 items-center justify-center rounded-full border border-villa-ink/20 text-villa-ink transition hover:bg-villa-ink hover:text-white disabled:pointer-events-none disabled:opacity-30";

  return (
    <div>
      <ul
        ref={ref}
        onScroll={update}
        className="flex gap-5 lg:gap-7 overflow-x-auto snap-x snap-mandatory scroll-px-6 px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>
      <div className={cn("mx-auto mt-6 flex max-w-7xl justify-end gap-3 px-6 lg:px-8", edges.start && edges.end && "hidden")}>
        <button type="button" onClick={() => go(-1)} disabled={edges.start} aria-label={prevLabel} className={arrow}>
          <ChevronLeft className="size-5" />
        </button>
        <button type="button" onClick={() => go(1)} disabled={edges.end} aria-label={nextLabel} className={arrow}>
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
