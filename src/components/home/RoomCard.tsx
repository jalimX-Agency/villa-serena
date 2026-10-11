import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Room } from "@prisma/client";

export function RoomCard({
  room,
  locale,
  index,
}: {
  room: Room;
  locale: string;
  index: number;
}) {
  const isEn = locale === "en";
  const name = isEn && room.nameEn ? room.nameEn : room.name;
  const subtitle = isEn && room.subtitleEn ? room.subtitleEn : room.subtitle;

  return (
    <Link href={`/suites/${room.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden mb-4">
        {room.image && (
          <Image
            src={room.image}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={index === 0}
          />
        )}
      </div>
      <span
        className="block h-1 w-12 -mt-4 mb-4 transition-all duration-500 group-hover:w-full"
        style={{ backgroundColor: room.color || "var(--villa-terracotta)" }}
        aria-hidden
      />
      <h3 className="font-serif text-2xl text-foreground group-hover:text-villa-terracotta transition-colors">
        {name}
      </h3>
      <p className="font-sans text-xs text-muted-foreground mt-0.5">{subtitle}</p>
    </Link>
  );
}
