"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PhotoSoon } from "@/components/PhotoSoon";

export type Slide = { src: string; alt: string; caption?: string };

/**
 * Photo carousel (annex of 10 Nov 2026, M17, M36, M46): arrows, position dots, swipe on touch
 * screens (native scroll snapping), keyboard arrows, no autoplay. Photos after the first load lazily.
 */
export function PhotoCarousel({
  slides,
  className,
  frameClassName = "aspect-[4/3]",
  sizes = "(min-width:1024px) 58vw, 100vw",
  labels,
  tone = "light",
}: {
  slides: Slide[];
  className?: string;
  /** Shape of each photo (aspect ratio, rounded corners…). */
  frameClassName?: string;
  sizes?: string;
  labels: { prev: string; next: string; slide: string /* "Photo {n} sur {total}" */; region: string; soon?: string };
  tone?: "light" | "dark";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const go = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const target = Math.max(0, Math.min(count - 1, i));
    el.scrollTo({ left: target * el.clientWidth, behavior: "smooth" });
    setIndex(target);
  };

  const slideLabel = (n: number) => labels.slide.replace("{n}", String(n)).replace("{total}", String(count));

  if (count === 0) return null;

  const arrow = cn(
    "absolute top-1/2 -translate-y-1/2 z-10 flex size-11 items-center justify-center rounded-full backdrop-blur transition disabled:pointer-events-none disabled:opacity-0",
    "bg-white/85 text-villa-ink hover:bg-white shadow-md"
  );

  return (
    <div
      className={cn("relative", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={labels.region}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
      }}
    >
      <div className="relative">
        <div
          ref={ref}
          tabIndex={0}
          className={cn(
            "flex overflow-x-auto snap-x snap-mandatory overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-2 focus-visible:outline-villa-terracotta",
            frameClassName.includes("rounded") && frameClassName.split(" ").filter((c) => c.startsWith("rounded")).join(" ")
          )}
        >
          {slides.map((s, i) => (
            <figure
              key={`${s.src}-${i}`}
              className="relative w-full shrink-0 snap-center"
              role="group"
              aria-roledescription="slide"
              aria-label={slideLabel(i + 1)}
            >
              <div className={cn("relative overflow-hidden bg-muted", frameClassName)}>
                {s.src ? (
                  <Image src={s.src} alt={s.alt} fill sizes={sizes} loading={i === 0 ? undefined : "lazy"} className="object-cover" />
                ) : (
                  // Slot waiting for its photo (added later from « Photos du site »).
                  <PhotoSoon label={labels.soon ?? ""} className="absolute inset-0" />
                )}
              </div>
              {s.caption && (
                <figcaption className={cn("mt-3 font-sans text-sm", tone === "dark" ? "text-villa-sand-light" : "text-muted-foreground")}>
                  {s.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>

        {count > 1 && (
          <>
            <button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label={labels.prev} className={cn(arrow, "left-3")}>
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" onClick={() => go(index + 1)} disabled={index >= count - 1} aria-label={labels.next} className={cn(arrow, "right-3")}>
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={slideLabel(i + 1)}
              aria-current={i === index ? "true" : undefined}
              className="flex size-6 items-center justify-center"
            >
              <span
                className={cn(
                  "block h-1.5 rounded-full transition-all",
                  i === index ? "w-6 bg-villa-terracotta" : cn("w-1.5", tone === "dark" ? "bg-white/40" : "bg-villa-ink/25")
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
