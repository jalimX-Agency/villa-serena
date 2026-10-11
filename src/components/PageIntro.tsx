import { ZelligeDivider } from "@/components/ZelligeDivider";

/**
 * Editorial page header for pages without a photo hero: small eyebrow, large
 * keyword-led H1 on the left, supporting copy on the right, zellige rule below.
 */
export function PageIntro({
  eyebrow,
  title,
  lead,
  body,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  body?: string;
}) {
  return (
    <header className="pt-32 lg:pt-40 pb-12 lg:pb-16 px-6 lg:px-8 mx-auto max-w-7xl">
      <p className="flex items-center gap-3 font-sans text-[11px] tracking-[0.25em] uppercase text-villa-terracotta mb-6">
        <span className="h-px w-8 bg-villa-terracotta" />
        {eyebrow}
      </p>
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 lg:items-end">
        <h1 className="lg:col-span-7 font-serif font-light text-[clamp(2.4rem,6vw,4.75rem)] leading-[1.02] tracking-[-0.01em] text-foreground text-balance">
          {title}
        </h1>
        <div className="lg:col-span-5 lg:pb-2 space-y-4">
          <p className="font-sans text-base lg:text-lg text-foreground/80 leading-relaxed">{lead}</p>
          {body && <p className="font-sans text-sm lg:text-[0.95rem] text-muted-foreground leading-relaxed">{body}</p>}
        </div>
      </div>
      <ZelligeDivider align="left" className="mt-12 lg:mt-16" />
    </header>
  );
}
