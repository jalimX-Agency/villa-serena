import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { BlogEditForm } from "@/components/admin/BlogEditForm";
import { PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminBlogEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await db.blogPost.findUnique({ where: { id } });
  if (!post) notFound();
  return (
    <div>
      <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900">
        <ArrowLeft className="size-4" /> Blog
      </Link>
      <div className="mt-4">
        <PageHeader title={post.title} description={post.published ? "Publié" : "Brouillon"} />
      </div>
      <BlogEditForm key={post.updatedAt.toISOString()} post={post} />
    </div>
  );
}
