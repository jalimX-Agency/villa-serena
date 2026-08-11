import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";

export default async function AdminChambresPage() {
  const rooms = await db.room.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="font-serif text-2xl text-foreground mb-1">Chambres</h1>
      <p className="font-sans text-sm text-muted-foreground mb-8">
        {rooms.length} chambre{rooms.length !== 1 ? "s" : ""}.
      </p>

      <div className="bg-card border border-border divide-y divide-border">
        {rooms.map((room) => (
          <Link
            key={room.id}
            href={`/admin/chambres/${room.id}`}
            className="flex items-center gap-4 px-4 py-3 hover:bg-villa-cream transition-colors"
          >
            <div className="relative size-14 shrink-0 overflow-hidden bg-muted">
              {room.image && <Image src={room.image} alt={room.name} fill className="object-cover" />}
            </div>
            <div className="flex-1">
              <p className="font-sans text-sm text-foreground">{room.name}</p>
              <p className="font-sans text-xs text-muted-foreground">{room.subtitle}</p>
            </div>
            <p className="font-sans text-sm text-villa-terracotta tabular-nums whitespace-nowrap">
              {room.price}€ / nuit
            </p>
            <span className="font-sans text-xs text-muted-foreground">Modifier →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
