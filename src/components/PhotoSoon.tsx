import Image from "next/image";
import { media } from "@/lib/media";
import { cn } from "@/lib/utils";

/** Stand-in for a photo the villa has not sent yet: the emblem and « Photos à venir ». */
export function PhotoSoon({ label, className }: { label: string; className?: string }) {
  return (
    <div className={cn("relative flex flex-col items-center justify-center gap-3 bg-villa-ink", className)}>
      <Image src={media("/logo-serena-emblem.png")} alt={label} width={419} height={539} className="h-1/3 max-h-28 w-auto opacity-90" />
      <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-villa-gold">{label}</span>
    </div>
  );
}
