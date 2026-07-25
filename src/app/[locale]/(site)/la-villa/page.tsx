import { setRequestLocale } from "next-intl/server";
import { PageStub } from "@/components/PageStub";

export default async function VillaPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  return <PageStub titleKey="villa.page_title" subKey="villa.page_sub" />;
}
