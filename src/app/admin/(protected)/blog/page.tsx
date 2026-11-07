import Image from "next/image";
import Link from "next/link";
import { Plus, ChevronRight, Eye, EyeOff } from "lucide-react";
import { db } from "@/lib/db";
import { Card, EmptyState, PageHeader, btn, formatDate } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

const CAT: Record<string, string> = { guides: "Guides", golf: "Golf", famille: "Famille" };

export default async function AdminBlogPage() {
  const posts = await db.blogPost.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
  return (
    <div>
      <PageHeader
        title="Blog"
        description="Un article par mois suffit : 900 à 1 200 mots, des titres de section clairs, et un mot-clé principal."
        actions={
          <Link href="/admin/blog/nouveau" className={btn.primary}>
            <Plus className="size-4" /> Nouvel article
          </Link>
        }
      />
      <Card className="overflow-hidden">
        {posts.length === 0 ? (
          <EmptyState>Aucun article pour le moment.</EmptyState>
        ) : (
          <ul className="divide-y divide-stone-100">
            {posts.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/blog/${p.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-stone-50">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                    {p.image && <Image src={p.image} alt="" fill sizes="56px" className="object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-stone-900">{p.title}</p>
                    <p className="truncate text-xs text-stone-500">
                      {CAT[p.category] ?? p.category} · {p.readTime} min · {formatDate(p.updatedAt)}
                      {!p.titleEn && <span className="text-amber-600"> · traduction anglaise manquante</span>}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${
                      p.published ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-stone-100 text-stone-500 ring-stone-200"
                    }`}
                  >
                    {p.published ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                    {p.published ? "Publié" : "Brouillon"}
                  </span>
                  <ChevronRight className="size-4 text-stone-300" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
