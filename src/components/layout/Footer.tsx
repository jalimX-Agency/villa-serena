"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MessageCircle, Mail, MapPin, Phone } from "lucide-react";
import { NAV_LINKS } from "./Header";

const CONTACT = {
  phoneDisplay: "+212 663 524 991",
  phoneHref: "tel:+212663524991",
  whatsapp: "https://wa.me/212663524991",
  email: "guest@villaserenamarrakech.com",
  instagram: "https://www.instagram.com/villa_serena_marrakech/",
  facebook: "https://www.facebook.com/profile.php?id=61552603958185",
};

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="bg-villa-sand text-foreground border-t border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center mb-4">
              <Image
                src="/logo-villa-serena.png"
                alt="Villa Serena by Gautama"
                width={200}
                height={94}
                className="h-11 w-auto"
              />
            </Link>
            <p className="font-sans text-sm leading-relaxed text-muted-foreground max-w-sm mt-3">
              {t("footer.tagline")}
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-border text-muted-foreground hover:text-villa-terracotta hover:border-villa-terracotta transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="size-4" />
              </a>
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-border text-muted-foreground hover:text-villa-terracotta hover:border-villa-terracotta transition-colors"
                aria-label="Instagram"
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="p-2.5 rounded-full border border-border text-muted-foreground hover:text-villa-terracotta hover:border-villa-terracotta transition-colors"
                aria-label="Email"
              >
                <Mail className="size-4" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-sans text-[10px] tracking-[0.25em] uppercase text-muted-foreground/70 mb-4">
              {t("footer.links_title")}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map((item) => (
                <li key={item.key}>
                  <Link href={item.path} className="font-sans text-sm text-foreground/70 hover:text-villa-terracotta transition-colors">
                    {t(`nav.${item.key}`)}
                  </Link>
                  {"children" in item && item.children.length > 0 && (
                    <ul className="flex flex-col gap-1.5 mt-1.5 ml-3">
                      {item.children.map((child) => (
                        <li key={child.key}>
                          <Link
                            href={child.path}
                            className="font-sans text-xs text-muted-foreground hover:text-villa-terracotta transition-colors"
                          >
                            {t(`nav.${child.key}`)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-sans text-[10px] tracking-[0.25em] uppercase text-muted-foreground/70 mb-4">
              {t("footer.contact_title")}
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="size-3.5 mt-0.5 text-villa-terracotta shrink-0" />
                <span className="font-sans text-sm text-foreground/70 leading-relaxed">
                  Marrakech, Maroc
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-3.5 text-villa-terracotta shrink-0" />
                <a href={CONTACT.phoneHref} className="font-sans text-sm text-foreground/70 hover:text-villa-terracotta transition-colors">
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-3.5 text-villa-terracotta shrink-0" />
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="font-sans text-sm text-foreground/70 hover:text-villa-terracotta transition-colors break-all"
                >
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="h-px bg-border" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-sans text-xs text-muted-foreground/70">
            © {new Date().getFullYear()} Villa Serena Marrakech. {t("footer.legal")}
          </span>
          <div className="flex items-center gap-5">
            <Link href="/confidentialite" className="font-sans text-xs text-muted-foreground/70 hover:text-foreground transition-colors">
              {t("footer.privacy")}
            </Link>
            <Link href="/cookies" className="font-sans text-xs text-muted-foreground/70 hover:text-foreground transition-colors">
              {t("footer.cookie")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
