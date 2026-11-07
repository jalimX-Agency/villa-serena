import { getTranslations } from "next-intl/server";

/**
 * Night-blue figures band, directly under the home photo (client brief, ch. 03):
 * five cells split by thin sand rules, figures in Cormorant 40 px sand, labels in small caps.
 */
export async function StatsBand() {
  const t = await getTranslations();
  const stats = t.raw("stats") as [string, string][];

  return (
    <section className="bg-villa-ink border-y border-villa-gold/25">
      {/* The 1px gap shows the sand background through: that is the rule between cells. */}
      <ul className="mx-auto max-w-7xl grid grid-cols-2 lg:grid-cols-5 gap-px bg-villa-gold/25">
        {stats.map(([figure, label], i) => (
          <li
            key={label}
            className={`bg-villa-ink px-4 py-7 lg:py-9 text-center ${i === stats.length - 1 ? "col-span-2 lg:col-span-1" : ""}`}
          >
            <p className="font-serif text-[34px] sm:text-[40px] leading-none text-villa-gold">{figure}</p>
            <p className="mt-2.5 font-sans text-[11px] tracking-[0.18em] uppercase text-white/85">{label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
