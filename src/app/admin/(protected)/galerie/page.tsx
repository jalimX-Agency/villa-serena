import { db } from "@/lib/db";
import { GalleryManager } from "@/components/admin/GalleryManager";

export const dynamic = "force-dynamic";

export default async function AdminGaleriePage() {
  const images = await db.galleryImage.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return (
    <div>
      <h1 className="font-serif text-2xl text-foreground mb-1">Galerie</h1>
      <p className="font-sans text-sm text-muted-foreground mb-8">
        {images.length} photo{images.length !== 1 ? "s" : ""}. Les images sont redimensionnées et compressées
        automatiquement.
      </p>
      <GalleryManager images={images} />
    </div>
  );
}
