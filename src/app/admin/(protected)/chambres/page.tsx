import Image from "next/image";
import Link from "next/link";
import { BedDouble, Maximize2, Users, Images, Star } from "lucide-react";
import { db } from "@/lib/db";
import { Card, PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminChambresPage() {
  const rooms = await db.room.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader title="Chambres" description={`${rooms.length} suites — cliquez pour modifier les photos et les textes.`} />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {rooms.map((room) => {
          const photos = room.images.split(",").filter(Boolean).length;
          return (
            <Link key={room.id} href={`/admin/chambres/${room.id}`} className="group">
              <Card className="overflow-hidden transition group-hover:shadow-md group-hover:ring-stone-300">
                <div className="relative aspect-[4/3] bg-stone-100">
                  {room.image && (
                    <Image src={room.image} alt={room.name} fill sizes="(min-width:1280px) 33vw, 50vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                  )}
                  {room.featured && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-stone-800">
                      <Star className="size-3 fill-villa-gold text-villa-gold" /> En avant
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-serif text-xl text-stone-900">{room.name}</p>
                  <p className="truncate text-sm text-stone-500">{room.subtitle}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500">
                    {room.size && <span className="flex items-center gap-1"><Maximize2 className="size-3.5" /> {room.size}</span>}
                    <span className="flex items-center gap-1"><Users className="size-3.5" /> {room.maxGuests}</span>
                    {room.bedType && <span className="flex items-center gap-1"><BedDouble className="size-3.5" /> {room.bedType}</span>}
                    <span className="flex items-center gap-1"><Images className="size-3.5" /> {photos}</span>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
