import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

// Self-hosted (not next/font/google) so the build never depends on being
// able to reach Google Fonts — that dependency caused production build
// failures ("module not found" for the generated font CSS) on hosts that
// don't allow outbound network access during the build step.
const cormorant = localFont({
  variable: "--font-cormorant",
  src: [
    { path: "../../fonts/cormorant-garamond-400.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/cormorant-garamond-500.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/cormorant-garamond-600.woff2", weight: "600", style: "normal" },
    { path: "../../fonts/cormorant-garamond-700.woff2", weight: "700", style: "normal" },
  ],
});

const inter = localFont({
  variable: "--font-inter",
  src: [
    { path: "../../fonts/inter-300.woff2", weight: "300", style: "normal" },
    { path: "../../fonts/inter-400.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/inter-500.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/inter-600.woff2", weight: "600", style: "normal" },
    { path: "../../fonts/inter-700.woff2", weight: "700", style: "normal" },
  ],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  const isEn = locale === "en";

  return {
    metadataBase: new URL("https://www.villaserenamarrakech.com"),
    title: {
      default: isEn
        ? "Villa Serena Marrakech | Exclusive Villa Hire in Marrakech"
        : "Villa Serena Marrakech | Villa Exclusive à Marrakech",
      template: "%s | Villa Serena Marrakech",
    },
    description: isEn
      ? "Villa Serena by Gautama — an exclusive charming villa in Marrakech. Five suites, hammam, garden, full villa hire for retreats, golf stays and events."
      : "Villa Serena by Gautama — villa exclusive de charme à Marrakech. Cinq suites, hammam, jardin, privatisation complète pour retraites, séjours golf et événements.",
    alternates: {
      canonical: `https://www.villaserenamarrakech.com/${locale}`,
      languages: {
        fr: "https://www.villaserenamarrakech.com/fr",
        en: "https://www.villaserenamarrakech.com/en",
        "x-default": "https://www.villaserenamarrakech.com/fr",
      },
    },
    openGraph: {
      type: "website",
      locale: isEn ? "en_US" : "fr_FR",
      siteName: "Villa Serena Marrakech",
    },
    icons: {
      icon: "/favicon-logo.png",
    },
    robots: { index: true, follow: true },
    other: { tagline: t("tagline") },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const lodgingSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "Villa Serena Marrakech",
    description:
      "Villa exclusive de charme autour d'un patio d'inspiration riad, à Marrakech.",
    url: "https://www.villaserenamarrakech.com",
    telephone: "+212663524991",
    email: "guest@villaserenamarrakech.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sidi Bouzguia",
      addressLocality: "Marrakech",
      addressCountry: "MA",
    },
    priceRange: "€€",
    sameAs: [
      "https://www.instagram.com/villa_serena_marrakech/",
      "https://www.facebook.com/profile.php?id=61552603958185",
    ],
  });

  return (
    <html lang={locale} className={`${cormorant.variable} ${inter.variable} h-full antialiased`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: lodgingSchema }} />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
