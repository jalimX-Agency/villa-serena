import { cn } from "@/lib/utils";

/** The eight-point star from the logo, between two sand rules — the site's section separator. */
export function StarDivider({ className, tone = "sand" }: { className?: string; tone?: "sand" | "terracotta" }) {
  const star = tone === "sand" ? "var(--villa-gold)" : "var(--villa-terracotta-light)";
  return (
    <div aria-hidden className={cn("flex items-center gap-3", className)}>
      <span className="h-px flex-1 bg-villa-gold/60" />
      <svg viewBox="-10 -10 20 20" className="size-5 shrink-0" style={{ color: star }}>
        <rect x="-6.5" y="-6.5" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1" />
        <rect x="-6.5" y="-6.5" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(45)" />
        <circle r="2.2" fill="currentColor" />
      </svg>
      <span className="h-px flex-1 bg-villa-gold/60" />
    </div>
  );
}
