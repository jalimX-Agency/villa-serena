"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Star, Trash2, Upload, Loader2 } from "lucide-react";
import { compressImage } from "@/lib/compress-image";
import { cn } from "@/lib/utils";

/**
 * Ordered photo list with upload, reorder and remove. The first photo is the cover.
 * The list is submitted as JSON in a hidden input named `name`.
 */
export function ImageListEditor({
  name,
  initial,
  upload,
}: {
  name: string;
  initial: string[];
  upload: (fd: FormData) => Promise<{ url?: string; error?: string }>;
}) {
  const [images, setImages] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function add(files: FileList | File[] | null) {
    const list = Array.from(files ?? []).filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    setError("");
    for (let i = 0; i < list.length; i++) {
      setBusy(`Envoi ${i + 1} / ${list.length}…`);
      try {
        const fd = new FormData();
        fd.set("file", await compressImage(list[i]));
        const res = await upload(fd);
        if (res.url) setImages((prev) => [...prev, res.url!]);
        else setError(res.error ?? "Erreur d'envoi.");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur d'envoi.");
      }
    }
    setBusy(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const move = (i: number, d: -1 | 1) =>
    setImages((prev) => {
      const next = [...prev];
      [next[i], next[i + d]] = [next[i + d], next[i]];
      return next;
    });

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(images)} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((src, i) => (
          <div key={src} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-stone-100 ring-1 ring-stone-200">
            <Image src={src} alt="" fill sizes="240px" className="object-cover" />
            {i === 0 && (
              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-stone-800">
                <Star className="size-3 fill-villa-gold text-villa-gold" /> Couverture
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
              <div className="flex gap-1">
                <IconBtn label="Déplacer à gauche" disabled={i === 0} onClick={() => move(i, -1)}><ArrowLeft className="size-3.5" /></IconBtn>
                <IconBtn label="Déplacer à droite" disabled={i === images.length - 1} onClick={() => move(i, 1)}><ArrowRight className="size-3.5" /></IconBtn>
                {i !== 0 && (
                  <IconBtn label="Mettre en couverture" onClick={() => setImages((p) => [src, ...p.filter((x) => x !== src)])}>
                    <Star className="size-3.5" />
                  </IconBtn>
                )}
              </div>
              <IconBtn label="Retirer" onClick={() => setImages((p) => p.filter((x) => x !== src))} danger>
                <Trash2 className="size-3.5" />
              </IconBtn>
            </div>
          </div>
        ))}

        <button
          type="button"
          disabled={!!busy}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files); }}
          className={cn(
            "flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-xs text-stone-500 transition",
            drag ? "border-villa-terracotta bg-villa-terracotta/5" : "border-stone-200 hover:border-stone-300 hover:bg-white"
          )}
        >
          {busy ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}
          {busy ?? "Ajouter des photos"}
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => add(e.target.files)} />
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      <p className="mt-2 text-xs text-stone-400">
        La première photo sert de couverture. Les modifications sont appliquées en cliquant sur « Enregistrer ».
      </p>
    </div>
  );
}

function IconBtn({
  children, label, onClick, disabled, danger,
}: {
  children: React.ReactNode; label: string; onClick: () => void; disabled?: boolean; danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-md bg-white/90 p-1.5 text-stone-800 hover:bg-white disabled:opacity-30",
        danger && "text-red-600"
      )}
    >
      {children}
    </button>
  );
}
