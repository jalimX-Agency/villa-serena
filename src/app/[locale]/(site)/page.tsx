import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

// Phase 0 shell — replaced section by section in Phase 1.
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <Image
        src="/hero-main.webp"
        alt="Villa Serena Marrakech"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-villa-indigo/50" />
      <div className="relative text-center px-6 max-w-3xl">
        <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-white/80 mb-5">
          {t("hero.tagline")}
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-white whitespace-pre-line leading-tight mb-6">
          {t("hero.headline")}
        </h1>
        <p className="font-sans text-white/80 max-w-xl mx-auto mb-10">{t("hero.subheadline")}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/la-maison"
            className="px-8 py-3 bg-white text-villa-indigo font-sans text-xs tracking-[0.15em] uppercase hover:bg-villa-cream transition-colors"
          >
            {t("hero.cta_primary")}
          </Link>
          <Link
            href="/chambres"
            className="px-8 py-3 border border-white/40 text-white font-sans text-xs tracking-[0.15em] uppercase hover:border-white transition-colors"
          >
            {t("hero.cta_secondary")}
          </Link>
        </div>
      </div>
    </div>
  );
}
