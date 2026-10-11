import { cn } from "@/lib/utils";

/** Section divider from the design system: three zellige diamonds instead of a plain rule. */
export function ZelligeDivider({ className, align = "center" }: { className?: string; align?: "center" | "left" }) {
  return (
    <div
      aria-hidden
      className={cn("flex items-center gap-2.5", align === "center" && "justify-center", className)}
    >
      <span className="h-px w-12 sm:w-20 bg-border" />
      <span className="size-2 rotate-45 bg-villa-gold" />
      <span className="size-1.5 rotate-45 bg-villa-terracotta" />
      <span className="size-2 rotate-45 bg-villa-gold" />
      <span className={cn("h-px bg-border", align === "center" ? "w-12 sm:w-20" : "flex-1")} />
    </div>
  );
}
