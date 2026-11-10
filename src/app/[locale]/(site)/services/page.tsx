import { filledSlides, getSiteImages, type SiteImageKey } from "@/lib/site-images";
import { PhotoCarousel } from "@/components/PhotoCarousel";
import { PhotoSoon } from "@/components/PhotoSoon";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { PageIntro } from "@/components/PageIntro";
import { AnchorBar } from "@/components/AnchorBar";
import { FactsBand } from "@/components/FactsBand";
import { StarDivider } from "@/components/StarDivider";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({ locale, page: "services", path: "/services" });
}

/** Single Services page with anchors #restauration, #bien-etre, #activites (client brief ch. 08). */
export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const p = (k: string) => t(`servicesPage.${k}`);
  const img = await getSiteImages(locale);
  const resto = t.raw("servicesPage.restauration.paragraphs") as string[];
  const wellness = t.raw("servicesPage.bienetre.items") as [string, string][];
  const activities = t.raw("servicesPage.activites.paragraphs") as string[];
  const excursions = t.raw("servicesPage.activites.excursions") as { intro: string; items: string[]; cooking: string };
  const carousel = (region: string) => ({ prev: t("carousel.prev"), next: t("carousel.next"), slide: t.raw("carousel.slide") as string, region });
  const diningSlides = filledSlides(img, ["services.restauration", "services.restauration2", "services.restauration3", "services.restauration4", "services.restauration5", "services.restauration6"]);
  // M39: one card and one photo per wellness service, in the order of the texts.
  const wellnessPhotos: SiteImageKey[] = ["services.hammam", "services.massage", "services.yoga", "services.sport"];

  return (
    <>
      <PageIntro eyebrow={p("eyebrow")} title={t("services.h1")} lead={p("lead")} />

      <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-14">
        <div className="bg-villa-sand border-l-2 border-villa-terracotta-light px-6 py-5 lg:px-8 lg:py-6 max-w-4xl">
          <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-villa-terracotta mb-2">{p("serenity_title")}</p>
          <p className="font-sans text-sm lg:text-[0.95rem] leading-relaxed text-foreground/80">{p("serenity")}</p>
        </div>
      </section>

      <AnchorBar
        items={[
          { id: "restauration", label: t("servicesPage.anchors.restauration") },
          { id: "bien-etre", label: t("servicesPage.anchors.bien-etre") },
          { id: "activites", label: t("servicesPage.anchors.activites") },
        ]}
      />

      {/* Restauration */}
      <section id="restauration" className="scroll-mt-40 mx-auto max-w-7xl px-6 lg:px-8 py-20 lg:py-28 grid gap-10 lg:grid-cols-12 lg:gap-16 items-start">
        {/* M36: carousel from breakfast to dinner; photos added from « Photos du site ». */}
        <PhotoCarousel
          className="lg:col-span-6"
          slides={diningSlides}
          frameClassName="aspect-[4/5] rounded-t-full"
          sizes="(min-width:1024px) 45vw, 100vw"
          labels={carousel(t("carousel.dining"))}
        />
        <div className="lg:col-span-6">
          <h2 className="font-serif text-4xl lg:text-5xl text-villa-ink">{p("restauration.title")}</h2>
          <StarDivider className="my-6 max-w-[10rem]" tone="terracotta" />
          <div className="space-y-4 font-sans text-foreground/80 leading-relaxed">
            {resto.map((para) => <p key={para.slice(0, 24)}>{para}</p>)}
          </div>
          <div className="mt-8"><FactsBand items={t.raw("servicesPage.restauration.stats") as string[]} /></div>
        </div>
      </section>

      {/* Bien-être */}
      <section id="bien-etre" className="scroll-mt-40 bg-villa-ink text-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="font-serif text-4xl lg:text-5xl text-white">{p("bienetre.title")}</h2>
            <StarDivider className="my-6 max-w-[10rem]" />
            <p className="font-sans text-villa-sand-light leading-relaxed">{p("bienetre.intro")}</p>
          </div>
          {/* M39: four cards, photo above the text: 4 across on desktop, 2 × 2 on tablet, 1 on mobile. */}
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {wellness.map(([title, body], i) => {
              const photo = img[wellnessPhotos[i]];
              return (
                <li key={title}>
                  {photo?.src ? (
                    <div className={`relative aspect-[3/4] overflow-hidden ${i % 2 === 0 ? "rounded-t-full" : ""}`}>
                      <Image src={photo.src} alt={photo.alt} fill sizes="(min-width:1024px) 22vw, (min-width:640px) 45vw, 100vw" className="object-cover" />
                    </div>
                  ) : (
                    <PhotoSoon label={t("suites.photos_soon")} className={`aspect-[3/4] border border-white/10 ${i % 2 === 0 ? "rounded-t-full" : ""}`} />
                  )}
                  <p className="mt-5 font-sans text-[11px] tabular-nums tracking-[0.25em] text-villa-gold">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-1 font-serif text-2xl lg:text-[1.75rem] text-white">{title}</h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-villa-sand-light">{body}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Activités */}
      <section id="activites" className="scroll-mt-40 mx-auto max-w-7xl px-6 lg:px-8 py-20 lg:py-28 grid gap-10 lg:grid-cols-12 lg:gap-16 items-start">
        <div className="lg:col-span-6 lg:order-2 grid grid-cols-2 gap-4 items-end">
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-muted">
            <Image src={img["services.petanque"].src} alt={img["services.petanque"].alt} fill sizes="(min-width:1024px) 22vw, 50vw" className="object-cover" />
          </div>
          <div className="relative aspect-[4/5] overflow-hidden bg-muted">
            <Image src={img["services.jeux"].src} alt={img["services.jeux"].alt} fill sizes="(min-width:1024px) 22vw, 50vw" className="object-cover" />
          </div>
        </div>
        <div className="lg:col-span-6 lg:order-1">
          <h2 className="font-serif text-4xl lg:text-5xl text-villa-ink">{p("activites.title")}</h2>
          <StarDivider className="my-6 max-w-[10rem]" tone="terracotta" />
          <div className="space-y-4 font-sans text-foreground/80 leading-relaxed">
            {activities.map((para) => <p key={para.slice(0, 24)}>{para}</p>)}
            {/* M41: excursions as a list, then the cooking class at the villa. */}
            <p>{excursions.intro}</p>
            <ul className="space-y-2 pl-1">
              {excursions.items.map((it) => (
                <li key={it} className="relative pl-5 before:absolute before:left-0 before:top-[0.65em] before:size-1.5 before:rotate-45 before:bg-villa-terracotta-light">
                  {it}
                </li>
              ))}
            </ul>
            <p>{excursions.cooking}</p>
          </div>
          <div className="mt-8"><FactsBand items={t.raw("servicesPage.activites.stats") as string[]} /></div>
        </div>
      </section>

      <section className="bg-villa-terracotta text-white py-16 lg:py-20 text-center px-6">
        <h2 className="font-serif text-3xl lg:text-4xl text-white">{t("home.cta_title")}</h2>
        <p className="mt-4 mx-auto max-w-2xl font-sans text-white/90 leading-relaxed whitespace-pre-line">{t("home.cta_body")}</p>
        <Link href="/reservation" className="mt-8 inline-flex px-8 py-3.5 bg-white text-villa-terracotta font-sans text-xs tracking-[0.15em] uppercase hover:bg-villa-cream transition-colors">
          {t("nav.book")}
        </Link>
      </section>
    </>
  );
}
