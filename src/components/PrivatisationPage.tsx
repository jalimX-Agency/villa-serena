import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { QuoteForm } from "@/components/QuoteForm";

export async function PrivatisationPage({
  serviceType,
  titleKey,
  subKey,
  heroImage,
  intro,
  facts,
}: {
  serviceType: string;
  titleKey: string;
  subKey: string;
  heroImage: string;
  intro: string;
  facts: { label: string; value: string }[];
}) {
  const t = await getTranslations();

  return (
    <>
      <div className="relative h-[50vh] min-h-[360px] overflow-hidden">
        <Image src={heroImage} alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-villa-ink/55" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-white/80 mb-4">
            Villa Serena · Villa Exclusive
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-white mb-4">{t(titleKey)}</h1>
          <p className="font-sans text-white/85 max-w-xl">{t(subKey)}</p>
        </div>
      </div>

      <div className="py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <p className="font-sans text-foreground/80 leading-relaxed mb-8">{intro}</p>
            <ul className="grid grid-cols-2 gap-4">
              {facts.map((f) => (
                <li key={f.label} className="border-l-2 border-villa-terracotta pl-4">
                  <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">
                    {f.label}
                  </p>
                  <p className="font-serif text-lg text-foreground">{f.value}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="font-sans text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-5">
              {t("experiences.quote_button")}
            </h2>
            <QuoteForm serviceType={serviceType} />
          </div>
        </div>
      </div>
    </>
  );
}
