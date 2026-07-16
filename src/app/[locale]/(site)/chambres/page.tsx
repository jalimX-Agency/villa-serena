import { setRequestLocale } from "next-intl/server";
import { PageStub } from "@/components/PageStub";

export default async function ChambresPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  return <PageStub titleKey="rooms.page_title" subKey="rooms.page_sub" />;
}
