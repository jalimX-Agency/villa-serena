import { getTranslations, setRequestLocale } from "next-intl/server";
import { db } from "@/lib/db";
import { pageMetadata } from "@/lib/seo";
import { PageIntro } from "@/components/PageIntro";
import { SuiteCard } from "@/components/SuiteCard";
import { StarDivider } from "@/components/StarDivider";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({ locale, page: "suites", path: "/suites" });
}



export default async function SuitesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const isEn = locale === "en";
  const rooms = await db.room.findMany({ orderBy: { order: "asc" } });
  const includes = t.raw("suites.includes") as string[];
  const riad = rooms.filter((r) => r.space === "riad");
  const pavilionAndStudio = rooms.filter((r) => r.space === "pavillon" || r.space === "independant");

  return (
    <>
      <PageIntro eyebrow={t("suites.page_title")} title={t("suites.h1")} lead={t("suites.page_sub")} body={t("suites.intro")} alignTop />

      {/* The riad, then the pavilion and the Studio on one row (M31). */}
      <div className="pb-8 space-y-20 lg:space-y-28">
        {riad.length > 0 && (
          <section className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-4 lg:grid-cols-12 lg:items-end mb-8 lg:mb-10">
              <div className="lg:col-span-6">
                <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-villa-terracotta mb-3">{t("suites.spaces.riad.label")}</p>
                <h2 className="font-serif text-3xl lg:text-[2.6rem] leading-tight text-villa-ink">{t("suites.spaces.riad.title")}</h2>
              </div>
              <p className="lg:col-span-5 lg:col-start-8 font-sans text-muted-foreground leading-relaxed">{t("suites.spaces.riad.body")}</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {riad.map((room) => (
                <SuiteCard key={room.id} room={room} isEn={isEn} soonLabel={t("suites.photos_soon")} />
              ))}
            </div>
          </section>
        )}
        {pavilionAndStudio.length > 0 && (
          <section className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="mb-8 lg:mb-10 font-serif text-3xl lg:text-[2.6rem] leading-tight text-villa-ink">{t("suites.spaces.pavillon_studio.title")}</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {pavilionAndStudio.map((room) => (
                <SuiteCard
                  key={room.id}
                  room={room}
                  isEn={isEn}
                  soonLabel={t("suites.photos_soon")}
                  eyebrow={t(room.space === "independant" ? "suites.spaces.pavillon_studio.independant" : "suites.spaces.pavillon_studio.pavillon")}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Bed allocation table */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-20 lg:py-28">
        <h2 className="font-serif text-3xl lg:text-[2.6rem] text-villa-ink mb-8">{t("suites.table_title")}</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b-2 border-villa-terracotta-light">
                {(["space", "unit", "size", "bed", "guests"] as const).map((k) => (
                  <th key={k} className={`py-3 pr-4 font-sans text-[11px] tracking-[0.18em] uppercase font-medium text-villa-ink ${k === "guests" ? "text-center pr-0" : ""}`}>
                    {t(`suites.table.${k}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r.id} className="border-b border-border">
                  <td className="py-3.5 pr-4 font-sans text-sm text-muted-foreground">{t(`suites.space_names.${r.space || "riad"}`)}</td>
                  <td className="py-3.5 pr-4">
                    <Link href={`/suites/${r.slug}`} className="font-serif text-lg text-villa-ink hover:text-villa-terracotta">
                      {isEn && r.nameEn ? r.nameEn : r.name}
                    </Link>
                  </td>
                  <td className="py-3.5 pr-4 font-sans text-sm text-foreground/85 whitespace-nowrap">{r.size}</td>
                  <td className="py-3.5 pr-4 font-sans text-sm text-foreground/85">{isEn && r.bedTypeEn ? r.bedTypeEn : r.bedType}</td>
                  <td className="py-3.5 font-sans text-sm text-foreground/85 text-center">{r.maxGuests}</td>
                </tr>
              ))}
              <tr>
                <td className="py-4 pr-4 font-sans text-[11px] tracking-[0.18em] uppercase text-villa-ink">{t("suites.table.total")}</td>
                <td className="py-4 pr-4 font-serif text-lg text-villa-ink" colSpan={3}>{t("suites.table.total_units")}</td>
                <td className="py-4 font-serif text-xl text-villa-terracotta text-center">
                  {rooms.reduce((n, r) => n + r.maxGuests, 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Included in every suite */}
      <section className="bg-villa-ink text-white py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl lg:text-4xl text-white">{t("suites.all_rooms_include")}</h2>
          <StarDivider className="mx-auto my-8 max-w-xs" />
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {includes.map((item) => (
              <li key={item} className="flex items-center gap-2.5 font-sans text-sm text-villa-sand-light">
                <span className="size-1.5 rotate-45 bg-villa-gold shrink-0" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 mx-auto max-w-2xl font-sans text-sm text-white/70 leading-relaxed whitespace-pre-line">{t("suites.includes_note")}</p>
        </div>
      </section>
    </>
  );
}
