import { setRequestLocale } from "next-intl/server";
import { PageStub } from "@/components/PageStub";

export default async function ExperiencesPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  return <PageStub titleKey="experiences.page_title" subKey="experiences.page_sub" />;
}
