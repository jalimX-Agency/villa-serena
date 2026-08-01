import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { db } from "@/lib/db";
import { Section } from "@/components/Section";
import { getBookedRanges } from "@/lib/actions/room-booking";
import { ReservationClient, type RoomOption } from "@/components/ReservationClient";
import type { BookedRange } from "@/components/DateRangePicker";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reservation" });
  return {
    title: t("page_title"),
    description: t("page_sub"),
    alternates: {
      canonical: `https://www.villaserenamarrakech.com/${locale}/reservation`,
      languages: {
        fr: "https://www.villaserenamarrakech.com/fr/reservation",
        en: "https://www.villaserenamarrakech.com/en/reservation",
      },
    },
  };
}

export default async function ReservationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ room?: string }>;
}) {
  const { locale } = await params;
  const { room: initialSlug } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations();
  const isEn = locale === "en";

  const rooms = await db.room.findMany({ orderBy: { order: "asc" } });

  const bookedRangesByRoom: Record<string, BookedRange[]> = {};
  await Promise.all(
    rooms.map(async (room) => {
      bookedRangesByRoom[room.id] = await getBookedRanges(room.id);
    })
  );

  const roomOptions: RoomOption[] = rooms.map((room) => ({
    id: room.id,
    slug: room.slug,
    name: isEn && room.nameEn ? room.nameEn : room.name,
    subtitle: isEn && room.subtitleEn ? room.subtitleEn : room.subtitle,
    price: room.price,
    image: room.image,
  }));

  return (
    <>
      <div className="pt-32 pb-16 px-6 mx-auto max-w-3xl text-center">
        <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-villa-terracotta mb-4">
          Villa Serena
        </p>
        <h1 className="font-serif text-4xl lg:text-5xl text-foreground mb-5">
          {t("reservation.page_title")}
        </h1>
        <p className="font-sans text-muted-foreground leading-relaxed">{t("reservation.page_sub")}</p>
      </div>

      <Section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          {roomOptions.length > 0 ? (
            <ReservationClient
              rooms={roomOptions}
              bookedRangesByRoom={bookedRangesByRoom}
              locale={locale}
              initialSlug={initialSlug}
            />
          ) : (
            <p className="text-center font-sans text-muted-foreground">
              {isEn ? "No rooms available." : "Aucune suite disponible."}
            </p>
          )}
        </div>
      </Section>
    </>
  );
}
