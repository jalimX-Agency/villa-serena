import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Room } from "@prisma/client";
import { Link } from "@/i18n/navigation";
import { media } from "@/lib/media";

/** Suite card used on the list and detail pages. A suite without photos yet shows the emblem. */
export function SuiteCard({ room, isEn, soonLabel }: { room: Room; isEn: boolean; soonLabel: string }) {
  const name = isEn && room.nameEn ? room.nameEn : room.name;
  const subtitle = isEn && room.subtitleEn ? room.subtitleEn : room.subtitle;
  const bed = isEn && room.bedTypeEn ? room.bedTypeEn : room.bedType;

  return (
    <Link href={`/suites/${room.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-villa-ink">
        {room.image ? (
          <Image
            src={room.image}
            alt={`${name}, Villa Serena Marrakech`}
            fill
            sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 100vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <Image src={media("/logo-serena-emblem.png")} alt="" width={419} height={539} className="h-28 w-auto opacity-90" />
            <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-villa-gold">{soonLabel}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-villa-ink/70 via-transparent to-transparent" />
        <ArrowUpRight className="absolute right-4 top-4 size-4 text-white/80 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        <div className="absolute inset-x-5 bottom-5">
          <h3 className="font-serif text-3xl text-white">{name}</h3>
          <p className="mt-1 font-sans text-xs text-white/80">
            {room.size} · {bed}
          </p>
        </div>
      </div>
      <span
        className="block h-1 w-12 transition-all duration-500 group-hover:w-full"
        style={{ backgroundColor: room.color || "var(--villa-terracotta)" }}
        aria-hidden
      />
      <p className="mt-3 font-sans text-sm text-muted-foreground first-letter:uppercase">{subtitle}</p>
    </Link>
  );
}
