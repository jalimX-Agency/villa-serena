"use client";
import { useTranslations } from "next-intl";

/** Temporary placeholder used while pages are built phase by phase. */
export function PageStub({ titleKey, subKey }: { titleKey: string; subKey: string }) {
  const t = useTranslations();
  return (
    <div className="pt-32 pb-24 px-6 mx-auto max-w-3xl text-center">
      <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-villa-terracotta mb-4">
        Villa Serena
      </p>
      <h1 className="font-serif text-4xl lg:text-5xl text-villa-indigo whitespace-pre-line mb-5">
        {t(titleKey)}
      </h1>
      <p className="font-sans text-muted-foreground leading-relaxed">{t(subKey)}</p>
      <p className="mt-12 font-sans text-xs tracking-widest uppercase text-muted-foreground/60">
        — Page en construction —
      </p>
    </div>
  );
}
