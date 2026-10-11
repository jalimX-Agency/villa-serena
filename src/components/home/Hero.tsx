"use client";
import { useRef } from "react";
import { media } from "@/lib/media";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { fadeUp, stagger } from "@/lib/motion";

export function Hero() {
  const t = useTranslations();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Gentle parallax: the photo drifts slower than the page.
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const stats = ["rooms", "guests", "pool", "hammam"] as const;

  return (
    <div ref={ref} className="relative h-svh min-h-[620px] flex items-end overflow-hidden bg-villa-ink">
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        <Image
          src={media("/hero-main.jpg")}
          alt="Villa Serena Marrakech — façade et piscine"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-villa-ink/85 via-villa-ink/25 to-villa-ink/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-villa-ink/55 via-villa-ink/10 to-transparent" />

      <div className="relative w-full mx-auto max-w-7xl px-6 lg:px-8 pb-10 lg:pb-14">
        {/* Tagline and H1 render immediately: the LCP text must not wait for JS. */}
        <p
          className="flex items-center gap-3 font-sans text-[11px] tracking-[0.3em] uppercase text-white/80 mb-5"
        >
          <span className="h-px w-8 bg-villa-gold" />
          {t("hero.tagline")}
        </p>
        <h1
          className="font-serif font-light text-white whitespace-pre-line text-[clamp(2.6rem,7.2vw,6.25rem)] leading-[0.98] tracking-[-0.015em] max-w-5xl"
        >
          {t("hero.headline")}
        </h1>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mt-8 lg:mt-10 grid gap-8 lg:grid-cols-12 lg:items-end"
        >
          <div className="lg:col-span-6">
            <motion.p variants={fadeUp} className="font-sans text-white/85 max-w-lg leading-relaxed mb-7">
              {t("hero.subheadline")}
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
              <Link
                href="/reservation"
                className="px-8 py-3.5 bg-white text-villa-terracotta font-sans text-xs tracking-[0.15em] uppercase hover:bg-villa-cream transition-colors"
              >
                {t("nav.book")}
              </Link>
              <Link
                href="/la-villa"
                className="font-sans text-xs tracking-[0.15em] uppercase text-white border-b border-white/50 pb-1 hover:border-white transition-colors"
              >
                {t("hero.cta_primary")}
              </Link>
            </motion.div>
          </div>

          <motion.ul
            variants={fadeUp}
            className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 border-t border-white/25 pt-5"
          >
            {stats.map((s) => (
              <li key={s} className="font-sans text-[11px] tracking-[0.18em] uppercase text-white/80">
                {t(`home.stats.${s}`)}
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </div>
  );
}
