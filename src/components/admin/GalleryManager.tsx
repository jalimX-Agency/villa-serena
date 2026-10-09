"use client";
import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { GalleryImage } from "@prisma/client";
import { uploadGalleryImage, updateGalleryImage, deleteGalleryImage } from "@/lib/actions/admin-gallery";

const CATEGORIES = [
  { value: "rooms", label: "Suites" },
  { value: "garden", label: "Jardin & piscine" },
  { value: "dining", label: "Restauration" },
  { value: "wellness", label: "Bien-être" },
];

const MAX_SIDE = 2400;

/** Resize + convert to WebP in the browser so uploads stay small and fast. */
async function compress(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  for (const q of [0.85, 0.75, 0.65]) {
    const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, "image/webp", q));
    if (blob && blob.size <= 3 * 1024 * 1024) {
      return new File([blob], file.name.replace(/\.\w+$/, ".webp"), { type: "image/webp" });
    }
  }
  throw new Error("Image trop lourde même après compression.");
}

const field =
  "w-full border border-border bg-background px-2 py-1.5 font-sans text-xs focus:outline-none focus:border-villa-terracotta";

export function GalleryManager({ images }: { images: GalleryImage[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState("garden");
  const [progress, setProgress] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [, startTransition] = useTransition();

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    const errs: string[] = [];
    for (let i = 0; i < files.length; i++) {
      setProgress(`Envoi ${i + 1} / ${files.length}…`);
      try {
        const small = await compress(files[i]);
        const fd = new FormData();
        fd.set("file", small);
        fd.set("category", category);
        const res = await uploadGalleryImage(fd);
        if (!res.ok) errs.push(`${files[i].name} : ${res.error}`);
      } catch (e) {
        errs.push(`${files[i].name} : ${e instanceof Error ? e.message : "erreur"}`);
      }
    }
    setErrors(errs);
    setProgress(null);
    if (fileRef.current) fileRef.current.value = "";
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div className="bg-card border border-border p-5 flex flex-wrap items-end gap-4">
        <div>
          <label className="font-sans text-xs tracking-wide uppercase text-muted-foreground block mb-1.5">
            Catégorie
          </label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={field}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-sans text-xs tracking-wide uppercase text-muted-foreground block mb-1.5">
            Photos
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={!!progress}
            onChange={(e) => onFiles(e.target.files)}
            className="font-sans text-xs"
          />
        </div>
        {progress && <p className="font-sans text-xs text-villa-terracotta">{progress}</p>}
        {errors.length > 0 && (
          <ul className="basis-full font-sans text-xs text-red-600 list-disc pl-4">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}
      </div>

      {images.length === 0 ? (
        <p className="font-sans text-sm text-muted-foreground">Aucune photo pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {images.map((img) => (
            <form
              key={img.id}
              action={(fd) =>
                startTransition(async () => {
                  await updateGalleryImage(img.id, fd);
                  router.refresh();
                })
              }
              className="bg-card border border-border"
            >
              <div className="relative aspect-[4/3] bg-muted">
                <Image
                  src={img.url}
                  alt={img.alt || ""}
                  fill
                  sizes="(min-width:1280px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="p-3 space-y-2">
                <input name="alt" defaultValue={img.alt} placeholder="Description (FR)" className={field} />
                <input name="altEn" defaultValue={img.altEn} placeholder="Description (EN)" className={field} />
                <select name="category" defaultValue={img.category} className={field}>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <label className="flex items-center gap-2 font-sans text-xs text-muted-foreground">
                  <input type="checkbox" name="featured" defaultChecked={img.featured} /> Mise en avant
                </label>
                <div className="flex justify-between pt-1">
                  <button
                    type="submit"
                    className="font-sans text-xs uppercase tracking-wide text-villa-terracotta hover:underline"
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!confirm("Supprimer cette photo définitivement ?")) return;
                      startTransition(async () => {
                        await deleteGalleryImage(img.id);
                        router.refresh();
                      });
                    }}
                    className="font-sans text-xs uppercase tracking-wide text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </form>
          ))}
        </div>
      )}
    </div>
  );
}
