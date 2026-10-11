import { db } from "@/lib/db";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminGaleriePage() {
  const images = await db.galleryImage.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return (
    <div>
      <PageHeader
        title="Galerie"
        description="Photos de la page Galerie du site. Elles sont redimensionnées et compressées automatiquement."
      />
      <GalleryManager images={images} />
    </div>
  );
}
