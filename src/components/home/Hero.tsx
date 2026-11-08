"use client";
import { useRef } from "react";
import { media } from "@/lib/media";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * Home hero (client brief, ch. 03/05): large colour logo centred on a 55 % night-blue veil,
 * H1 under the logo, both buttons visible on load (no reveal animation on text or buttons).
 */
export function Hero() {
  const t = useTranslations();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <div ref={ref} className="relative min-h-svh flex items-center justify-center overflow-hidden bg-villa-ink">
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        <Image
          src={media("/hero-main.jpg")}
          alt="Piscine privée de la Villa Serena et façade du riad, route de l'Ourika, Marrakech"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      {/* 55 % night-blue veil, a little deeper at the bottom for the text. */}
      <div className="absolute inset-0 bg-villa-ink/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-villa-ink/60" />

      <div className="relative w-full max-w-4xl mx-auto px-6 pt-28 pb-16 text-center">
        <Image
          src={media("/logo-serena-color.png")}
          alt="Villa Serena Marrakech"
          width={1083}
          height={1030}
          priority
          className="mx-auto h-40 sm:h-52 lg:h-60 w-auto drop-shadow-[0_4px_24px_rgba(0,0,0,0.25)]"
        />
        <p className="mt-6 font-sans text-[11px] sm:text-xs tracking-[0.25em] uppercase text-villa-gold">
          {t("hero.tagline")}
        </p>
        <h1 className="mt-4 font-serif font-light text-white text-[clamp(2.2rem,5.4vw,4.4rem)] leading-[1.05] text-balance">
          {t("hero.headline")}
        </h1>
        <p className="mt-6 mx-auto max-w-2xl font-sans text-[0.95rem] sm:text-base leading-relaxed text-white/90">
          {t("hero.subheadline")}
        </p>
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/reservation"
            className="w-full sm:w-auto px-8 py-3.5 bg-villa-terracotta hover:brightness-110 text-white font-sans text-xs tracking-[0.15em] uppercase transition"
          >
            {t("nav.book")}
          </Link>
          <Link
            href="/la-villa"
            className="w-full sm:w-auto px-8 py-3.5 border border-villa-gold text-white hover:bg-villa-gold/15 font-sans text-xs tracking-[0.15em] uppercase transition"
          >
            {t("hero.cta_primary")}
          </Link>
        </div>
      </div>
    </div>
  );
}
