import { setRequestLocale } from "next-intl/server";
import { PageStub } from "@/components/PageStub";

export default async function MaisonPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  return <PageStub titleKey="maison.page_title" subKey="maison.page_sub" />;
}
