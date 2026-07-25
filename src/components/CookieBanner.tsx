"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

export function CookieBanner() {
  const t = useTranslations();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("villa-cookie-consent")) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const decide = (value: "accepted" | "declined") => {
    localStorage.setItem("villa-cookie-consent", value);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-sm z-50 bg-card border border-border shadow-xl p-5"
        >
          <h3 className="font-serif text-base text-foreground mb-1.5">{t("cookie.title")}</h3>
          <p className="font-sans text-xs leading-relaxed text-muted-foreground mb-4">{t("cookie.body")}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => decide("accepted")}
              className="flex-1 py-2 bg-villa-terracotta text-white font-sans text-xs tracking-wider uppercase hover:bg-villa-terracotta/90 transition-colors"
            >
              {t("cookie.accept")}
            </button>
            <button
              onClick={() => decide("declined")}
              className="flex-1 py-2 border border-border text-muted-foreground font-sans text-xs tracking-wider uppercase hover:text-foreground transition-colors"
            >
              {t("cookie.decline")}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
