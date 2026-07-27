import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Room } from "@prisma/client";
import type { useTranslations } from "next-intl";

export function RoomCard({
  room,
  locale,
  t,
  index,
}: {
  room: Room;
  locale: string;
  t: Awaited<ReturnType<typeof useTranslations>>;
  index: number;
}) {
  const isEn = locale === "en";
  const name = isEn && room.nameEn ? room.nameEn : room.name;
  const subtitle = isEn && room.subtitleEn ? room.subtitleEn : room.subtitle;

  return (
    <Link href="/suites" className="group block">
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
        <span
          className="absolute top-4 left-4 size-2.5 rounded-full border border-white/70"
          style={{ backgroundColor: room.color || undefined }}
          aria-hidden
        />
      </div>
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <h3 className="font-serif text-xl text-foreground group-hover:text-villa-terracotta transition-colors">
            {name}
          </h3>
          <p className="font-sans text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        <p className="font-sans text-sm text-villa-terracotta whitespace-nowrap tabular-nums">
          {t("suites.from")} {room.price}€
        </p>
      </div>
    </Link>
  );
}
