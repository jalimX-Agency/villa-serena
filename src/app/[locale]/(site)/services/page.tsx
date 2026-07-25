import { setRequestLocale } from "next-intl/server";
import { PageStub } from "@/components/PageStub";

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  return <PageStub titleKey="services.page_title" subKey="services.page_sub" />;
}
