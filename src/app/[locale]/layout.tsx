import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
      icon: "/logo-villa-serena.png",
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
    telephone: "+212663524987",
    email: "contact@villaserenamarrakech.com",
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
