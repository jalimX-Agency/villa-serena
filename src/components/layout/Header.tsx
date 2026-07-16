"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV_LINKS = [
  { key: "maison", path: "/la-maison" },
  { key: "rooms", path: "/chambres" },
  { key: "spa", path: "/spa-fitness" },
  { key: "events", path: "/evenements-privatisation" },
  { key: "gallery", path: "/galerie" },
  { key: "blog", path: "/blog" },
  { key: "contact", path: "/contact" },
] as const;

const LANGUAGES = [
  { code: "fr" as const, label: "FR", name: "Français" },
  { code: "en" as const, label: "EN", name: "English" },
];

export function Header() {
  const t = useTranslations();
  const language = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLang = (code: "fr" | "en") => {
    router.replace(pathname, { locale: code });
    setLangOpen(false);
  };
  const transparent = isHome && !scrolled && !mobileOpen;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        transparent
          ? "bg-transparent"
          : "bg-villa-cream/95 backdrop-blur-md border-b border-border shadow-sm"
      )}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-villa-serena.png"
              alt="Villa Serena by Gautama"
              width={200}
              height={94}
              priority
              className="h-9 lg:h-11 w-auto"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ key, path }) => (
              <Link
                key={key}
                href={path}
                className={cn(
                  "px-3 py-2 font-sans text-[11px] tracking-[0.12em] uppercase transition-colors hover:text-villa-terracotta",
                  transparent ? "text-white/90" : "text-foreground/70",
                  pathname.startsWith(path) && "text-villa-terracotta"
                )}
              >
                {t(`nav.${key}`)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden lg:block relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={cn(
                  "flex items-center gap-1 px-2 py-1.5 font-sans text-[11px] tracking-wider uppercase transition-colors hover:text-villa-terracotta",
                  transparent ? "text-white/80" : "text-muted-foreground"
                )}
              >
                <Globe className="size-3" />
                {language.toUpperCase()}
                <ChevronDown className="size-3" />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-full mt-1 bg-card border border-border rounded-md shadow-lg overflow-hidden z-50 min-w-[130px]"
                  >
                    {LANGUAGES.map(({ code, name }) => (
                      <button
                        key={code}
                        onClick={() => handleLang(code)}
                        className={cn(
                          "w-full px-4 py-2.5 text-left font-sans text-xs tracking-wide transition-colors hover:bg-muted",
                          language === code ? "text-villa-terracotta font-medium" : "text-foreground"
                        )}
                      >
                        {name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link
              href="/contact"
              className={cn(
                "hidden lg:inline-flex items-center h-9 px-5 font-sans text-[11px] tracking-[0.12em] uppercase transition-all",
                transparent
                  ? "bg-white text-villa-indigo hover:bg-villa-cream"
                  : "bg-villa-terracotta hover:bg-villa-terracotta/90 text-white"
              )}
            >
              {t("nav.book")}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn("lg:hidden p-2 transition-colors", transparent ? "text-white" : "text-foreground")}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-villa-cream border-t border-border overflow-hidden"
          >
            <nav className="px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(({ key, path }) => (
                <Link
                  key={key}
                  href={path}
                  className={cn(
                    "px-2 py-3 font-sans text-sm tracking-wider uppercase border-b border-border/50 transition-colors hover:text-villa-terracotta",
                    pathname.startsWith(path) ? "text-villa-terracotta" : "text-foreground"
                  )}
                >
                  {t(`nav.${key}`)}
                </Link>
              ))}
              <div className="flex items-center gap-2 pt-3">
                {LANGUAGES.map(({ code, label }) => (
                  <button
                    key={code}
                    onClick={() => handleLang(code)}
                    className={cn(
                      "px-3 py-1.5 font-sans text-xs tracking-widest uppercase border rounded transition-colors",
                      language === code
                        ? "border-villa-terracotta text-villa-terracotta"
                        : "border-border text-muted-foreground hover:border-foreground"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <Link
                href="/contact"
                className="mt-3 inline-flex justify-center items-center py-2.5 bg-villa-terracotta hover:bg-villa-terracotta/90 text-white font-sans text-xs tracking-wider uppercase"
              >
                {t("nav.book")}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
