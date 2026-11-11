"use client";
import { media } from "@/lib/media";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { VillaIcon } from "@/components/icons/VillaIcon";
import { basePath, localizedPath } from "@/lib/paths";

type NavItem = { key: string; path: string; children?: { key: string; path: string }[] };

/** Menu (annex of 10 Nov 2026, M1–M3): riad icon for Home, then Villa · Suites · Services · Expériences
 * on the left; Galerie · Blog, the "Faire une demande" button and the language on the right. */
export const NAV_LINKS: NavItem[] = [
  { key: "home", path: "/" },
  { key: "villa", path: "/la-villa" },
  { key: "suites", path: "/suites" },
  {
    key: "services",
    path: "/services",
    children: [
      { key: "servicesRestauration", path: "/services#restauration" },
      { key: "servicesBienEtre", path: "/services#bien-etre" },
      { key: "servicesExcursions", path: "/services#activites" },
    ],
  },
  {
    key: "experiences",
    path: "/experiences",
    children: [
      { key: "experiencesMariages", path: "/experiences#evenements" },
      { key: "experiencesGolf", path: "/experiences#golf" },
      { key: "experiencesRetraites", path: "/experiences#retraites" },
    ],
  },
  { key: "gallery", path: "/galerie" },
  { key: "blog", path: "/blog" },
];

const LEFT = NAV_LINKS.slice(0, 5);
const RIGHT = NAV_LINKS.slice(5);

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
  // Menus are tied to the path they were opened on, so navigating closes them.
  const [mobileOn, setMobileOn] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const isHome = pathname === "/" || pathname === "/apercu";
  const mobileOpen = mobileOn === pathname;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenDropdown(null);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleLang = (code: "fr" | "en") => {
    // Pages with an English address of their own (/the-villa) switch to the other language's address.
    router.replace(localizedPath(basePath(pathname), code), { locale: code });
    setLangOpen(false);
  };

  // Home at the very top: transparent over the photo, and the hero carries the large colour logo.
  const transparent = isHome && !scrolled && !mobileOpen;
  const compact = scrolled || mobileOpen;
  const isActive = (item: NavItem) =>
    item.path === "/"
      ? pathname === "/"
      : pathname === localizedPath(item.path, language) || pathname.startsWith(localizedPath(item.path, language) + "/");

  // Short labels in the menu ("Villa", "Suites"); the footer keeps the full ones.
  const label = (key: string) => (t.has(`nav.${key}_short`) ? t(`nav.${key}_short`) : t(`nav.${key}`));

  const linkCls = (item: NavItem) =>
    cn(
      "relative px-2.5 py-2 font-sans text-[11px] tracking-[0.14em] uppercase text-white/85 transition-colors hover:text-white",
      // Active link: white text with a sand underline (terracotta on a photo lacked contrast).
      isActive(item) &&
        "text-white after:absolute after:left-2.5 after:right-2.5 after:-bottom-0.5 after:h-px after:bg-villa-gold"
    );

  const renderItem = (item: NavItem) => {
    if (item.key === "home") {
      // The riad icon replaces the word; the word stays for screen readers and as a tooltip.
      // Cream on the photo (with a shadow for light photos) and on the night-blue bar; terracotta accent when active or hovered.
      return (
        <Link
          key={item.key}
          href={localizedPath(item.path, language)}
          aria-label={t("nav.home")}
          title={t("nav.home")}
          className={cn(
            "group flex size-11 items-center justify-center -ml-1.5 text-[#F6F0E6] [--villa-icon-accent:#B39B6E] hover:[--villa-icon-accent:#C0664A]",
            transparent && "text-[#FBF8F2] [--villa-icon-accent:#D9C9A8] [filter:drop-shadow(0_1px_1.5px_rgba(20,33,61,.75))]",
            isActive(item) && "[--villa-icon-accent:#C0664A]"
          )}
        >
          <VillaIcon name="accueil" size={26} />
          <span className="sr-only">{t("nav.home")}</span>
        </Link>
      );
    }
    if (!item.children) {
      return (
        <Link key={item.key} href={localizedPath(item.path, language)} className={linkCls(item)}>
          {label(item.key)}
        </Link>
      );
    }
    const isOpen = openDropdown === item.key;
    return (
      <div key={item.key} className="relative">
        <button
          onClick={() => setOpenDropdown(isOpen ? null : item.key)}
          className={cn(linkCls(item), "flex items-center gap-1")}
        >
          {label(item.key)}
          <ChevronDown className={cn("size-3 transition-transform", isOpen && "rotate-180")} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute left-0 top-full mt-2 bg-villa-ink border border-white/10 shadow-xl overflow-hidden z-50 min-w-[220px]"
            >
              <Link
                href={localizedPath(item.path, language)}
                onClick={() => setOpenDropdown(null)}
                className="block px-4 py-2.5 font-sans text-[11px] tracking-[0.14em] uppercase text-villa-gold hover:bg-white/5"
              >
                {t(`nav.${item.key}`)}
              </Link>
              {item.children.map((child) => (
                <Link
                  key={child.key}
                  href={child.path}
                  onClick={() => setOpenDropdown(null)}
                  className="block px-4 py-2.5 font-sans text-xs tracking-wide text-white/85 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {t(`nav.${child.key}`)}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        transparent
          ? "bg-gradient-to-b from-villa-ink/60 to-transparent"
          : "bg-villa-ink/97 backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.06)]"
      )}
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div
          ref={navRef}
          className={cn(
            "grid grid-cols-[1fr_auto_1fr] items-center transition-all duration-500",
            compact ? "h-20 xl:h-[92px]" : "h-20 xl:h-[140px]"
          )}
        >
          {/* Left menu (desktop) / burger (mobile) */}
          <div className="flex items-center">
            <nav className="hidden xl:flex items-center gap-0.5">{LEFT.map(renderItem)}</nav>
            <button
              onClick={() => setMobileOn(mobileOpen ? null : pathname)}
              className="xl:hidden p-2 -ml-2 text-white"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

          {/* Centred logo: 110 px at the top, 72 px once scrolled, 64 px on mobile. Hidden on the
              home page while the hero shows the large colour logo. */}
          <Link
            href="/"
            className={cn("flex justify-center transition-opacity duration-500", transparent && "opacity-0 pointer-events-none")}
            aria-label="Villa Serena Marrakech"
          >
            <Image
              src={media("/logo-serena-white.png")}
              alt="Villa Serena Marrakech"
              width={1083}
              height={1030}
              priority
              sizes="116px"
              className={cn("w-auto transition-all duration-500 h-16", compact ? "xl:h-[72px]" : "xl:h-[110px]")}
            />
          </Link>

          {/* Right menu + language + CTA */}
          <div className="flex items-center justify-end gap-1">
            <nav className="hidden xl:flex items-center gap-0.5">{RIGHT.map(renderItem)}</nav>
            <Link
              href="/reservation"
              className="hidden sm:inline-flex items-center h-10 px-5 ml-2 bg-villa-terracotta hover:brightness-110 text-white font-sans text-[11px] tracking-[0.14em] uppercase transition"
            >
              {t("nav.book")}
            </Link>
            <div className="hidden xl:block relative ml-2">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 px-2 py-1.5 font-sans text-[11px] tracking-wider uppercase text-white/75 hover:text-white"
              >
                <Globe className="size-3" />
                {language.toUpperCase()}
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-full mt-2 bg-villa-ink border border-white/10 shadow-xl overflow-hidden z-50 min-w-[130px]"
                  >
                    {LANGUAGES.map(({ code, name }) => (
                      <button
                        key={code}
                        onClick={() => handleLang(code)}
                        className={cn(
                          "w-full px-4 py-2.5 text-left font-sans text-xs tracking-wide hover:bg-white/5",
                          language === code ? "text-villa-gold" : "text-white/85"
                        )}
                      >
                        {name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-villa-ink border-t border-white/10 overflow-hidden max-h-[calc(100svh-5rem)] overflow-y-auto"
          >
            <nav className="px-6 py-4 flex flex-col">
              {NAV_LINKS.map((item) => {
                if (!item.children) {
                  return (
                    <Link
                      key={item.key}
                      href={localizedPath(item.path, language)}
                      className={cn(
                        "flex items-center gap-3 py-3.5 font-serif text-2xl border-b border-white/10",
                        isActive(item) ? "text-villa-gold" : "text-white"
                      )}
                    >
                      {item.key === "home" && <VillaIcon name="accueil" size={26} className="text-[#F6F0E6] [--villa-icon-accent:#B39B6E]" />}
                      {label(item.key)}
                    </Link>
                  );
                }
                const expanded = mobileExpanded === item.key;
                return (
                  <div key={item.key} className="border-b border-white/10">
                    <button
                      onClick={() => setMobileExpanded(expanded ? null : item.key)}
                      className={cn(
                        "w-full flex items-center justify-between py-3.5 font-serif text-2xl",
                        isActive(item) ? "text-villa-gold" : "text-white"
                      )}
                    >
                      {label(item.key)}
                      <ChevronDown className={cn("size-4 transition-transform", expanded && "rotate-180")} />
                    </button>
                    <AnimatePresence>
                      {expanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden pl-1 pb-3"
                        >
                          {[{ key: item.key, path: item.path }, ...item.children].map((child) => (
                            <Link
                              key={child.key}
                              href={child.path}
                              onClick={() => setMobileOn(null)}
                              className="block py-2 font-sans text-xs tracking-[0.14em] uppercase text-villa-sand-light hover:text-white"
                            >
                              {t(`nav.${child.key}`)}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
              <div className="flex items-center gap-2 pt-4">
                {LANGUAGES.map(({ code, label }) => (
                  <button
                    key={code}
                    onClick={() => handleLang(code)}
                    className={cn(
                      "px-3 py-1.5 font-sans text-xs tracking-widest uppercase border transition-colors",
                      language === code ? "border-villa-gold text-villa-gold" : "border-white/20 text-white/70"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <Link
                href="/reservation"
                className="mt-4 inline-flex justify-center items-center py-3 bg-villa-terracotta text-white font-sans text-xs tracking-[0.14em] uppercase"
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
