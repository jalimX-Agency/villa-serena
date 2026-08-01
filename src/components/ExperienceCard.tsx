import Image from "next/image";
import type { Experience } from "@prisma/client";

export function ExperienceCard({ exp, locale }: { exp: Experience; locale: string }) {
  const isEn = locale === "en";
  const title = isEn && exp.titleEn ? exp.titleEn : exp.title;
  const subtitle = isEn && exp.subtitleEn ? exp.subtitleEn : exp.subtitle;
  const description = isEn && exp.descriptionEn ? exp.descriptionEn : exp.description;

  return (
    <div className="bg-card border border-border overflow-hidden">
      <div className="relative aspect-[4/3]">
        {exp.image && (
          <Image
            src={exp.image}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover"
          />
        )}
      </div>
      <div className="p-5">
        <h3 className="font-serif text-lg text-foreground mb-1">{title}</h3>
        {subtitle && <p className="font-sans text-xs text-villa-terracotta uppercase tracking-wide mb-2">{subtitle}</p>}
        {description && (
          <p className="font-sans text-sm text-foreground/70 leading-relaxed mb-3">{description}</p>
        )}
        {exp.duration && (
          <p className="font-sans text-xs text-muted-foreground">{exp.duration}</p>
        )}
      </div>
    </div>
  );
}
