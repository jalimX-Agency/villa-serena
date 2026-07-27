"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { fadeUp, stagger } from "@/lib/motion";

export function Hero() {
  const t = useTranslations();

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <Image
        src="/hero-main.jpg"
        alt="Villa Serena Marrakech — façade et piscine"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-villa-ink/50" />
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative text-center px-6 max-w-3xl"
      >
        <motion.p
          variants={fadeUp}
          className="font-sans text-[11px] tracking-[0.3em] uppercase text-white/80 mb-5"
        >
          {t("hero.tagline")}
        </motion.p>
        <motion.h1
          variants={fadeUp}
          className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-white whitespace-pre-line leading-tight mb-6"
        >
          {t("hero.headline")}
        </motion.h1>
        <motion.p variants={fadeUp} className="font-sans text-white/80 max-w-xl mx-auto mb-10">
          {t("hero.subheadline")}
        </motion.p>
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/la-villa"
            className="px-8 py-3 bg-white text-villa-terracotta font-sans text-xs tracking-[0.15em] uppercase hover:bg-villa-cream transition-colors"
          >
            {t("hero.cta_primary")}
          </Link>
          <Link
            href="/suites"
            className="px-8 py-3 border border-white/40 text-white font-sans text-xs tracking-[0.15em] uppercase hover:border-white transition-colors"
          >
            {t("hero.cta_secondary")}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
