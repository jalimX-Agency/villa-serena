"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

const KEY = "villa-cookie-consent";
type Consent = { necessary: true; analytics: boolean; date: string };

/**
 * Consent banner (client brief ch. 13): browsing on does not count as consent; three buttons
 * of the same size and colour — accept all, refuse all, customise.
 */
export function CookieBanner() {
  const t = useTranslations("cookie");
  const [visible, setVisible] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {}
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const save = (value: boolean) => {
    const consent: Consent = { necessary: true, analytics: value, date: new Date().toISOString() };
    try {
      localStorage.setItem(KEY, JSON.stringify(consent));
    } catch {}
    setVisible(false);
  };

  const btn =
    "flex-1 py-2.5 px-3 bg-villa-ink text-white font-sans text-[11px] tracking-[0.12em] uppercase hover:bg-villa-terracotta transition-colors";

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
          <h3 className="font-serif text-lg text-villa-ink mb-1.5">{t("title")}</h3>
          <p className="font-sans text-xs leading-relaxed text-foreground/75 mb-4">{t("body")}</p>

          {custom && (
            <div className="mb-4 space-y-2 border-y border-border py-3">
              <label className="flex items-center justify-between gap-3 font-sans text-xs text-foreground/80">
                <span>{t("necessary")}</span>
                <input type="checkbox" checked disabled className="accent-villa-terracotta" />
              </label>
              <label className="flex items-center justify-between gap-3 font-sans text-xs text-foreground/80">
                <span>{t("analytics")}</span>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="accent-villa-terracotta"
                />
              </label>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button onClick={() => save(true)} className={btn}>{t("accept")}</button>
            <button onClick={() => save(false)} className={btn}>{t("decline")}</button>
            {custom ? (
              <button onClick={() => save(analytics)} className={btn}>{t("save")}</button>
            ) : (
              <button onClick={() => setCustom(true)} className={btn}>{t("customize")}</button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
