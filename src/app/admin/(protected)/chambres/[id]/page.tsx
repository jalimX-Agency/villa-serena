import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { RoomEditForm } from "@/components/admin/RoomEditForm";
import { PageHeader, btn } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminRoomEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const room = await db.room.findUnique({ where: { id } });
  if (!room) notFound();

  return (
    <div>
      <Link href="/admin/chambres" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900">
        <ArrowLeft className="size-4" /> Chambres
      </Link>
      <div className="mt-4">
        <PageHeader
          title={room.name}
          description="Photos, textes et informations affichés sur le site."
          actions={
            <a href={`/fr/suites/${room.slug}`} target="_blank" rel="noreferrer" className={btn.secondary}>
              <ExternalLink className="size-4" /> Voir sur le site
            </a>
          }
        />
      </div>
      <RoomEditForm room={room} />
    </div>
  );
}
