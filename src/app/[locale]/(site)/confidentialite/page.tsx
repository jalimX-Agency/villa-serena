import { PolicyPage, policyMetadata } from "@/components/PolicyPage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return policyMetadata("privacy", locale);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <PolicyPage doc="privacy" locale={locale} />;
}
