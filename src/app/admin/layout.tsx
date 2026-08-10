import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";

// Self-hosted — see src/app/[locale]/layout.tsx for why (Google Fonts
// reachability at build time isn't guaranteed on every host).
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

export const metadata: Metadata = {
  title: "Administration | Villa Serena",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
