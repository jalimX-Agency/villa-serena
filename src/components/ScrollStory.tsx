"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

export type StoryMoment = {
  image: string;
  label: string;
  title: string;
  body: string;
};

export function ScrollStory({ moments }: { moments: StoryMoment[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const total = moments.length;

  return (
    <>
      {/* Desktop: pinned cinematic scroll */}
      <div ref={ref} className="hidden lg:block relative" style={{ height: `${total * 100}vh` }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-villa-ink">
          {moments.map((m, i) => (
            <StoryPanel key={m.title} moment={m} index={i} total={total} scrollYProgress={scrollYProgress} />
          ))}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
            {moments.map((m, i) => (
              <Dot key={m.title} index={i} total={total} scrollYProgress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile / tablet fallback: stacked full-height panels */}
      <div className="lg:hidden">
        {moments.map((m) => (
          <div key={m.title} className="relative h-[80vh] min-h-[520px] overflow-hidden">
            <Image src={m.image} alt={m.title} fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-villa-ink/80 via-villa-ink/15 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end px-6 pb-14">
              <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-villa-terracotta mb-3">
                {m.label}
              </p>
              <h3 className="font-serif text-3xl text-white mb-3">{m.title}</h3>
              <p className="font-sans text-white/80 max-w-md leading-relaxed">{m.body}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function StoryPanel({
  moment,
  index,
  total,
  scrollYProgress,
}: {
  moment: StoryMoment;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const segment = 1 / total;
  const start = index * segment;
  const end = start + segment;
  const fadeIn = start + segment * 0.2;
  const fadeOutStart = end - segment * 0.2;
  const isFirst = index === 0;
  const isLast = index === total - 1;

  const opacity = useTransform(
    scrollYProgress,
    isFirst ? [start, fadeIn, fadeOutStart, end] : isLast ? [start, fadeIn, end] : [start, fadeIn, fadeOutStart, end],
    isFirst ? [1, 1, 1, 0] : isLast ? [0, 1, 1] : [0, 1, 1, 0]
  );
  const scale = useTransform(scrollYProgress, [start, end], [1, 1.1]);
  const textY = useTransform(scrollYProgress, [start, fadeIn], [28, 0]);
  const textOpacity = useTransform(
    scrollYProgress,
    isFirst ? [start, fadeIn, fadeOutStart, end] : isLast ? [start, fadeIn, end] : [start, fadeIn, fadeOutStart, end],
    isFirst ? [1, 1, 1, 0] : isLast ? [0, 1, 1] : [0, 1, 1, 0]
  );

  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      <motion.div style={{ scale }} className="absolute inset-0">
        <Image src={moment.image} alt={moment.title} fill priority={isFirst} sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-villa-ink/75 via-villa-ink/10 to-transparent" />
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="absolute inset-0 flex flex-col justify-end px-6 lg:px-16 pb-24"
      >
        <div className="mx-auto max-w-4xl w-full">
          <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-villa-terracotta mb-4">
            {moment.label}
          </p>
          <h3 className="font-serif text-4xl lg:text-6xl text-white mb-4 max-w-2xl">{moment.title}</h3>
          <p className="font-sans text-white/80 max-w-lg leading-relaxed">{moment.body}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Dot({
  index,
  total,
  scrollYProgress,
}: {
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const segment = 1 / total;
  const start = index * segment;
  const end = start + segment;
  const scale = useTransform(
    scrollYProgress,
    [start, start + segment * 0.3, end - segment * 0.3, end],
    [1, 1.6, 1.6, 1]
  );
  const opacity = useTransform(
    scrollYProgress,
    [start, start + segment * 0.3, end - segment * 0.3, end],
    [0.4, 1, 1, 0.4]
  );
  return <motion.span style={{ scale, opacity }} className="size-2 rounded-full bg-white block" />;
}
