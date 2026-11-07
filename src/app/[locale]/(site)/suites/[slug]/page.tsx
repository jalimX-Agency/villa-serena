import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { media } from "@/lib/media";
import { SITE_URL } from "@/lib/seo";
import { SuiteCard } from "@/components/SuiteCard";
import { StarDivider } from "@/components/StarDivider";

async function getRoom(slug: string) {
  return db.room.findUnique({ where: { slug } });
}

const abs = (src: string) => (src.startsWith("http") ? src : `${SITE_URL}${src}`);

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
  // Per-suite Title and Méta from the client brief (ch. 07), with a fallback.
  const title = (isEn ? room.metaTitleEn : room.metaTitle) || `${name} | Villa Serena Marrakech`;
  const description =
    (isEn ? room.metaDescriptionEn : room.metaDescription) ||
    (isEn && room.descriptionEn ? room.descriptionEn : room.description).slice(0, 158);
  const url = `${SITE_URL}/${locale}/suites/${slug}`;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: {
        fr: `${SITE_URL}/fr/suites/${slug}`,
        en: `${SITE_URL}/en/suites/${slug}`,
        "x-default": `${SITE_URL}/fr/suites/${slug}`,
      },
    },
    openGraph: { title, description, url, images: [{ url: room.image || media("/hero-main.jpg") }] },
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
  const pick = (fr: string, en: string) => (isEn && en ? en : fr);
  const name = pick(room.name, room.nameEn);
  const subtitle = pick(room.subtitle, room.subtitleEn);
  const lead = pick(room.description, room.descriptionEn);
  const body = pick(room.longDescription, room.longDescriptionEn);
  const bedType = pick(room.bedType, room.bedTypeEn);
  const idealFor = pick(room.idealFor, room.idealForEn);
  const amenities = pick(room.amenities, room.amenitiesEn)
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
  const gallery = (room.images || room.image || "")
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);
  const includes = t.raw("suites.includes") as string[];

  const others = await db.room.findMany({ where: { slug: { not: slug } }, orderBy: { order: "asc" } });
  // Prefer suites of the same space first, then the rest.
  const otherRooms = [...others.filter((r) => r.space === room.space), ...others.filter((r) => r.space !== room.space)].slice(0, 3);

  // A Room inside the villa (no Offer: suites are only booked with the whole villa).
  const roomSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Room",
    name,
    description: [lead, body].filter(Boolean).join(" "),
    image: gallery.map(abs),
    floorSize: room.size ? { "@type": "QuantitativeValue", value: room.size } : undefined,
    bed: bedType ? { "@type": "BedDetails", typeOfBed: bedType } : undefined,
    occupancy: { "@type": "QuantitativeValue", maxValue: room.maxGuests },
    amenityFeature: amenities.map((a) => ({ "@type": "LocationFeatureSpecification", name: a, value: true })),
    containedInPlace: { "@type": "VacationRental", name: "Villa Serena Marrakech", url: SITE_URL },
  });
  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("nav.home"), item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: t("nav.suites"), item: `${SITE_URL}/${locale}/suites` },
      { "@type": "ListItem", position: 3, name, item: `${SITE_URL}/${locale}/suites/${slug}` },
    ],
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: roomSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />

      <div className="relative h-[78vh] min-h-[520px] overflow-hidden bg-villa-ink">
        {room.image ? (
          <Image src={room.image} alt={`${name}, Villa Serena Marrakech`} fill priority sizes="100vw" className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center pb-40">
            <Image src={media("/logo-serena-emblem.png")} alt="" width={419} height={539} priority className="h-48 w-auto opacity-80" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-villa-ink/0 via-villa-ink/15 to-villa-ink/75" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 lg:px-8 pb-10 lg:pb-14">
          <div className="mx-auto max-w-7xl w-full">
            <Link
              href="/suites"
              className="inline-block font-sans text-[11px] tracking-[0.2em] uppercase text-white/75 hover:text-white transition-colors mb-4"
            >
              ← {t("suites.back")}
            </Link>
            <span className="block h-1 w-14 mb-5" style={{ backgroundColor: room.color || "var(--villa-gold)" }} aria-hidden />
            <h1 className="font-serif font-light text-white leading-[0.98] tracking-[-0.015em]">
              <span className="block text-[clamp(2.8rem,8vw,6.5rem)]">{name}</span>
              <span className="mt-3 block text-[clamp(1.25rem,2.4vw,1.9rem)] text-villa-sand-light first-letter:uppercase">{subtitle}</span>
            </h1>
          </div>
        </div>
      </div>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-8">
            <p className="font-serif text-2xl lg:text-[1.9rem] leading-snug text-villa-ink mb-6 text-balance">{lead}</p>
            {body && <p className="font-sans text-foreground/80 leading-relaxed mb-12">{body}</p>}

            {gallery.length > 1 && (
              <div className="grid grid-cols-2 gap-4 lg:gap-6 mb-14 items-end">
                {gallery.slice(1).map((src, i) => (
                  <div
                    key={src}
                    className={`relative overflow-hidden bg-muted ${i % 2 === 0 ? "aspect-[3/4] rounded-t-full" : "aspect-[4/5]"}`}
                  >
                    <Image src={src} alt={`${name}, Villa Serena Marrakech, photo ${i + 2}`} fill sizes="(max-width: 1024px) 50vw, 33vw" className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            <h2 className="font-sans text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-4">{t("suites.amenities")}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 mb-12 border-t border-border">
              {amenities.map((a) => (
                <li key={a} className="flex items-center gap-3 border-b border-border py-3 font-sans text-sm text-foreground/85">
                  <span className="size-1.5 rotate-45 bg-villa-terracotta-light shrink-0" aria-hidden />
                  {a}
                </li>
              ))}
            </ul>

            <h2 className="font-sans text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-4">{t("suites.all_rooms_include")}</h2>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
              {includes.map((item) => (
                <li key={item} className="font-sans text-sm text-foreground/70">{item}</li>
              ))}
            </ul>
            <p className="font-sans text-sm text-muted-foreground">{t("suites.includes_note")}</p>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-28 bg-villa-ink text-white p-7">
              <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-villa-gold mb-4">
                {t(`suites.space_names.${room.space || "riad"}`)}
              </p>
              <dl className="space-y-3 font-sans text-sm">
                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <dt className="text-white/60">{t("suites.table.size")}</dt>
                  <dd className="font-serif text-lg text-villa-gold">{room.size}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <dt className="text-white/60">{t("suites.table.bed")}</dt>
                  <dd className="text-right text-white/90">{bedType}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <dt className="text-white/60">{t("suites.table.guests")}</dt>
                  <dd className="text-white/90">{room.maxGuests}</dd>
                </div>
              </dl>
              {idealFor && (
                <div className="mt-6">
                  <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-villa-gold mb-2">
                    {room.space === "independant" ? t("suites.ideal_for_m") : t("suites.ideal_for")}
                  </p>
                  <p className="font-serif text-lg leading-snug text-white first-letter:uppercase">{idealFor}</p>
                </div>
              )}
              <StarDivider className="my-6" />
              <p className="font-sans text-xs text-villa-sand-light leading-relaxed mb-5">{t("suites.whole_villa_note")}</p>
              <Link
                href="/reservation"
                className="block text-center px-6 py-3 bg-villa-terracotta hover:brightness-110 text-white font-sans text-xs tracking-[0.15em] uppercase transition"
              >
                {t("nav.book")}
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {otherRooms.length > 0 && (
        <section className="bg-villa-cream py-16 lg:py-20 border-t border-border">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="font-serif text-3xl text-villa-ink mb-8">{t("suites.more_rooms")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {otherRooms.map((r) => (
                <SuiteCard key={r.id} room={r} isEn={isEn} soonLabel={t("suites.photos_soon")} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
