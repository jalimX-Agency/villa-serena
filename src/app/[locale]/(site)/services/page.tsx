import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { media } from "@/lib/media";
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
  const resto = t.raw("servicesPage.restauration.paragraphs") as string[];
  const wellness = t.raw("servicesPage.bienetre.items") as [string, string][];
  const activities = t.raw("servicesPage.activites.paragraphs") as string[];

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
        <div className="lg:col-span-6 relative aspect-[4/5] overflow-hidden rounded-t-full bg-muted">
          <Image src={media("/exp-cuisine.jpg")} alt="Repas servi à la villa, cuisine marocaine préparée sur place" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
        </div>
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
        <div className="mx-auto max-w-7xl px-6 lg:px-8 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="font-serif text-4xl lg:text-5xl text-white">{p("bienetre.title")}</h2>
            <StarDivider className="my-6 max-w-[10rem]" />
            <p className="font-sans text-villa-sand-light leading-relaxed">{p("bienetre.intro")}</p>
            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-full">
                <Image src={media("/exp-hammam.jpg")} alt="Hammam traditionnel privé de la villa" fill sizes="25vw" className="object-cover" />
              </div>
              <div className="relative aspect-[3/4] overflow-hidden mt-10">
                <Image src={media("/exp-fitness.jpg")} alt="Salle de sport de la villa : tapis de course, rameur et poids" fill sizes="25vw" className="object-cover" />
              </div>
            </div>
          </div>
          <ul className="lg:col-span-7 border-t border-white/15">
            {wellness.map(([title, body], i) => (
              <li key={title} className="grid grid-cols-[auto_1fr] gap-5 border-b border-white/15 py-7">
                <span className="font-sans text-[11px] tabular-nums tracking-[0.25em] text-villa-gold pt-2">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-serif text-2xl lg:text-3xl text-white">{title}</h3>
                  <p className="mt-2 font-sans text-sm lg:text-[0.95rem] leading-relaxed text-villa-sand-light">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Activités */}
      <section id="activites" className="scroll-mt-40 mx-auto max-w-7xl px-6 lg:px-8 py-20 lg:py-28 grid gap-10 lg:grid-cols-12 lg:gap-16 items-start">
        <div className="lg:col-span-6 lg:order-2 grid grid-cols-2 gap-4 items-end">
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-muted">
            <Image src={media("/exp-petanque.jpg")} alt="Terrain de pétanque dans le jardin d'oliviers de la villa" fill sizes="(min-width:1024px) 22vw, 50vw" className="object-cover" />
          </div>
          <div className="relative aspect-[4/5] overflow-hidden bg-muted">
            <Image src={media("/exp-badminton.jpg")} alt="Espace badminton et ping-pong de la villa" fill sizes="(min-width:1024px) 22vw, 50vw" className="object-cover" />
          </div>
        </div>
        <div className="lg:col-span-6 lg:order-1">
          <h2 className="font-serif text-4xl lg:text-5xl text-villa-ink">{p("activites.title")}</h2>
          <StarDivider className="my-6 max-w-[10rem]" tone="terracotta" />
          <div className="space-y-4 font-sans text-foreground/80 leading-relaxed">
            {activities.map((para) => <p key={para.slice(0, 24)}>{para}</p>)}
          </div>
          <div className="mt-8"><FactsBand items={t.raw("servicesPage.activites.stats") as string[]} /></div>
        </div>
      </section>

      <section className="bg-villa-terracotta text-white py-16 lg:py-20 text-center px-6">
        <h2 className="font-serif text-3xl lg:text-4xl text-white">{t("home.cta_title")}</h2>
        <p className="mt-4 mx-auto max-w-2xl font-sans text-white/90 leading-relaxed">{t("home.cta_body")}</p>
        <Link href="/reservation" className="mt-8 inline-flex px-8 py-3.5 bg-white text-villa-terracotta font-sans text-xs tracking-[0.15em] uppercase hover:bg-villa-cream transition-colors">
          {t("nav.book")}
        </Link>
      </section>
    </>
  );
}
