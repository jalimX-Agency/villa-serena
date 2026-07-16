import { setRequestLocale } from "next-intl/server";
import { PageStub } from "@/components/PageStub";

export default async function GaleriePage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  return <PageStub titleKey="gallery.page_title" subKey="gallery.page_sub" />;
}
