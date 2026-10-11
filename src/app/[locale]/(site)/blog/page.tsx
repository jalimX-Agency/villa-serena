import { pageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";
import { PageStub } from "@/components/PageStub";

// Hidden from search until real articles exist.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({ locale, page: "blog", path: "/blog", index: false });
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  return <PageStub titleKey="blog.page_title" subKey="blog.page_sub" />;
}
