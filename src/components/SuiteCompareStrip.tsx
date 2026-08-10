"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
  type Variants,
} from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight, Maximize2, BedDouble } from "lucide-react";
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

// Threshold (px) and velocity (px/s) a drag/swipe must clear before we treat
// it as "advance the carousel" instead of snapping back to where we started.
const DRAG_OFFSET_THRESHOLD = 80;
const DRAG_VELOCITY_THRESHOLD = 500;

export function SuiteCompareStrip({
  rooms,
  perNightLabel,
  reserveLabel,
}: {
  rooms: CompareSuite[];
  perNightLabel: string;
  reserveLabel: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  // +1 = travelling toward "next" (content should enter from the right),
  // -1 = travelling toward "previous" (content should enter from the left).
  // Every navigation path (buttons, dots, side-card click, drag, keyboard)
  // funnels through go()/navigateTo() so this stays correct everywhere.
  const [direction, setDirection] = useState(1);
  const n = rooms.length;

  // prefers-reduced-motion support: fall back to a quick, flat opacity
  // crossfade with no 3D rotation/translation and no spring overshoot.
  const reducedMotion = useReducedMotion();

  function go(delta: number) {
    setDirection(delta);
    setActiveIndex((i) => (i + delta + n) % n);
  }

  // Jump to an arbitrary index (dot nav / clicking a side card) — figures out
  // the *shortest* direction around the loop so the animation always travels
  // the short way, not always forward.
  function navigateTo(target: number) {
    let diff = target - activeIndex;
    if (diff > n / 2) diff -= n;
    if (diff < -n / 2) diff += n;
    setDirection(diff >= 0 ? 1 : -1);
    setActiveIndex(target);
  }

  const prevIndex = (activeIndex - 1 + n) % n;
  const nextIndex = (activeIndex + 1) % n;

  // Keyboard navigation: Left/Right arrow keys drive the same go() used by
  // the on-screen buttons.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -DRAG_OFFSET_THRESHOLD || info.velocity.x < -DRAG_VELOCITY_THRESHOLD) {
      go(1);
    } else if (info.offset.x > DRAG_OFFSET_THRESHOLD || info.velocity.x > DRAG_VELOCITY_THRESHOLD) {
      go(-1);
    }
    // Otherwise: framer-motion's dragConstraints spring the row back to 0
    // automatically — no manual "snap back" needed.
  }

  // Full luxury variant set: exit rotates/translates in 3D away from the
  // viewer, then the incoming card springs to rest from the same 3D pose.
  // Reduced-motion users get a flat, fast crossfade instead.
  const cardVariants: Variants = reducedMotion
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1, transition: { duration: 0.2 } },
        exit: { opacity: 0, transition: { duration: 0.15 } },
      }
    : {
        enter: (dir: number) => ({
          opacity: 0,
          scale: 0.82,
          rotateY: dir > 0 ? -25 : 25,
          x: dir > 0 ? "60%" : "-60%",
          z: -50,
        }),
        center: {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          x: 0,
          z: 100,
          // Spring physics for the entrance — slight overshoot before it
          // settles into place, per the "concierge, unhurried" brief.
          transition: { type: "spring", stiffness: 120, damping: 20, mass: 0.8 },
        },
        exit: (dir: number) => ({
          opacity: 0,
          scale: 0.82,
          rotateY: dir > 0 ? 25 : -25,
          x: dir > 0 ? "-60%" : "60%",
          z: -50,
          // Custom cubic-bezier — a slow, deliberate exit rather than a snap.
          // Fades all the way to 0 (not a partial opacity) so the outgoing
          // card is actually gone by the time the transition finishes,
          // instead of lingering as a faint "ghost" over the next card.
          transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
        }),
      };

  // The photo inside each card drifts a little further than the card frame
  // itself during the transition — a cheap, tasteful parallax read as depth.
  // (Scaled well below a literal 1.2x of the card's full ±60% travel, which
  // would tear the image past its frame — this keeps it a subtle accent.)
  const imageParallaxVariants: Variants = reducedMotion
    ? { enter: { x: 0 }, center: { x: 0 }, exit: { x: 0 } }
    : {
        enter: (dir: number) => ({ x: dir > 0 ? "8%" : "-8%" }),
        center: { x: 0, transition: { type: "spring", stiffness: 120, damping: 20, mass: 0.8 } },
        exit: (dir: number) => ({ x: dir > 0 ? "-8%" : "8%", transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } }),
      };

  return (
    <div>
      {/* perspective is what makes the children's rotateY/z transforms read as 3D */}
      <div className="relative overflow-hidden py-6" style={{ perspective: reducedMotion ? undefined : 1400 }}>
        <motion.div
          className="flex items-center justify-center gap-4 sm:gap-6 lg:gap-10"
          drag={reducedMotion ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
        >
          <SideSlot room={rooms[prevIndex]} onClick={() => navigateTo(prevIndex)} />

          <div className="relative shrink-0 w-[78vw] max-w-[320px] sm:w-[55vw] sm:max-w-[380px] lg:w-[480px] lg:max-w-none [will-change:transform]">
            <AnimatePresence mode="popLayout" custom={direction} initial={false}>
              <motion.div
                key={rooms[activeIndex].id}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{ transformStyle: "preserve-3d" }}
              >
                <Link href={`/suites/${rooms[activeIndex].slug}`} className="block">
                  <SuiteCardVisual
                    room={rooms[activeIndex]}
                    perNightLabel={perNightLabel}
                    reserveLabel={reserveLabel}
                    active
                    direction={direction}
                    imageVariants={imageParallaxVariants}
                  />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          <SideSlot room={rooms[nextIndex]} onClick={() => navigateTo(nextIndex)} />
        </motion.div>

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous"
          className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 size-11 sm:size-12 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-foreground transition-all hover:border-villa-terracotta hover:text-villa-terracotta hover:scale-105"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next"
          className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 size-11 sm:size-12 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-foreground transition-all hover:border-villa-terracotta hover:text-villa-terracotta hover:scale-105"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 mt-6">
        {rooms.map((room, i) => (
          <button
            key={room.id}
            type="button"
            onClick={() => navigateTo(i)}
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

// One of the two peeking side cards. Deliberately NOT animated: only the
// center card runs the enter/exit transition. Animating the side slots too
// used to mean the same room briefly existed as two concurrent animated
// copies (one exiting the center slot, one "entering" a side slot) whose
// motion paths crossed on screen — that's what read as a lingering ghost
// card. Side slots now just swap their content instantly, so at most one
// animated instance of any given room ever exists at once.
function SideSlot({ room, onClick }: { room: CompareSuite; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={room.name}
      className="hidden sm:block shrink-0 w-[18vw] max-w-[120px] lg:w-[230px] lg:max-w-none text-left"
    >
      <SuiteCardVisual room={room} perNightLabel="" reserveLabel="" active={false} />
    </button>
  );
}

function SuiteCardVisual({
  room,
  perNightLabel,
  reserveLabel,
  active,
  direction,
  imageVariants,
}: {
  room: CompareSuite;
  perNightLabel: string;
  reserveLabel: string;
  active: boolean;
  direction?: number;
  imageVariants?: Variants;
}) {
  return (
    <div
      className={cn(
        "bg-card rounded-lg overflow-hidden shadow-[0_8px_30px_rgba(30,20,10,0.1)]",
        active ? "opacity-100" : "opacity-50 [filter:blur(0.5px)]"
      )}
    >
      {/* Fixed-size crop window — stays put while the image inside drifts
          for the parallax effect, so the card's outline never distorts. */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {room.image && imageVariants ? (
          <motion.div custom={direction} variants={imageVariants} className="absolute inset-0 scale-[1.15]">
            <Image
              src={room.image}
              alt={room.name}
              fill
              sizes="(max-width: 640px) 260px, (max-width: 1024px) 400px, 500px"
              className="object-cover"
              priority={active}
            />
          </motion.div>
        ) : (
          room.image && (
            <Image
              src={room.image}
              alt={room.name}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 260px, (max-width: 1024px) 400px, 500px"
              className="object-cover"
            />
          )
        )}
      </div>

      <div className={cn(active ? "p-5 sm:p-7" : "p-4")}>
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className={cn("font-serif text-foreground leading-snug", active ? "text-xl sm:text-2xl" : "text-sm")}>
            {room.name}
          </h3>
          {active && (
            <span className="font-sans text-sm text-muted-foreground whitespace-nowrap shrink-0 tabular-nums">
              <span className="text-villa-terracotta font-medium">{room.price}€</span> /{perNightLabel}
            </span>
          )}
        </div>

        {active && (
          <>
            <p className="font-sans text-sm italic text-muted-foreground leading-relaxed mb-4">{room.subtitle}</p>

            <div className="grid grid-cols-2 gap-4 py-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Maximize2 className="size-4 text-muted-foreground shrink-0" />
                <span className="font-sans text-sm text-foreground/80">{room.size}</span>
              </div>
              <div className="flex items-center gap-2">
                <BedDouble className="size-4 text-muted-foreground shrink-0" />
                <span className="font-sans text-sm text-foreground/80">{room.bedType}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <span className="inline-flex items-center px-6 py-2.5 bg-villa-terracotta text-white font-sans text-xs tracking-[0.15em] uppercase">
                {reserveLabel}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
