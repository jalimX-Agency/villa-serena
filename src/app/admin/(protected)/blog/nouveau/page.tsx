import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BlogEditForm } from "@/components/admin/BlogEditForm";
import { PageHeader } from "@/components/admin/ui";

export default function AdminBlogNewPage() {
  return (
    <div>
      <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900">
        <ArrowLeft className="size-4" /> Blog
      </Link>
      <div className="mt-4">
        <PageHeader title="Nouvel article" description="L'article reste en brouillon tant que « Publié sur le site » n'est pas coché." />
      </div>
      <BlogEditForm post={null} />
    </div>
  );
}
