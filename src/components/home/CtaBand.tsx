import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function CtaBand() {
  const t = await getTranslations();

  return (
    <section className="relative bg-villa-terracotta overflow-hidden">
      {/* Oversized riad arch as a quiet backdrop. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -bottom-40 hidden lg:block h-[46rem] w-[32rem] rounded-t-full border border-white/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -bottom-40 hidden lg:block h-[38rem] w-[24rem] rounded-t-full border border-white/10"
      />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-24 lg:py-36 grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="flex items-center gap-3 font-sans text-[11px] tracking-[0.25em] uppercase text-white/80 mb-6">
            <span className="h-px w-8 bg-white/70" />
            {t("reservation.villa_summary")}
          </p>
          <h2 className="font-serif font-light text-white text-[clamp(2.4rem,6vw,5rem)] leading-[1] tracking-[-0.01em] text-balance">
            {t("home.cta_title")}
          </h2>
        </div>
        <div className="lg:col-span-4">
          <p className="font-sans text-white/85 leading-relaxed mb-8">{t("home.cta_body")}</p>
          <Link
            href="/reservation"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-villa-terracotta font-sans text-xs tracking-[0.15em] uppercase hover:bg-villa-cream transition-colors"
          >
            {t("home.cta_button")}
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
