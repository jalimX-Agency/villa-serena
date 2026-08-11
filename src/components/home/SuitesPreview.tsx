import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { Section } from "@/components/Section";
import { SectionLabel } from "@/components/SectionLabel";
import { RoomCard } from "@/components/home/RoomCard";

export async function SuitesPreview() {
  const t = await getTranslations();
  const locale = await getLocale();

  const rooms = await db.room.findMany({
    orderBy: { order: "asc" },
    take: 5,
  });

  return (
    <Section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-14">
          <SectionLabel>{t("home.suites_label")}</SectionLabel>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground whitespace-pre-line leading-tight mb-4">
            {t("home.suites_title")}
          </h2>
          <p className="font-sans text-muted-foreground max-w-xl">{t("home.suites_sub")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.slice(0, 3).map((room, i) => (
            <RoomCard key={room.id} room={room} locale={locale} index={i} />
          ))}
        </div>
        {rooms.length > 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8 max-w-3xl mx-auto">
            {rooms.slice(3, 5).map((room, i) => (
              <RoomCard key={room.id} room={room} locale={locale} index={i + 3} />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-14">
          <Link
            href="/suites"
            className="inline-flex items-center px-8 py-3 border border-villa-terracotta text-villa-terracotta font-sans text-xs tracking-[0.15em] uppercase hover:bg-villa-terracotta hover:text-white transition-colors"
          >
            {t("suites.page_title")}
          </Link>
        </div>
      </div>
    </Section>
  );
}
