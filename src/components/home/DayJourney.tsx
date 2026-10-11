"use client";
import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform, useMotionTemplate, type MotionValue } from "framer-motion";
import { media } from "@/lib/media";

/**
 * « Une journée à Villa Serena » — pinned scroll story, sunrise to night.
 * The background walks through the brand palette (crème → or → terracotta → nuit),
 * photos sit in a riad arch, and a sun/moon travels along an arc as progress.
 */

const MOMENTS = [
  { key: "morning", time: "07:00", image: media("/welcome-jardin.jpg") },
  { key: "noon", time: "12:30", image: media("/hero-main.jpg") },
  { key: "afternoon", time: "16:00", image: media("/exp-massage.jpg") },
  { key: "night", time: "21:00", image: media("/welcome-salon.jpg") },
] as const;

// Keyframes across the whole scroll, one stop per moment.
const STOPS = [0, 0.3, 0.6, 0.9];
const BG = [
  "oklch(0.965 0.02 85)", // crème du matin
  "oklch(0.86 0.09 78)", // or de midi
  "oklch(0.62 0.12 35)", // terracotta d'après-midi
  "oklch(0.2 0.03 50)", // nuit
];
const FG = ["oklch(0.24 0.03 50)", "oklch(0.24 0.03 50)", "oklch(0.98 0.01 80)", "oklch(0.98 0.01 80)"];
const ACCENT = ["oklch(0.6 0.13 28)", "oklch(0.45 0.1 40)", "oklch(0.93 0.06 80)", "oklch(0.74 0.13 73)"];

const STARS = Array.from({ length: 36 }, (_, i) => ({
  left: (i * 37.7) % 100,
  top: (i * 23.3) % 55,
  size: i % 5 === 0 ? 2.5 : 1.5,
}));

export function DayJourney() {
  const t = useTranslations("journey");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const bg = useTransform(scrollYProgress, STOPS, BG);
  const fg = useTransform(scrollYProgress, STOPS, FG);
  const accent = useTransform(scrollYProgress, STOPS, ACCENT);
  const starsOpacity = useTransform(scrollYProgress, [0.68, 0.88], [0, 1]);

  // Sun travels along a half-circle arc (left → top → right).
  const angle = useTransform(scrollYProgress, [0, 1], [Math.PI, 0]);
  const sunX = useTransform(angle, (a) => 50 + 46 * Math.cos(a));
  const sunY = useTransform(angle, (a) => 50 - 46 * Math.sin(a));
  const sunLeft = useMotionTemplate`${sunX}%`;
  const sunTop = useMotionTemplate`${sunY}%`;
  const sunColor = useTransform(scrollYProgress, [0, 0.55, 0.8, 1], [
    "oklch(0.8 0.14 70)",
    "oklch(0.85 0.15 85)",
    "oklch(0.7 0.16 40)",
    "oklch(0.95 0.02 90)",
  ]);
  const arcProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} className="relative" style={{ height: `${MOMENTS.length * 110}vh` }}>
      <motion.div style={{ backgroundColor: bg, color: fg }} className="sticky top-0 h-svh w-full overflow-hidden">
        {/* Night stars */}
        <motion.div style={{ opacity: starsOpacity }} className="pointer-events-none absolute inset-0">
          {STARS.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white/80"
              style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size }}
            />
          ))}
        </motion.div>

        <div className="relative h-full mx-auto max-w-7xl px-6 lg:px-12 flex flex-col justify-center gap-5 pt-20 pb-14 lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center lg:py-0">
          {/* Text column */}
          <div className="order-2 lg:order-1 relative">
            {/* Mobile: eyebrow + small sun arc on one row. Desktop: eyebrow above a larger arc. */}
            <div className="flex items-end justify-between gap-4 mb-4 lg:block lg:mb-0">
              <motion.p
                style={{ color: accent }}
                className="font-sans text-[10px] lg:text-[11px] tracking-[0.3em] uppercase lg:mb-6"
              >
                {t("eyebrow")}
              </motion.p>

            {/* Sun arc / progress */}
            <div className="relative w-20 lg:w-56 shrink-0 aspect-[2/1] lg:mb-10">
              <svg viewBox="0 0 100 50" className="absolute inset-0 w-full h-full overflow-visible">
                <path d="M 4 50 A 46 46 0 0 1 96 50" fill="none" stroke="currentColor" strokeOpacity={0.18} strokeWidth={0.6} />
                <motion.path
                  d="M 4 50 A 46 46 0 0 1 96 50"
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity={0.6}
                  strokeWidth={0.8}
                  style={{ pathLength: arcProgress }}
                />
                <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeOpacity={0.25} strokeWidth={0.5} />
              </svg>
              <motion.span
                style={{ left: sunLeft, top: sunTop, backgroundColor: sunColor }}
                className="absolute size-2.5 lg:size-4 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_16px_3px_rgba(255,200,120,0.45)] lg:shadow-[0_0_24px_4px_rgba(255,200,120,0.45)]"
              />
            </div>
            </div>

            <div className="relative min-h-[13rem] sm:min-h-[15rem] lg:min-h-[22rem]">
              {MOMENTS.map((m, i) => (
                <MomentText key={m.key} index={i} progress={scrollYProgress} accent={accent} time={m.time}
                  label={t(`${m.key}.label`)} title={t(`${m.key}.title`)} body={t(`${m.key}.body`)} />
              ))}
            </div>
          </div>

          {/* Arch image column */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative h-[38svh] [@media(max-height:700px)]:h-[31svh] max-h-[360px] lg:h-auto lg:max-h-none lg:w-full lg:max-w-[440px] aspect-[3/4] rounded-t-full overflow-hidden shadow-2xl ring-1 ring-black/5">
              {MOMENTS.map((m, i) => (
                <MomentImage key={m.key} index={i} progress={scrollYProgress} src={m.image} alt={t(`${m.key}.title`)} />
              ))}
            </div>
          </div>
        </div>

        {/* Step markers */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
          {MOMENTS.map((m, i) => (
            <Marker key={m.key} index={i} progress={scrollYProgress} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/** Opacity window for moment i: fully visible around its stop, crossfading with neighbours. */
function windowAt(p: number, i: number) {
  const n = MOMENTS.length;
  const seg = 1 / n;
  const start = i * seg;
  const end = start + seg;
  const f = seg * 0.18;
  const fadeIn = i === 0 ? 1 : Math.min(1, Math.max(0, (p - (start - f)) / f));
  const fadeOut = i === n - 1 ? 1 : Math.min(1, Math.max(0, (end - p) / f));
  return Math.min(fadeIn, fadeOut);
}

function useWindow(progress: MotionValue<number>, i: number) {
  return useTransform(progress, (p) => windowAt(p, i));
}

function MomentText({
  index, progress, accent, time, label, title, body,
}: {
  index: number; progress: MotionValue<number>; accent: MotionValue<string>;
  time: string; label: string; title: string; body: string;
}) {
  const opacity = useWindow(progress, index);
  const y = useTransform(progress, (p) => (1 - windowAt(p, index)) * 24);
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0">
      <div className="flex items-baseline gap-3 lg:gap-4 mb-2 lg:mb-3">
        <motion.span style={{ color: accent }} className="font-serif text-4xl lg:text-7xl tabular-nums leading-none">
          {time}
        </motion.span>
        <span className="font-sans text-[10px] lg:text-[11px] tracking-[0.25em] uppercase opacity-70">{label}</span>
      </div>
      <h3 className="font-serif text-[1.65rem] sm:text-3xl lg:text-5xl leading-tight mb-3 lg:mb-4 max-w-lg">{title}</h3>
      <div className="flex items-center gap-2 mb-3 lg:mb-4" aria-hidden>
        <span className="h-px w-8 bg-current opacity-30" />
        <motion.span style={{ backgroundColor: accent }} className="size-1.5 rotate-45" />
        <motion.span style={{ backgroundColor: accent }} className="size-1 rotate-45 opacity-70" />
        <motion.span style={{ backgroundColor: accent }} className="size-1.5 rotate-45" />
        <span className="h-px w-8 bg-current opacity-30" />
      </div>
      <p className="font-sans text-[0.9rem] lg:text-base leading-relaxed max-w-md opacity-80">{body}</p>
    </motion.div>
  );
}

function MomentImage({ index, progress, src, alt }: { index: number; progress: MotionValue<number>; src: string; alt: string }) {
  const opacity = useWindow(progress, index);
  const scale = useTransform(progress, (p) => 1.12 - 0.12 * windowAt(p, index));
  return (
    <motion.div style={{ opacity, scale }} className="absolute inset-0">
      <Image src={src} alt={alt} fill sizes="(min-width:1024px) 440px, 62vw" className="object-cover" priority={index === 0} />
    </motion.div>
  );
}

function Marker({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const width = useTransform(progress, (p) => 8 + 20 * windowAt(p, index));
  const opacity = useTransform(progress, (p) => 0.35 + 0.65 * windowAt(p, index));
  return <motion.span style={{ width, opacity }} className="h-1 rounded-full bg-current block" />;
}
