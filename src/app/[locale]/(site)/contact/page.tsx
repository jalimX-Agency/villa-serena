import { setRequestLocale } from "next-intl/server";
import { PageStub } from "@/components/PageStub";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  return <PageStub titleKey="contact.page_title" subKey="contact.page_sub" />;
}
