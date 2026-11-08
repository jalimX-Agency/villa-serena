import { getSiteImages, type SiteImageKey } from "@/lib/site-images";
import { pageMetadata } from "@/lib/seo";
import { media } from "@/lib/media";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FriseIntro } from "@/components/FriseIntro";
import { StarDivider } from "@/components/StarDivider";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({ locale, page: "villa", path: "/la-villa" });
}

type Block = { key: string; title: string; body: string };


const MAP_SRC =
  "https://www.google.com/maps?q=" + encodeURIComponent("Route de l'Ourika km 17, Sidi Bouzguia, Marrakech") + "&z=13&output=embed";

export default async function VillaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const blocks = t.raw("villa.blocks") as Block[];
  const distances = t.raw("villa.distances") as [string, string][];
  // One photo per block, replaceable from /admin/photos. An empty slot shows the emblem.
  const img = await getSiteImages(locale);
  const blockImage = (key: string) => {
    const p = img[`villa.${key}` as SiteImageKey];
    return p?.src ? p : undefined;
  };

  return (
    <>
      <div className="relative h-[70vh] min-h-[460px] overflow-hidden bg-villa-ink">
        <Image src={img["villa.hero"].src} alt={img["villa.hero"].alt || t("villa.h1")} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-villa-ink/0 via-villa-ink/20 to-villa-ink/60" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 lg:px-8 pb-12">
          <div className="mx-auto max-w-7xl w-full">
            <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-villa-gold mb-4">{t("villa.page_title")}</p>
            <h1 className="font-serif font-light text-white text-[clamp(2.4rem,6vw,4.75rem)] leading-[1.02] max-w-4xl text-balance">
              {t("villa.h1")}
            </h1>
            <p className="mt-4 font-sans text-white/90 max-w-xl">{t("villa.page_sub")}</p>
          </div>
        </div>
      </div>

      <FriseIntro eyebrow={t("villa.ambiance_label")} text={t("villa.intro")} />

      {/* Alternating blocks: one H2 and one photo each. */}
      <div className="py-16 lg:py-24 space-y-16 lg:space-y-28">
        {blocks.map((b, i) => {
          const photo = blockImage(b.key);
          const flip = i % 2 === 1;
          return (
            <section key={b.key} className="mx-auto max-w-7xl px-6 lg:px-8 grid gap-8 lg:grid-cols-12 lg:gap-14 items-center">
              <div className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
                {photo ? (
                  <div className={`relative aspect-[4/3] overflow-hidden bg-muted ${i % 3 === 0 ? "rounded-t-[12rem]" : ""}`}>
                    <Image src={photo.src} alt={photo.alt} fill sizes="(min-width:1024px) 58vw, 100vw" className="object-cover" />
                  </div>
                ) : (
                  <div className="relative aspect-[4/3] bg-villa-ink flex items-center justify-center rounded-t-[12rem]">
                    <Image
                      src={media("/logo-serena-emblem.png")}
                      alt=""
                      width={419}
                      height={539}
                      className="h-1/2 w-auto opacity-90"
                    />
                  </div>
                )}
              </div>
              <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
                <span className="font-sans text-[11px] tabular-nums tracking-[0.25em] text-villa-terracotta">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-3 font-serif text-3xl lg:text-[2.6rem] leading-tight text-villa-ink text-balance">{b.title}</h2>
                <StarDivider className="my-6 max-w-[10rem]" tone="terracotta" />
                <p className="font-sans text-foreground/80 leading-relaxed">{b.body}</p>
              </div>
            </section>
          );
        })}
      </div>

      {/* Location: travel times + map */}
      <section className="bg-villa-ink text-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-serif text-3xl lg:text-[2.6rem] leading-tight text-white">{t("villa.situation_title")}</h2>
            <p className="mt-5 font-sans text-villa-sand-light leading-relaxed">{t("villa.situation_body")}</p>
            <table className="mt-8 w-full text-left">
              <thead>
                <tr className="border-b border-villa-gold/40">
                  <th className="py-3 font-sans text-[11px] tracking-[0.2em] uppercase font-normal text-villa-gold">{t("villa.situation_from")}</th>
                  <th className="py-3 font-sans text-[11px] tracking-[0.2em] uppercase font-normal text-villa-gold text-right">{t("villa.situation_time")}</th>
                </tr>
              </thead>
              <tbody>
                {distances.map(([place, time]) => (
                  <tr key={place} className="border-b border-white/10">
                    <td className="py-3 pr-4 font-sans text-sm text-white/90">{place}</td>
                    <td className="py-3 font-serif text-lg text-villa-gold text-right whitespace-nowrap">{time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="relative min-h-[360px] overflow-hidden border border-white/10">
            <iframe
              title={t("villa.situation_title")}
              src={MAP_SRC}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full grayscale-[30%]"
            />
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-2xl px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-villa-ink mb-4">{t("villa.cta_title")}</h2>
          <p className="font-sans text-foreground/75 leading-relaxed mb-8">{t("villa.cta_body")}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/suites"
              className="inline-flex items-center px-8 py-3.5 border border-villa-ink/25 hover:border-villa-terracotta hover:text-villa-terracotta text-villa-ink font-sans text-xs tracking-[0.15em] uppercase transition-colors"
            >
              {t("villa.cta_suites")}
            </Link>
            <Link
              href="/reservation"
              className="inline-flex items-center px-8 py-3.5 bg-villa-terracotta hover:brightness-110 text-white font-sans text-xs tracking-[0.15em] uppercase transition"
            >
              {t("nav.book")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
