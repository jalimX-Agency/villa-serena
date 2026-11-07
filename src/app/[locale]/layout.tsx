import { headers } from "next/headers";
import { media } from "@/lib/media";
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
      icon: media("/favicon-serena.png"),
      apple: media("/favicon-serena.png"),
    },
    // Keep the vercel.app preview domain out of Google until the real domain is live.
    robots: (await headers()).get("host")?.endsWith(".vercel.app")
      ? { index: false, follow: false }
      : { index: true, follow: true },
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

  // VacationRental (client brief ch. 13) — replaces the earlier LodgingBusiness block.
  const lodgingSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "VacationRental",
    name: "Villa Serena Marrakech",
    description:
      "Villa de charme à louer en exclusivité, route de l'Ourika : 6 suites et un studio sur un hectare, 14 couchages, piscine privée, hammam, personnel sur place.",
    url: "https://www.villaserenamarrakech.com/fr",
    telephone: "+212663524991",
    email: "guest@villaserenamarrakech.com",
    image: [media("/hero-main.jpg"), media("/welcome-salon.jpg"), media("/welcome-jardin.jpg")],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Route de l'Ourika, km 17, Sidi Bouzguia",
      addressLocality: "Marrakech",
      addressCountry: "MA",
    },
    checkinTime: "16:00",
    checkoutTime: "11:00",
    priceRange: "À partir de 980 € la nuit",
    containsPlace: {
      "@type": "Accommodation",
      additionalType: "EntirePlace",
      numberOfBedrooms: 7,
      numberOfBathroomsTotal: 7,
      occupancy: { "@type": "QuantitativeValue", value: 14 },
      amenityFeature: ["Piscine privée", "Hammam", "Salle de sport", "Climatisation", "Wifi (fibre)", "Parking privé"].map((name) => ({
        "@type": "LocationFeatureSpecification",
        name,
        value: true,
      })),
    },
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
