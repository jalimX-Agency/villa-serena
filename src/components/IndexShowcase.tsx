import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type ShowcaseItem = { href: string; image: string; title: string; sub: string };

/**
 * Index-page showcase: numbered entries in riad arches, columns deliberately
 * staggered so it doesn't read as three identical cards.
 */
export function IndexShowcase({ items, cta }: { items: ShowcaseItem[]; cta: string }) {
  return (
    <section className="pb-24 lg:pb-36 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl grid gap-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
        {items.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn("group block", i % 3 === 1 && "lg:mt-24", i % 3 === 2 && "lg:mt-10")}
          >
            <div className="flex items-baseline justify-between mb-4">
              <span className="font-sans text-[11px] tabular-nums tracking-[0.25em] text-villa-terracotta">
                {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
              <ArrowUpRight className="size-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-villa-terracotta" />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-muted">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
              />
            </div>
            <h2 className="mt-6 font-serif text-3xl lg:text-4xl text-foreground transition-colors group-hover:text-villa-terracotta">
              {item.title}
            </h2>
            <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground max-w-sm">{item.sub}</p>
            <span className="mt-4 inline-block font-sans text-[11px] tracking-[0.2em] uppercase text-foreground border-b border-foreground/30 pb-1 transition-colors group-hover:border-villa-terracotta group-hover:text-villa-terracotta">
              {cta}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
