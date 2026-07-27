import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeUp} className={cn("flex items-center gap-3 mb-4", className)}>
      <span className="h-px w-8 bg-villa-terracotta" />
      <span className="font-sans text-[11px] tracking-[0.25em] uppercase text-villa-terracotta">
        {children}
      </span>
    </motion.div>
  );
}
