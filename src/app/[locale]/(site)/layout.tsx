import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/CookieBanner";

// Pages here read live from the database (rooms, experiences, blog, etc.)
// and will be edited via the admin CMS — render per-request instead of
// freezing content at build time, and don't make the build depend on
// the database being reachable.
export const dynamic = "force-dynamic";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CookieBanner />
    </>
  );
}
