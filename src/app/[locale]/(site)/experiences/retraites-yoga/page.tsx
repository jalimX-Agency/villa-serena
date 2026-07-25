import { setRequestLocale } from "next-intl/server";
import { PageStub } from "@/components/PageStub";

export default async function RetraitesYogaPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  return <PageStub titleKey="experiences.retraitesYoga.page_title" subKey="experiences.retraitesYoga.page_sub" />;
}
