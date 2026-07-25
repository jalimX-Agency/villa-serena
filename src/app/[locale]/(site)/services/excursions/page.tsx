import { setRequestLocale } from "next-intl/server";
import { PageStub } from "@/components/PageStub";

export default async function ExcursionsPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  return <PageStub titleKey="services.excursions.page_title" subKey="services.excursions.page_sub" />;
}
