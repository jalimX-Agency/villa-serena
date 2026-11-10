import { getSiteImages, type SiteImageKey } from "@/lib/site-images";
import { PhotoSoon } from "@/components/PhotoSoon";
import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const MOSAIC: { key: string; slot: SiteImageKey; href: string; span: string }[] = [
  { key: "jardin", slot: "home.mosaic.jardin", href: "/services#activites", span: "col-span-2 aspect-[4/3] lg:aspect-auto lg:row-span-2" },
  { key: "sport", slot: "home.mosaic.sport", href: "/services#bien-etre", span: "aspect-[3/4] lg:aspect-auto" },
  { key: "hammam", slot: "home.mosaic.hammam", href: "/services#bien-etre", span: "aspect-[3/4] lg:aspect-auto" },
  { key: "ferme", slot: "home.mosaic.ferme", href: "/services#activites", span: "aspect-[3/4] lg:aspect-auto" },
  { key: "potager", slot: "home.mosaic.potager", href: "/services#restauration", span: "aspect-[3/4] lg:aspect-auto" },
];

export async function ExperiencesBand() {
  const t = await getTranslations();
  const locale = await getLocale();
  const img = await getSiteImages(locale);
  const band = img["home.band"];

  return (
    <section className="relative bg-villa-ink py-24 lg:py-36 overflow-hidden">
      <div className="absolute inset-0">
        {band.src && <Image src={band.src} alt={band.alt} fill sizes="100vw" className="object-cover opacity-20" />}
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
            <p className="font-sans text-white/70 leading-relaxed mb-5 whitespace-pre-line">{t("home.experiences_sub")}</p>
            <Link
              href="/services"
              className="font-sans text-xs tracking-[0.15em] uppercase text-white border-b border-white/40 pb-1 hover:border-villa-gold hover:text-villa-gold transition-colors"
            >
              {t("services.page_title")}
            </Link>
          </div>
        </div>

        {/* M11: five-photo montage (gym, hammam, mini farm, garden as the large tile, kitchen garden).
            Photos come from « Photos du site »; a missing one shows the emblem until the villa sends it. */}
        <div className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 lg:gap-5 lg:h-[38rem]">
          {MOSAIC.map((tile, i) => {
            const photo = img[tile.slot];
            const title = t(`home.mosaic.${tile.key}`);
            return (
              <Link key={tile.key} href={tile.href} className={`group relative block overflow-hidden ${tile.span}`}>
                {photo.src ? (
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes={tile.key === "jardin" ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, 50vw"}
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                  />
                ) : (
                  <PhotoSoon label={t("suites.photos_soon")} className="absolute inset-0 border border-white/10" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                <span className="absolute left-4 top-4 font-sans text-[11px] tabular-nums tracking-[0.25em] text-white/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`absolute inset-x-4 bottom-4 font-serif text-white leading-tight ${tile.key === "jardin" ? "text-3xl lg:text-4xl" : "text-lg sm:text-xl lg:text-2xl"}`}>
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
