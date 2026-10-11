import { PageIntro } from "@/components/PageIntro";
import { pageMetadata } from "@/lib/seo";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { GalleryGrid } from "@/components/GalleryGrid";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({ locale, page: "gallery", path: "/galerie" });
}

export default async function GaleriePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("gallery");
  const images = await db.galleryImage
    .findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] })
    .catch(() => []);

  return (
    <div className="pb-24">
      <PageIntro eyebrow={t("page_title")} title={t("h1")} lead={t("page_sub")} />
      <div className="px-6 lg:px-8 mx-auto max-w-7xl">
      {images.length === 0 ? (
        <p className="text-center font-sans text-muted-foreground">{t("empty")}</p>
      ) : (
        <GalleryGrid
          items={images.map((i) => ({ id: i.id, url: i.url, alt: i.alt, altEn: i.altEn, category: i.category }))}
        />
      )}
      </div>
    </div>
  );
}
