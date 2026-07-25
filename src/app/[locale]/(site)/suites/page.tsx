import { setRequestLocale } from "next-intl/server";
import { PageStub } from "@/components/PageStub";

export default async function SuitesPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  return <PageStub titleKey="suites.page_title" subKey="suites.page_sub" />;
}
