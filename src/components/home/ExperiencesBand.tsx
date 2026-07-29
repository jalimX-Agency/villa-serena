import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { Section } from "@/components/Section";
import { SectionLabel } from "@/components/SectionLabel";

const CATEGORY_LINK: Record<string, string> = {
  wellness: "/services/bien-etre",
  dining: "/services/restauration",
  outdoor: "/services/excursions",
  leisure: "/services/excursions",
};

export async function ExperiencesBand() {
  const t = await getTranslations();
  const locale = await getLocale();
  const isEn = locale === "en";

  const experiences = await db.experience.findMany({
    where: { featured: true },
    orderBy: { order: "asc" },
    take: 4,
  });

  return (
    <Section className="relative bg-villa-ink py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/exp-hammam.jpg" alt="" fill className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-villa-ink/70" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-14">
          <SectionLabel className="justify-center">{t("home.experiences_label")}</SectionLabel>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white whitespace-pre-line leading-tight mb-4">
            {t("home.experiences_title")}
          </h2>
          <p className="font-sans text-white/70 max-w-xl">{t("home.experiences_sub")}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {experiences.map((exp) => {
            const title = isEn && exp.titleEn ? exp.titleEn : exp.title;
            const href = CATEGORY_LINK[exp.category] ?? "/services";
            return (
              <Link key={exp.id} href={href} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden mb-3">
                  {exp.image && (
                    <Image
                      src={exp.image}
                      alt={title}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
                  <span className="absolute bottom-3 left-3 right-3 font-serif text-base sm:text-lg text-white leading-tight">
                    {title}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="flex justify-center mt-14">
          <Link
            href="/services"
            className="inline-flex items-center px-8 py-3 border border-white/40 text-white font-sans text-xs tracking-[0.15em] uppercase hover:border-white transition-colors"
          >
            {t("services.page_title")}
          </Link>
        </div>
      </div>
    </Section>
  );
}
