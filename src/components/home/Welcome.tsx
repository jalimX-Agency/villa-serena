"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/Section";
import { SectionLabel } from "@/components/SectionLabel";
import { fadeUp } from "@/lib/motion";

export function Welcome() {
  const t = useTranslations();

  return (
    <Section className="bg-villa-cream py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        <motion.div variants={fadeUp} className="relative h-[360px] sm:h-[440px] lg:h-[520px] order-2 lg:order-1">
          <div className="absolute top-0 left-0 w-[75%] h-[82%] overflow-hidden shadow-lg">
            <Image
              src="/welcome-jardin.jpg"
              alt="Jardin de Villa Serena, oliviers et statue de Bouddha"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-[58%] h-[55%] overflow-hidden shadow-xl border-4 border-villa-cream">
            <Image
              src="/welcome-salon.jpg"
              alt="Salon et salle à manger de Villa Serena"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
        <div className="order-1 lg:order-2">
          <SectionLabel>{t("home.welcome_label")}</SectionLabel>
          <motion.h2
            variants={fadeUp}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground whitespace-pre-line leading-tight mb-6"
          >
            {t("home.welcome_title")}
          </motion.h2>
          <motion.p variants={fadeUp} className="font-sans text-muted-foreground leading-relaxed mb-8">
            {t("home.welcome_body")}
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link
              href="/la-villa"
              className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.15em] uppercase text-villa-terracotta hover:gap-3 transition-all"
            >
              {t("hero.cta_primary")} →
            </Link>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
