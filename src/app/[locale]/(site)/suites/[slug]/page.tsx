import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { Section } from "@/components/Section";
import { RoomCard } from "@/components/home/RoomCard";

async function getRoom(slug: string) {
  return db.room.findUnique({ where: { slug } });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const room = await getRoom(slug);
  if (!room) return {};
  const isEn = locale === "en";
  const name = isEn && room.nameEn ? room.nameEn : room.name;
  const description = isEn && room.descriptionEn ? room.descriptionEn : room.description;

  return {
    title: name,
    description,
    alternates: {
      canonical: `https://www.villaserenamarrakech.com/${locale}/suites/${slug}`,
      languages: {
        fr: `https://www.villaserenamarrakech.com/fr/suites/${slug}`,
        en: `https://www.villaserenamarrakech.com/en/suites/${slug}`,
      },
    },
    openGraph: room.image ? { images: [{ url: room.image }] } : undefined,
  };
}

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const room = await getRoom(slug);
  if (!room) notFound();

  const t = await getTranslations();
  const isEn = locale === "en";
  const name = isEn && room.nameEn ? room.nameEn : room.name;
  const subtitle = isEn && room.subtitleEn ? room.subtitleEn : room.subtitle;
  const description =
    (isEn && room.longDescriptionEn ? room.longDescriptionEn : room.longDescription) ||
    (isEn && room.descriptionEn ? room.descriptionEn : room.description);
  const bedType = isEn && room.bedTypeEn ? room.bedTypeEn : room.bedType;
  const amenities = ((isEn && room.amenitiesEn ? room.amenitiesEn : room.amenities) || "")
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
  const gallery = (room.images || room.image || "")
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);
  const includes = t.raw("suites.includes") as string[];

  const otherRooms = await db.room.findMany({
    where: { slug: { not: slug } },
    orderBy: { order: "asc" },
    take: 3,
  });

  return (
    <>
      <div className="relative h-[60vh] min-h-[420px] overflow-hidden">
        {room.image && (
          <Image src={room.image} alt={name} fill priority className="object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-villa-ink/70 via-villa-ink/10 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 lg:px-12 pb-10">
          <div className="mx-auto max-w-5xl w-full">
            <Link
              href="/suites"
              className="inline-block font-sans text-[11px] tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors mb-4"
            >
              ← {t("suites.back")}
            </Link>
            <span
              className="inline-block size-2.5 rounded-full border border-white/70 mb-3"
              style={{ backgroundColor: room.color || undefined }}
              aria-hidden
            />
            <h1 className="font-serif text-4xl sm:text-5xl text-white mb-2">{name}</h1>
            <p className="font-sans text-white/80">{subtitle}</p>
          </div>
        </div>
      </div>

      <Section className="py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <p className="font-sans text-foreground/80 leading-relaxed mb-10">{description}</p>

            {gallery.length > 1 && (
              <div className="grid grid-cols-2 gap-3 mb-10">
                {gallery.slice(1).map((src, i) => (
                  <div key={src} className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={src}
                      alt={`${name} ${i + 2}`}
                      fill
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <h2 className="font-sans text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-4">
              {t("suites.amenities")}
            </h2>
            <ul className="grid grid-cols-2 gap-y-2 mb-10">
              {amenities.map((a) => (
                <li key={a} className="font-sans text-sm text-foreground/80">
                  · {a}
                </li>
              ))}
            </ul>

            <h2 className="font-sans text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-4">
              {t("suites.all_rooms_include")}
            </h2>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {includes.map((item) => (
                <li key={item} className="font-sans text-sm text-foreground/60">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border p-6 space-y-4">
                <ul className="font-sans text-sm text-foreground/70 space-y-1.5">
                  <li>{room.size}</li>
                  <li>{bedType}</li>
                </ul>
                <p className="font-sans text-xs text-muted-foreground leading-relaxed border-t border-border pt-4">
                  {locale === "en"
                    ? "Villa Serena is rented exclusively as a whole — 7 bedrooms, sleeping 14."
                    : "Villa Serena se loue exclusivement dans son intégralité — 7 chambres, 14 couchages."}
                </p>
                <Link
                  href="/reservation"
                  className="block text-center px-6 py-3 bg-villa-terracotta hover:bg-villa-terracotta/90 text-white font-sans text-xs tracking-[0.15em] uppercase transition-colors"
                >
                  {t("nav.book")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {otherRooms.length > 0 && (
        <Section className="bg-villa-cream py-16 lg:py-20 border-t border-border">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="font-sans text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-8 text-center">
              {t("suites.more_rooms")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {otherRooms.map((r, i) => (
                <RoomCard key={r.id} room={r} locale={locale} t={t} index={i} />
              ))}
            </div>
          </div>
        </Section>
      )}
    </>
  );
}
