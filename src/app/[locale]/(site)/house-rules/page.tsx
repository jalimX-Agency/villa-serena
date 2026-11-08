import { LegalPage } from "@/components/LegalPage";

export const metadata = { robots: { index: false, follow: true } };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <LegalPage doc="rules" locale={locale} slugLocale="en" />;
}
