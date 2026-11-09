"use client";
import { media } from "@/lib/media";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MessageCircle, Mail, MapPin, Phone } from "lucide-react";
import { NAV_LINKS } from "./Header";
import { StarDivider } from "@/components/StarDivider";
import { LEGAL, legalHref } from "@/lib/legal";
import { ManageCookiesButton } from "@/components/consent/ManageCookiesButton";

const CONTACT = {
  address: "Route de l'Ourika, km 17 – Sidi Bouzguia, Marrakech, Maroc",
  phoneDisplay: "+212 663 524 991",
  phoneHref: "tel:+212663524991",
  whatsapp: "https://wa.me/212663524991",
  email: "guest@villaserenamarrakech.com",
  instagram: "https://www.instagram.com/villa_serena_marrakech/",
};

/** Night-blue footer with the colour logo (client brief, ch. 03 and 05). */
export function Footer() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <footer className="bg-villa-ink text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-16 lg:pt-20 pb-10">
        <div className="flex flex-col items-center text-center">
          <Link href="/" aria-label="Villa Serena Marrakech">
            <Image
              src={media("/logo-serena-color.png")}
              alt="Villa Serena Marrakech"
              width={1083}
              height={1030}
              className="h-40 w-auto"
            />
          </Link>
          <p className="mt-6 max-w-md font-serif text-xl text-villa-sand-light">{t("footer.tagline")}</p>
          <StarDivider className="mt-8 w-full max-w-xs" />
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-3 text-center md:text-left">
          <div>
            <h3 className="font-sans text-[11px] tracking-[0.25em] uppercase text-villa-gold mb-4">
              {t("footer.contact_title")}
            </h3>
            <ul className="space-y-3 font-sans text-sm text-villa-sand-light">
              <li className="flex items-start justify-center md:justify-start gap-2.5">
                <MapPin className="size-4 mt-0.5 shrink-0 text-villa-gold" />
                <span className="leading-relaxed">{CONTACT.address}</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2.5">
                <Phone className="size-4 shrink-0 text-villa-gold" />
                <a href={CONTACT.phoneHref} className="hover:text-white transition-colors">{CONTACT.phoneDisplay}</a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2.5">
                <Mail className="size-4 shrink-0 text-villa-gold" />
                <a href={`mailto:${CONTACT.email}`} className="hover:text-white transition-colors break-all">
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-[11px] tracking-[0.25em] uppercase text-villa-gold mb-4">
              {t("footer.links_title")}
            </h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 max-w-xs mx-auto md:mx-0">
              {NAV_LINKS.map((item) => (
                <li key={item.key}>
                  <Link href={item.path} className="font-sans text-sm text-villa-sand-light hover:text-white transition-colors">
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" className="font-sans text-sm text-villa-sand-light hover:text-white transition-colors">
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-[11px] tracking-[0.25em] uppercase text-villa-gold mb-4">
              {t("footer.follow_title")}
            </h3>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="p-2.5 rounded-full border border-white/20 text-villa-sand-light hover:text-white hover:border-villa-gold transition-colors"
              >
                <MessageCircle className="size-4" />
              </a>
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2.5 rounded-full border border-white/20 text-villa-sand-light hover:text-white hover:border-villa-gold transition-colors"
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                aria-label="Email"
                className="p-2.5 rounded-full border border-white/20 text-villa-sand-light hover:text-white hover:border-villa-gold transition-colors"
              >
                <Mail className="size-4" />
              </a>
            </div>
            <Link
              href="/reservation"
              className="mt-6 inline-flex items-center px-6 py-3 bg-villa-terracotta hover:brightness-110 text-white font-sans text-[11px] tracking-[0.14em] uppercase transition"
            >
              {t("nav.book")}
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-sans text-xs text-white/50">
            © {new Date().getFullYear()} Villa Serena Marrakech. {t("footer.legal")}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {/* House rules and terms of sale: shown once their texts are published (Avenant 1, M06). */}
            {LEGAL.published && (
              <>
                <Link href={legalHref("rules", locale)} className="font-sans text-xs text-white/50 hover:text-white transition-colors">
                  {t("legal.house_rules")}
                </Link>
                <Link href={legalHref("terms", locale)} className="font-sans text-xs text-white/50 hover:text-white transition-colors">
                  {t("legal.terms")}
                </Link>
              </>
            )}
            <Link href={locale === "en" ? "/privacy" : "/confidentialite"} className="font-sans text-xs text-white/50 hover:text-white transition-colors">
              {t("footer.privacy")}
            </Link>
            <Link href="/cookies" className="font-sans text-xs text-white/50 hover:text-white transition-colors">
              {t("footer.cookie")}
            </Link>
            <ManageCookiesButton label={t("footer.manage_cookies")} className="font-sans text-xs text-white/50 hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
}
