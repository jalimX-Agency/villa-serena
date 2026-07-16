import { setRequestLocale } from "next-intl/server";
import { PageStub } from "@/components/PageStub";

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  return <PageStub titleKey="blog.page_title" subKey="blog.page_sub" />;
}
