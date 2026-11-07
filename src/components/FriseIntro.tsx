import { StarDivider } from "@/components/StarDivider";

// Zellige frieze tile from the client's mockup (« Frise et lettrine », 6 Nov 2026), pure SVG.
const FRIEZE =
  "url(\"data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%2744%27%20height%3D%2722%27%20viewBox%3D%270%200%2044%2022%27%3E%3Crect%20width%3D%2744%27%20height%3D%2722%27%20fill%3D%27%23F6F0E6%27/%3E%3Cg%20transform%3D%27translate%2822%2011%29%27%20fill%3D%27none%27%20stroke%3D%27%23C0664A%27%20stroke-width%3D%271.1%27%3E%3Crect%20x%3D%27-6%27%20y%3D%27-6%27%20width%3D%2712%27%20height%3D%2712%27/%3E%3Crect%20x%3D%27-6%27%20y%3D%27-6%27%20width%3D%2712%27%20height%3D%2712%27%20transform%3D%27rotate%2845%29%27/%3E%3C/g%3E%3Ccircle%20cx%3D%2722%27%20cy%3D%2711%27%20r%3D%271.8%27%20fill%3D%27%23B39B6E%27/%3E%3Cpath%20d%3D%27M0%2011%20L4%207%20L8%2011%20L4%2015%20Z%20M44%2011%20L40%207%20L36%2011%20L40%2015%20Z%27%20fill%3D%27%23B39B6E%27/%3E%3Cline%20x1%3D%270%27%20y1%3D%271%27%20x2%3D%2744%27%20y2%3D%271%27%20stroke%3D%27%23C0664A%27%20stroke-width%3D%27.8%27/%3E%3Cline%20x1%3D%270%27%20y1%3D%2721%27%20x2%3D%2744%27%20y2%3D%2721%27%20stroke%3D%27%23C0664A%27%20stroke-width%3D%27.8%27/%3E%3C/svg%3E\")";

function Frieze() {
  return <div aria-hidden className="h-[22px] bg-repeat-x" style={{ backgroundImage: FRIEZE, backgroundSize: "44px 22px" }} />;
}

function SideArch() {
  return (
    <svg aria-hidden viewBox="0 0 120 180" className="hidden md:block w-[120px] h-[180px] shrink-0">
      <path d="M10 180 L10 70 Q10 15 60 6 Q110 15 110 70 L110 180" fill="none" stroke="#B39B6E" strokeWidth="1.2" />
      <g transform="translate(60 92)" style={{ color: "#C0664A" }}>
        <rect x="-9" y="-9" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <rect x="-9" y="-9" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.3" transform="rotate(45)" />
        <circle r="3" fill="currentColor" />
      </g>
    </svg>
  );
}

/**
 * The villa's ambiance text as a graphic moment: cream band, terracotta zellige friezes,
 * drop cap, two side arches with the logo star (hidden on mobile), star rule underneath.
 */
export function FriseIntro({ eyebrow, text }: { eyebrow: string; text: string }) {
  return (
    <section className="bg-villa-cream">
      <Frieze />
      <div className="px-6 pt-[34px] pb-[30px] text-center">
        <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-villa-terracotta mb-3.5">— {eyebrow} —</p>
        <div className="mx-auto flex max-w-[1080px] items-center justify-center gap-[34px]">
          <SideArch />
          <p
            lang="fr"
            className="max-w-[720px] font-serif font-medium text-[21px] md:text-[25px] leading-[1.5] text-villa-ink text-justify [text-align-last:center] hyphens-auto [word-spacing:-0.02em] first-letter:float-left first-letter:pr-2.5 first-letter:pt-2 first-letter:font-semibold first-letter:text-[56px] md:first-letter:text-[74px] first-letter:leading-[0.8] first-letter:text-villa-terracotta-light"
          >
            {text}
          </p>
          <SideArch />
        </div>
        <StarDivider className="mx-auto mt-[18px] w-[220px]" tone="terracotta" />
      </div>
      <Frieze />
    </section>
  );
}
