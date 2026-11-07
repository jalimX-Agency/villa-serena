"use client";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { BlogPost } from "@prisma/client";
import { Check, Loader2, Upload, Trash2, ExternalLink } from "lucide-react";
import { saveBlogPost, deleteBlogPost, uploadBlogImage, type BlogFormState } from "@/lib/actions/admin-blog";
import { compressImage } from "@/lib/compress-image";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Card, CardHeader, btn, field, labelCls } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "guides", label: "Guides" },
  { value: "golf", label: "Golf" },
  { value: "famille", label: "Famille" },
];

const initial: BlogFormState = { status: "idle" };

export function BlogEditForm({ post }: { post: BlogPost | null }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(saveBlogPost.bind(null, post?.id ?? null), initial);
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [deleting, startDelete] = useTransition();

  // A new post gets its own edit URL once saved.
  useEffect(() => {
    if (state.status === "success" && !post && state.id) router.replace(`/admin/blog/${state.id}`);
  }, [state, post, router]);

  const saved = state.status === "success" && !pending;

  return (
    <form action={action} className="space-y-6 pb-24">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Language tabs: both editors stay mounted so both languages are submitted. */}
          <div className="flex gap-1 rounded-xl bg-stone-100 p-1 w-fit">
            {(["fr", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={cn("rounded-lg px-4 py-1.5 text-sm transition", lang === l ? "bg-white text-stone-900 shadow-sm" : "text-stone-500")}
              >
                {l === "fr" ? "Français" : "English"}
              </button>
            ))}
          </div>

          {(["fr", "en"] as const).map((l) => {
            const en = l === "en";
            return (
              <div key={l} className={cn("space-y-6", lang !== l && "hidden")}>
                <Card>
                  <CardHeader title={en ? "Article (English)" : "Article (français)"} />
                  <div className="space-y-4 p-5">
                    <div>
                      <label className={labelCls}>{en ? "Title (H1)" : "Titre (H1)"}{!en && " *"}</label>
                      <input name={en ? "titleEn" : "title"} defaultValue={en ? post?.titleEn : post?.title} required={!en} className={cn(field, "text-base")} />
                    </div>
                    <div>
                      <label className={labelCls}>{en ? "Introduction (3–4 lines, answers the question)" : "Introduction (3 ou 4 lignes, qui répond tout de suite à la question)"}</label>
                      <textarea name={en ? "excerptEn" : "excerpt"} rows={4} defaultValue={en ? post?.excerptEn : post?.excerpt} className={field} />
                    </div>
                    <div>
                      <label className={labelCls}>{en ? "Body" : "Texte"}</label>
                      <RichTextEditor
                        name={en ? "contentEn" : "content"}
                        initial={(en ? post?.contentEn : post?.content) ?? ""}
                        placeholder={en ? "Write the article…" : "Rédigez l'article…"}
                      />
                      <p className="mt-2 text-xs text-stone-400">
                        {en
                          ? "Use “Section title (H2)” for each part: they build the table of contents."
                          : "Utilisez « Titre de section (H2) » pour chaque partie : ils forment le sommaire de l'article."}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <CardHeader title={en ? "Google (English)" : "Google (français)"} />
                  <div className="space-y-4 p-5">
                    <Counted name={en ? "metaTitleEn" : "metaTitle"} label={en ? "Google title" : "Titre Google"} max={60} initial={(en ? post?.metaTitleEn : post?.metaTitle) ?? ""} />
                    <Counted name={en ? "metaDescriptionEn" : "metaDescription"} label={en ? "Google description" : "Description Google"} max={160} initial={(en ? post?.metaDescriptionEn : post?.metaDescription) ?? ""} area />
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Publication" />
            <div className="space-y-4 p-5">
              <label className="flex items-center gap-2 text-sm text-stone-700">
                <input type="checkbox" name="published" defaultChecked={post?.published ?? false} className="size-4 accent-villa-terracotta" />
                Publié sur le site
              </label>
              <label className="flex items-center gap-2 text-sm text-stone-700">
                <input type="checkbox" name="featured" defaultChecked={post?.featured ?? false} className="size-4 accent-villa-terracotta" />
                Mis en avant
              </label>
              <div>
                <label className={labelCls}>Catégorie</label>
                <select name="category" defaultValue={post?.category || "guides"} className={field}>
                  {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Adresse (laisser vide pour la créer depuis le titre)</label>
                <div className="flex items-center rounded-lg ring-1 ring-stone-200 bg-white focus-within:ring-2 focus-within:ring-villa-terracotta/60">
                  <span className="pl-3 text-xs text-stone-400">/blog/</span>
                  <input name="slug" defaultValue={post?.slug} className="w-full bg-transparent px-1 py-2 text-sm focus:outline-none" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Ordre d&apos;affichage</label>
                <input type="number" name="order" defaultValue={post?.order ?? 0} className={field} />
              </div>
              {post && (
                <p className="text-xs text-stone-400">
                  {post.readTime} min de lecture (calculé automatiquement)
                </p>
              )}
            </div>
          </Card>

          <CoverImage post={post} />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/90 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
          <div className="flex items-center gap-2">
            {post && (
              <>
                <a href={`/fr/blog/${post.slug}`} target="_blank" rel="noreferrer" className={btn.secondary}>
                  <ExternalLink className="size-4" /> Voir
                </a>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => {
                    if (!confirm("Supprimer cet article définitivement ?")) return;
                    startDelete(async () => {
                      await deleteBlogPost(post.id);
                      router.replace("/admin/blog");
                    });
                  }}
                  className={btn.danger}
                >
                  <Trash2 className="size-4" /> Supprimer
                </button>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            {state.status === "error" && <p className="text-sm text-red-600">{state.error}</p>}
            {saved && <p className="flex items-center gap-1.5 text-sm text-emerald-600"><Check className="size-4" /> Enregistré</p>}
            <button type="submit" disabled={pending} className={cn(btn.primary, "min-w-36")}>
              {pending && <Loader2 className="size-4 animate-spin" />} Enregistrer
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

function Counted({ name, label, max, initial, area }: { name: string; label: string; max: number; initial: string; area?: boolean }) {
  const [value, setValue] = useState(initial);
  const over = value.length > max;
  const props = { name, value, onChange: (e: { target: { value: string } }) => setValue(e.target.value), className: field };
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className={labelCls}>{label}</label>
        <span className={cn("text-[11px] tabular-nums", over ? "text-red-600" : "text-stone-400")}>
          {value.length} / {max}
        </span>
      </div>
      {area ? <textarea rows={3} {...props} /> : <input {...props} />}
    </div>
  );
}

function CoverImage({ post }: { post: BlogPost | null }) {
  const [url, setUrl] = useState(post?.image ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.set("file", await compressImage(file));
      const res = await uploadBlogImage(fd);
      if (res.url) setUrl(res.url);
      else setError(res.error ?? "Erreur d'envoi.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur d'envoi.");
    }
    setBusy(false);
    if (ref.current) ref.current.value = "";
  }

  return (
    <Card>
      <CardHeader title="Photo d'ouverture" />
      <div className="space-y-3 p-5">
        <input type="hidden" name="image" value={url} />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={busy}
          className="relative block w-full aspect-[16/10] overflow-hidden rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 hover:border-stone-300"
        >
          {url ? (
            <Image src={url} alt="" fill sizes="360px" className="object-cover" />
          ) : (
            <span className="flex h-full flex-col items-center justify-center gap-2 text-xs text-stone-500">
              {busy ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}
              Choisir une photo
            </span>
          )}
          {url && busy && <span className="absolute inset-0 flex items-center justify-center bg-white/70"><Loader2 className="size-5 animate-spin" /></span>}
        </button>
        <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => onFile(e.target.files?.[0])} />
        {url && (
          <button type="button" onClick={() => setUrl("")} className="text-xs text-red-600 hover:underline">Retirer la photo</button>
        )}
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div>
          <label className={labelCls}>Description de la photo (FR) — pour Google</label>
          <input name="imageAlt" defaultValue={post?.imageAlt} className={field} />
        </div>
        <div>
          <label className={labelCls}>Photo description (EN)</label>
          <input name="imageAltEn" defaultValue={post?.imageAltEn} className={field} />
        </div>
      </div>
    </Card>
  );
}
