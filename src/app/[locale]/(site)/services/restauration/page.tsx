import { setRequestLocale } from "next-intl/server";
import { PageStub } from "@/components/PageStub";

export default async function RestaurationPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  return <PageStub titleKey="services.restauration.page_title" subKey="services.restauration.page_sub" />;
}
