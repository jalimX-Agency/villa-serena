import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/Section";

export async function CtaBand() {
  const t = await getTranslations();

  return (
    <Section className="bg-villa-terracotta py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight mb-5">
          {t("home.cta_title")}
        </h2>
        <p className="font-sans text-white/85 max-w-xl mx-auto mb-10">{t("home.cta_body")}</p>
        <Link
          href="/reservation"
          className="inline-flex items-center px-10 py-3.5 bg-white text-villa-terracotta font-sans text-xs tracking-[0.15em] uppercase hover:bg-villa-cream transition-colors"
        >
          {t("home.cta_button")}
        </Link>
      </div>
    </Section>
  );
}
