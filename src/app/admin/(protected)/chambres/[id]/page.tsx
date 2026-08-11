import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { RoomEditForm } from "@/components/admin/RoomEditForm";

export default async function AdminRoomEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const room = await db.room.findUnique({ where: { id } });
  if (!room) notFound();

  return (
    <div>
      <Link href="/admin/chambres" className="font-sans text-xs text-villa-terracotta hover:underline">
        ← Retour aux chambres
      </Link>
      <h1 className="font-serif text-2xl text-foreground mt-3 mb-1">{room.name}</h1>
      <p className="font-sans text-sm text-muted-foreground mb-8">
        Le nom, les photos et la description longue se modifient encore par script (contactez le développeur) —
        ce formulaire couvre le prix, les infos rapides et l&apos;ordre d&apos;affichage.
      </p>
      <RoomEditForm room={room} />
    </div>
  );
}
