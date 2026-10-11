"use client";
import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Upload, Loader2, Trash2, Star, Check } from "lucide-react";
import type { GalleryImage } from "@prisma/client";
import { uploadGalleryImage, updateGalleryImage, deleteGalleryImage } from "@/lib/actions/admin-gallery";
import { compressImage } from "@/lib/compress-image";
import { Card, field } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "rooms", label: "Suites" },
  { value: "garden", label: "Jardin & piscine" },
  { value: "dining", label: "Restauration" },
  { value: "wellness", label: "Bien-être" },
];

export function GalleryManager({ images }: { images: GalleryImage[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState("garden");
  const [filter, setFilter] = useState("all");
  const [progress, setProgress] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [drag, setDrag] = useState(false);

  async function onFiles(files: FileList | null) {
    const list = Array.from(files ?? []).filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    const errs: string[] = [];
    for (let i = 0; i < list.length; i++) {
      setProgress(`Envoi ${i + 1} / ${list.length}…`);
      try {
        const fd = new FormData();
        fd.set("file", await compressImage(list[i]));
        fd.set("category", category);
        const res = await uploadGalleryImage(fd);
        if (!res.ok) errs.push(`${list[i].name} : ${res.error}`);
      } catch (e) {
        errs.push(`${list[i].name} : ${e instanceof Error ? e.message : "erreur"}`);
      }
    }
    setErrors(errs);
    setProgress(null);
    if (fileRef.current) fileRef.current.value = "";
    router.refresh();
  }

  const shown = filter === "all" ? images : images.filter((i) => i.category === filter);

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="sm:w-56">
            <label className="mb-1.5 block text-xs font-medium text-stone-600">Catégorie des nouvelles photos</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={field}>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <button
            type="button"
            disabled={!!progress}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); onFiles(e.dataTransfer.files); }}
            className={cn(
              "flex flex-1 items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-6 text-sm text-stone-500 transition",
              drag ? "border-villa-terracotta bg-villa-terracotta/5" : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
            )}
          >
            {progress ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}
            {progress ?? "Glissez vos photos ici ou cliquez pour choisir"}
          </button>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => onFiles(e.target.files)} />
        </div>
        {errors.length > 0 && (
          <ul className="mt-3 list-disc pl-5 text-xs text-red-600">{errors.map((e) => <li key={e}>{e}</li>)}</ul>
        )}
      </Card>

      <div className="flex gap-1 overflow-x-auto rounded-xl bg-stone-100 p-1 w-fit max-w-full">
        {[{ value: "all", label: "Toutes" }, ...CATEGORIES].map((c) => {
          const n = c.value === "all" ? images.length : images.filter((i) => i.category === c.value).length;
          return (
            <button
              key={c.value}
              type="button"
              onClick={() => setFilter(c.value)}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition",
                filter === c.value ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-800"
              )}
            >
              {c.label} <span className="text-[11px] text-stone-400">{n}</span>
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <p className="py-10 text-center text-sm text-stone-400">Aucune photo dans cette catégorie.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((img) => <GalleryItem key={img.id} img={img} />)}
        </div>
      )}
    </div>
  );
}

function GalleryItem({ img }: { img: GalleryImage }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  return (
    <Card className="overflow-hidden">
      <form
        action={(fd) =>
          start(async () => {
            await updateGalleryImage(img.id, fd);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            router.refresh();
          })
        }
      >
        <div className="relative aspect-[4/3] bg-stone-100">
          <Image src={img.url} alt={img.alt || ""} fill sizes="(min-width:1280px) 25vw, 50vw" className="object-cover" />
          {img.featured && (
            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-stone-800">
              <Star className="size-3 fill-villa-gold text-villa-gold" /> En avant
            </span>
          )}
        </div>
        <div className="space-y-2 p-4">
          <input name="alt" defaultValue={img.alt} placeholder="Description (FR) — utile pour le SEO" className={field} />
          <input name="altEn" defaultValue={img.altEn} placeholder="Description (EN)" className={field} />
          <div className="flex gap-2">
            <select name="category" defaultValue={img.category} className={field}>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <label className="flex items-center gap-1.5 whitespace-nowrap text-xs text-stone-600">
              <input type="checkbox" name="featured" defaultChecked={img.featured} className="accent-villa-terracotta" /> En avant
            </label>
          </div>
          <div className="flex items-center justify-between pt-1">
            <button type="submit" disabled={pending} className="inline-flex items-center gap-1.5 text-sm font-medium text-villa-terracotta hover:underline disabled:opacity-50">
              {saved ? <><Check className="size-4" /> Enregistré</> : "Enregistrer"}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                if (!confirm("Supprimer cette photo définitivement ?")) return;
                start(async () => { await deleteGalleryImage(img.id); router.refresh(); });
              }}
              className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600"
              aria-label="Supprimer"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </form>
    </Card>
  );
}
