import { setRequestLocale } from "next-intl/server";
import { PageStub } from "@/components/PageStub";

export default async function BienEtrePage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  return <PageStub titleKey="services.bienEtre.page_title" subKey="services.bienEtre.page_sub" />;
}
