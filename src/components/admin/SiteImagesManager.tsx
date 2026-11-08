"use client";
import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Check, Loader2, RotateCcw, Upload } from "lucide-react";
import { replaceSiteImage, resetSiteImage, saveSiteImageAlt } from "@/lib/actions/admin-site-images";
import { compressImage } from "@/lib/compress-image";
import { Card, CardHeader, btn, field, labelCls } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export type SlotView = {
  key: string;
  group: string;
  label: string;
  defaultSrc: string;
  src: string;
  alt: string;
  altEn: string;
  customized: boolean;
};

export function SiteImagesManager({ slots }: { slots: SlotView[] }) {
  const groups = [...new Set(slots.map((s) => s.group))];
  return (
    <div className="space-y-8">
      {groups.map((g) => (
        <Card key={g}>
          <CardHeader title={g} />
          <ul className="divide-y divide-stone-100">
            {slots.filter((s) => s.group === g).map((s) => <SlotRow key={s.key} slot={s} />)}
          </ul>
        </Card>
      ))}
    </div>
  );
}

function SlotRow({ slot }: { slot: SlotView }) {
  const [src, setSrc] = useState(slot.src);
  const [alt, setAlt] = useState(slot.alt);
  const [altEn, setAltEn] = useState(slot.altEn);
  const [customized, setCustomized] = useState(slot.customized);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; msg?: string }>({ kind: "idle" });
  const [busy, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState({ alt: slot.alt, altEn: slot.altEn });
  const dirty = alt !== saved.alt || altEn !== saved.altEn;

  function onFile(file: File | undefined) {
    if (!file) return;
    start(async () => {
      setStatus({ kind: "idle" });
      try {
        const fd = new FormData();
        fd.set("key", slot.key);
        fd.set("file", await compressImage(file));
        const res = await replaceSiteImage(fd);
        if (res.ok) {
          if (res.url) setSrc(res.url);
          setCustomized(true);
          setStatus({ kind: "ok", msg: "Photo remplacée" });
        } else setStatus({ kind: "error", msg: res.error });
      } catch (e) {
        setStatus({ kind: "error", msg: e instanceof Error ? e.message : "Erreur d'envoi." });
      }
      if (fileRef.current) fileRef.current.value = "";
    });
  }

  function onSave() {
    start(async () => {
      const res = await saveSiteImageAlt(slot.key, alt, altEn);
      if (res.ok) {
        setSaved({ alt, altEn });
        setCustomized(true);
        setStatus({ kind: "ok", msg: "Descriptions enregistrées" });
      } else setStatus({ kind: "error", msg: res.error });
    });
  }

  function onReset() {
    if (!confirm("Revenir à la photo et aux descriptions d'origine ?")) return;
    start(async () => {
      const res = await resetSiteImage(slot.key);
      if (res.ok) {
        // Reload to get the original descriptions back from the server.
        window.location.reload();
      } else setStatus({ kind: "error", msg: res.error });
    });
  }

  return (
    <li className="grid gap-5 p-5 md:grid-cols-[260px_1fr]">
      <div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="group relative block w-full aspect-[4/3] overflow-hidden rounded-xl bg-stone-100 ring-1 ring-stone-200"
        >
          {src ? (
            <Image src={src} alt="" fill sizes="260px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center px-4 text-center text-xs text-stone-500">
              Aucune photo pour l&apos;instant (l&apos;emblème de la villa est affiché)
            </span>
          )}
          <span className={cn("absolute inset-0 flex items-center justify-center gap-2 bg-stone-900/50 text-sm text-white transition", busy ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
            {busy ? <Loader2 className="size-5 animate-spin" /> : <><Upload className="size-4" /> Remplacer</>}
          </span>
        </button>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => onFile(e.target.files?.[0])} />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-medium text-stone-900">{slot.label}</h3>
          {customized && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700 ring-1 ring-emerald-200">Modifiée</span>}
        </div>
        <div>
          <label className={labelCls}>Description de la photo (FR) — pour Google</label>
          <input value={alt} onChange={(e) => setAlt(e.target.value)} className={field} maxLength={200} />
        </div>
        <div>
          <label className={labelCls}>Photo description (EN)</label>
          <input value={altEn} onChange={(e) => setAltEn(e.target.value)} className={field} maxLength={200} />
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className={btn.secondary}>
            <Upload className="size-4" /> Remplacer la photo
          </button>
          <button type="button" onClick={onSave} disabled={busy || !dirty} className={btn.primary}>
            Enregistrer
          </button>
          {customized && (
            <button type="button" onClick={onReset} disabled={busy} className={btn.secondary}>
              <RotateCcw className="size-4" /> Photo d&apos;origine
            </button>
          )}
          {status.kind === "ok" && <span className="flex items-center gap-1 text-xs text-emerald-600"><Check className="size-3.5" /> {status.msg}</span>}
          {status.kind === "error" && <span className="text-xs text-red-600">{status.msg}</span>}
        </div>
      </div>
    </li>
  );
}
