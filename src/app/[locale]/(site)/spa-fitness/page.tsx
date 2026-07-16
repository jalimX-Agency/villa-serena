import { setRequestLocale } from "next-intl/server";
import { PageStub } from "@/components/PageStub";

export default async function SpaPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  return <PageStub titleKey="spa.page_title" subKey="spa.page_sub" />;
}
