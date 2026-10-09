"use client";
import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type GalleryItem = { id: string; url: string; alt: string; altEn: string; category: string };

const CATS = ["all", "rooms", "garden", "dining", "wellness"] as const;

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const t = useTranslations("gallery");
  const locale = useLocale();
  const [cat, setCat] = useState<string>("all");
  const [open, setOpen] = useState<GalleryItem | null>(null);
  const shown = cat === "all" ? items : items.filter((i) => i.category === cat);
  const altOf = (i: GalleryItem) =>
    (locale === "en" ? i.altEn || i.alt : i.alt || i.altEn) || "Villa Serena Marrakech";

  return (
    <>
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              "px-4 py-2 font-sans text-xs tracking-[0.15em] uppercase border transition-colors",
              cat === c
                ? "bg-villa-terracotta text-white border-villa-terracotta"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {t(`cat_${c}`)}
          </button>
        ))}
      </div>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [&>*]:mb-4">
        {shown.map((img) => (
          <button
            key={img.id}
            onClick={() => setOpen(img)}
            className="block w-full break-inside-avoid overflow-hidden bg-muted"
          >
            <Image
              src={img.url}
              alt={altOf(img)}
              width={1200}
              height={900}
              sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
              className="w-full h-auto transition-transform duration-500 hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setOpen(null)}
        >
          <button aria-label="Close" className="absolute top-5 right-5 text-white">
            <X />
          </button>
          <Image
            src={open.url}
            alt={altOf(open)}
            width={2400}
            height={1600}
            className="max-h-[90vh] w-auto h-auto object-contain"
          />
        </div>
      )}
    </>
  );
}
