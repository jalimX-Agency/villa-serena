"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { onConsentOpen, readConsent, writeConsent } from "@/lib/consent";

/**
 * Consent banner: browsing on is not consent; three buttons of the same size and colour
 * (accept all, refuse all, customise). The choice is kept 6 months, then the banner returns.
 * "Gérer mes cookies" in the footer reopens it at any time.
 */
export function CookieBanner() {
  const t = useTranslations("cookie");
  const [visible, setVisible] = useState(false);
  const [custom, setCustom] = useState(false);
  const [maps, setMaps] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (!readConsent()) timer = setTimeout(() => setVisible(true), 1200);
    const off = onConsentOpen(() => {
      const c = readConsent();
      setMaps(c?.maps ?? false);
      setAnalytics(c?.analytics ?? false);
      setCustom(true);
      setVisible(true);
    });
    return () => {
      clearTimeout(timer);
      off();
    };
  }, []);

  const save = (choice: { maps: boolean; analytics: boolean }) => {
    writeConsent(choice);
    setVisible(false);
    setCustom(false);
  };

  const btn =
    "flex-1 min-w-[7.5rem] py-2.5 px-3 bg-villa-ink text-white font-sans text-[11px] tracking-[0.12em] uppercase hover:bg-villa-terracotta transition-colors";
  const row = "flex items-start justify-between gap-4 font-sans text-xs text-foreground/80";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label={t("title")}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 bg-villa-sand border border-border shadow-xl p-5"
        >
          <p className="font-serif text-lg text-villa-ink mb-1.5">{t("title")}</p>
          <p className="font-sans text-xs leading-relaxed text-foreground/75 mb-4">
            {t("body")}{" "}
            <Link href="/cookies" className="underline underline-offset-2 hover:text-villa-terracotta">
              {t("policy_link")}
            </Link>
          </p>

          {custom && (
            <div className="mb-4 space-y-3 border-y border-border py-3">
              <label className={row}>
                <span>
                  {t("necessary")}
                  <span className="block text-[11px] text-foreground/55">{t("necessary_desc")}</span>
                </span>
                <input type="checkbox" checked disabled className="mt-0.5 accent-villa-terracotta" />
              </label>
              <label className={row}>
                <span>
                  {t("maps")}
                  <span className="block text-[11px] text-foreground/55">{t("maps_desc")}</span>
                </span>
                <input type="checkbox" checked={maps} onChange={(e) => setMaps(e.target.checked)} className="mt-0.5 accent-villa-terracotta" />
              </label>
              <label className={row}>
                <span>
                  {t("analytics")}
                  <span className="block text-[11px] text-foreground/55">{t("analytics_desc")}</span>
                </span>
                <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="mt-0.5 accent-villa-terracotta" />
              </label>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => save({ maps: true, analytics: true })} className={btn}>
              {t("accept")}
            </button>
            <button type="button" onClick={() => save({ maps: false, analytics: false })} className={btn}>
              {t("decline")}
            </button>
            {custom ? (
              <button type="button" onClick={() => save({ maps, analytics })} className={btn}>
                {t("save")}
              </button>
            ) : (
              <button type="button" onClick={() => setCustom(true)} className={btn}>
                {t("customize")}
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
