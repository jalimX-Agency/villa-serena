import { setRequestLocale } from "next-intl/server";
import { PageStub } from "@/components/PageStub";

export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  return <PageStub titleKey="events.page_title" subKey="events.page_sub" />;
}
