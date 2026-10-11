import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";

/** Five suites as a horizontal, snap-scrolling strip — each card tinted with the suite's own colour. */
export async function SuitesPreview() {
  const t = await getTranslations();
  const isEn = (await getLocale()) === "en";
  const rooms = await db.room.findMany({ orderBy: { order: "asc" }, take: 5 });

  return (
    <section className="bg-background py-24 lg:py-36 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end mb-12 lg:mb-16">
          <div className="lg:col-span-7">
            <p className="flex items-center gap-3 font-sans text-[11px] tracking-[0.25em] uppercase text-villa-terracotta mb-5">
              <span className="h-px w-8 bg-villa-terracotta" />
              {t("home.suites_label")}
            </p>
            <h2 className="font-serif font-light text-[clamp(2.2rem,4.6vw,3.9rem)] leading-[1.04] text-foreground whitespace-pre-line">
              {t("home.suites_title")}
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="font-sans text-muted-foreground leading-relaxed mb-5">{t("home.suites_sub")}</p>
            <Link
              href="/suites"
              className="font-sans text-xs tracking-[0.15em] uppercase text-foreground border-b border-foreground/30 pb-1 hover:text-villa-terracotta hover:border-villa-terracotta transition-colors"
            >
              {t("suites.page_title")}
            </Link>
          </div>
        </div>
      </div>

      {/* Bleeds to the right edge; starts aligned with the page gutter. */}
      <ul className="flex gap-5 lg:gap-7 overflow-x-auto snap-x snap-mandatory scroll-px-6 px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {rooms.map((room, i) => {
          const name = isEn && room.nameEn ? room.nameEn : room.name;
          const subtitle = isEn && room.subtitleEn ? room.subtitleEn : room.subtitle;
          return (
            <li key={room.id} className="snap-start shrink-0 w-[78vw] sm:w-[46vw] lg:w-[27rem]">
              <Link href={`/suites/${room.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  {room.image && (
                    <Image
                      src={room.image}
                      alt={name}
                      fill
                      sizes="(min-width:1024px) 27rem, (min-width:640px) 46vw, 78vw"
                      className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <span className="absolute left-5 top-5 font-sans text-[11px] tabular-nums tracking-[0.25em] text-white/90">
                    {String(i + 1).padStart(2, "0")} / {String(rooms.length).padStart(2, "0")}
                  </span>
                  <ArrowUpRight className="absolute right-5 top-5 size-4 text-white/80 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  <div className="absolute inset-x-5 bottom-5">
                    <h3 className="font-serif text-3xl text-white">{name}</h3>
                    <p className="font-sans text-xs text-white/80 mt-1">{subtitle}</p>
                  </div>
                </div>
                {/* The suite's own colour, as a rule that grows on hover. */}
                <span
                  className="block h-1 w-12 transition-all duration-500 group-hover:w-full"
                  style={{ backgroundColor: room.color || "var(--villa-terracotta)" }}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
