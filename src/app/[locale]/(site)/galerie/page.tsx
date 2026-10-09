import { setRequestLocale, getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { GalleryGrid } from "@/components/GalleryGrid";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  return { title: t("page_title"), description: t("page_sub"), alternates: { canonical: `/${locale}/galerie` } };
}

export default async function GaleriePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("gallery");
  const images = await db.galleryImage
    .findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] })
    .catch(() => []);

  return (
    <div className="pt-32 pb-24 px-6 mx-auto max-w-7xl">
      <div className="text-center mb-12">
        <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-villa-terracotta mb-4">Villa Serena</p>
        <h1 className="font-serif text-4xl lg:text-5xl text-villa-terracotta mb-5">{t("page_title")}</h1>
        <p className="font-sans text-muted-foreground max-w-xl mx-auto">{t("page_sub")}</p>
      </div>
      {images.length === 0 ? (
        <p className="text-center font-sans text-muted-foreground">{t("empty")}</p>
      ) : (
        <GalleryGrid
          items={images.map((i) => ({ id: i.id, url: i.url, alt: i.alt, altEn: i.altEn, category: i.category }))}
        />
      )}
    </div>
  );
}
