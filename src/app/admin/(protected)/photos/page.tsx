import { db } from "@/lib/db";
import { SITE_IMAGE_SLOTS, type SiteImageKey } from "@/lib/site-images";
import { SiteImagesManager, type SlotView } from "@/components/admin/SiteImagesManager";
import { PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminPhotosPage() {
  const rows = await db.siteImage.findMany();
  const byKey = new Map(rows.map((r) => [r.key, r]));
  const slots: SlotView[] = (Object.keys(SITE_IMAGE_SLOTS) as SiteImageKey[]).map((key) => {
    const def = SITE_IMAGE_SLOTS[key];
    const row = byKey.get(key);
    return {
      key,
      group: def.group,
      label: def.label,
      defaultSrc: def.src,
      src: row?.url || def.src,
      alt: row?.alt || def.alt,
      altEn: row?.altEn || def.altEn,
      customized: Boolean(row),
    };
  });

  return (
    <div>
      <PageHeader
        title="Photos du site"
        description="Chaque photo fixe des pages, par emplacement. Remplacez-la quand vous voulez : le site est mis à jour aussitôt. Format paysage conseillé, au moins 1 600 px de large."
      />
      <SiteImagesManager slots={slots} />
    </div>
  );
}
