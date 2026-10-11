"use client";
import { useRef } from "react";
import { media } from "@/lib/media";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ZelligeDivider } from "@/components/ZelligeDivider";

export function Welcome() {
  const t = useTranslations();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // The small photo drifts against the arch for a little depth.
  const ySmall = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);
  const yArch = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <section ref={ref} className="bg-villa-cream py-24 lg:py-36 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-10 items-center">
        <div className="lg:col-span-6 relative order-2 lg:order-1">
          <div className="relative w-[78%] aspect-[3/4] overflow-hidden rounded-t-full bg-muted">
            <motion.div style={{ y: yArch }} className="absolute inset-0 scale-110">
              <Image
                src={media("/welcome-jardin.jpg")}
                alt="Jardin de Villa Serena, oliviers et statue de Bouddha"
                fill
                sizes="(min-width:1024px) 40vw, 78vw"
                className="object-cover"
              />
            </motion.div>
          </div>
          <motion.div
            style={{ y: ySmall }}
            className="absolute bottom-8 right-0 w-[48%] aspect-[4/5] overflow-hidden shadow-2xl ring-8 ring-villa-cream"
          >
            <Image
              src={media("/welcome-salon.jpg")}
              alt="Salon et salle à manger de Villa Serena"
              fill
              sizes="(min-width:1024px) 24vw, 48vw"
              className="object-cover"
            />
          </motion.div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8 order-1 lg:order-2">
          <p className="flex items-center gap-3 font-sans text-[11px] tracking-[0.25em] uppercase text-villa-terracotta mb-5">
            <span className="h-px w-8 bg-villa-terracotta" />
            {t("home.welcome_label")}
          </p>
          <h2 className="font-serif font-light text-[clamp(2.2rem,4.6vw,3.9rem)] leading-[1.04] text-foreground whitespace-pre-line mb-7">
            {t("home.welcome_title")}
          </h2>
          <ZelligeDivider align="left" className="mb-7 max-w-[14rem]" />
          <p className="font-sans text-muted-foreground leading-relaxed mb-9">{t("home.welcome_body")}</p>
          <Link
            href="/la-villa"
            className="font-sans text-xs tracking-[0.15em] uppercase text-foreground border-b border-foreground/30 pb-1 hover:text-villa-terracotta hover:border-villa-terracotta transition-colors"
          >
            {t("hero.cta_primary")}
          </Link>
        </div>
      </div>
    </section>
  );
}
