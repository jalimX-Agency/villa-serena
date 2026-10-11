import { media } from "@/lib/media";
import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";

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

  const featured = await db.experience.findMany({
    where: { featured: true },
    orderBy: { order: "asc" },
    take: 4,
  });
  // The massage room is the stronger photo, so it takes the large lead tile.
  const experiences = featured.length > 1 ? [featured[1], featured[0], ...featured.slice(2)] : featured;

  return (
    <section className="relative bg-villa-ink py-24 lg:py-36 overflow-hidden">
      <div className="absolute inset-0">
        <Image src={media("/exp-hammam.jpg")} alt="" fill sizes="100vw" className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-villa-ink/75" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end mb-12 lg:mb-16">
          <div className="lg:col-span-7">
            <p className="flex items-center gap-3 font-sans text-[11px] tracking-[0.25em] uppercase text-villa-gold mb-5">
              <span className="h-px w-8 bg-villa-gold" />
              {t("home.experiences_label")}
            </p>
            <h2 className="font-serif font-light text-[clamp(2.2rem,4.6vw,3.9rem)] leading-[1.04] text-white whitespace-pre-line">
              {t("home.experiences_title")}
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="font-sans text-white/70 leading-relaxed mb-5">{t("home.experiences_sub")}</p>
            <Link
              href="/services"
              className="font-sans text-xs tracking-[0.15em] uppercase text-white border-b border-white/40 pb-1 hover:border-villa-gold hover:text-villa-gold transition-colors"
            >
              {t("services.page_title")}
            </Link>
          </div>
        </div>

        {/* Deliberately uneven: one tall lead tile, one wide, two small. */}
        <div className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 lg:gap-5 lg:h-[38rem]">
          {experiences.map((exp, i) => {
            const title = isEn && exp.titleEn ? exp.titleEn : exp.title;
            const href = CATEGORY_LINK[exp.category] ?? "/services";
            const span =
              i === 0
                ? "col-span-2 aspect-[4/3] lg:aspect-auto lg:row-span-2"
                : i === 1
                  ? "col-span-2 aspect-[16/9] lg:aspect-auto"
                  : "aspect-[3/4] lg:aspect-auto";
            return (
              <Link key={exp.id} href={href} className={`group relative block overflow-hidden ${span}`}>
                {exp.image && (
                  <Image
                    src={exp.image}
                    alt={title}
                    fill
                    sizes={i < 2 ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, 50vw"}
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                <span className="absolute left-4 top-4 font-sans text-[11px] tabular-nums tracking-[0.25em] text-white/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`absolute inset-x-4 bottom-4 font-serif text-white leading-tight ${i === 0 ? "text-3xl lg:text-4xl" : "text-lg sm:text-xl lg:text-2xl"}`}
                >
                  {title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
