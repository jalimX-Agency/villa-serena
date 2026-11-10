// Generated from the villa icon pack (villa-serena-icones-sprite.svg, 10 Nov 2026). Line icons on a 48 grid.
// Colours: --villa-icon-color (default: currentColor) and --villa-icon-accent (default: terracotta).
const PATHS = {
  "accueil": "<path stroke=\"var(--villa-icon-accent,#C0664A)\" d=\"M13 14.5c0-3 .8-6 2.5-8.5M15.5 6c-2-.6-4.2 0-5.5 1.6M15.5 6c1.9-1.1 4.3-1 5.8.3M15.5 6c-.6-1.8-2.1-3-3.9-3.3M15.5 6c1.4-1.2 3.3-1.6 5-1\"/><path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M8 41V18H8.0V16.5H9.0V15H11.0V16.5H12.0V18H13.6V16.5H14.6V15H16.6V16.5H17.6V18H19.2V16.5H20.2V15H22.2V16.5H23.2V18H24.8V16.5H25.8V15H27.8V16.5H28.8V18H30.4V16.5H31.4V15H33.4V16.5H34.4V18H36.0V16.5H37.0V15H39.0V16.5H40.0V18H40V41\"/><path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M4 41h40\"/><path stroke=\"var(--villa-icon-accent,#C0664A)\" d=\"M20.5 41v-8.5a4.3 4.3 0 1 1 7 0V41\"/><path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M32 30v-3.2a1.6 1.6 0 0 1 3.2 0V30z\"/><path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M12.8 30v-3.2a1.6 1.6 0 0 1 3.2 0V30z\"/>",
  "climatisation": "<rect stroke=\"var(--villa-icon-color,currentColor)\" x=\"6\" y=\"9\" width=\"36\" height=\"14\" rx=\"3\"/><path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M10 18h28\"/><circle stroke=\"var(--villa-icon-accent,#C0664A)\" cx=\"36\" cy=\"13.5\" r=\"1\" fill=\"var(--villa-icon-accent,#C0664A)\" stroke=\"none\"/><path stroke=\"var(--villa-icon-accent,#C0664A)\" d=\"M15 28l-3 9M24 28v10M33 28l3 9\"/><path stroke=\"var(--villa-icon-accent,#C0664A)\" d=\"M12 41.5h0M24 42.5h0M36 41.5h0\" stroke-width=\"2.4\"/>",
  "lit-de-bebe": "<path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M8 11v29M40 11v29M8 16h32M8 34h32\"/><path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M14 16v18M20 16v18M26 16v18M32 16v18\"/><path stroke=\"var(--villa-icon-accent,#C0664A)\" d=\"M10 30.5h28\"/><path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M8 40h3M37 40h3\"/>",
  "bureau": "<path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M5 28h38\"/><path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M9 28v13M39 28v13\"/><rect stroke=\"var(--villa-icon-color,currentColor)\" x=\"28\" y=\"28\" width=\"11\" height=\"8\" rx=\"1\"/><path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M31.5 32h4\"/><rect stroke=\"var(--villa-icon-accent,#C0664A)\" x=\"11\" y=\"14\" width=\"16\" height=\"11\" rx=\"1.2\"/><path stroke=\"var(--villa-icon-accent,#C0664A)\" d=\"M8.5 28l2.5-3h16l2.5 3\"/>",
  "douche": "<path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M10 42V12a5 5 0 0 1 5-5h9a5 5 0 0 1 5 5v3\"/><path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M22 19a7 4 0 0 1 14 0z\"/><path stroke=\"var(--villa-icon-accent,#C0664A)\" d=\"M24 24l-1 3M29 24v3M34 24l1 3M23 31l-1 3M29 31v3M35 31l1 3M22 38l-1 3M29 38v3M36 38l1 3\"/>",
  "wifi": "<path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M6 19a26 26 0 0 1 36 0\"/><path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M11.5 25a18 18 0 0 1 25 0\"/><path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M17 31a10 10 0 0 1 14 0\"/><circle stroke=\"var(--villa-icon-accent,#C0664A)\" cx=\"24\" cy=\"37\" r=\"2.4\" fill=\"var(--villa-icon-accent,#C0664A)\" stroke=\"none\"/>",
  "coffre-fort": "<rect stroke=\"var(--villa-icon-color,currentColor)\" x=\"7\" y=\"8\" width=\"34\" height=\"30\" rx=\"3\"/><path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M12 38v3M36 38v3\"/><circle stroke=\"var(--villa-icon-accent,#C0664A)\" cx=\"22\" cy=\"23\" r=\"6.5\"/><path stroke=\"var(--villa-icon-accent,#C0664A)\" d=\"M22 16.5v2M22 27.5v2M15.5 23h2M26.5 23h2\"/><circle stroke=\"var(--villa-icon-accent,#C0664A)\" cx=\"22\" cy=\"23\" r=\"1.6\" fill=\"var(--villa-icon-accent,#C0664A)\" stroke=\"none\"/><path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M35 18v10\"/>",
  "chauffage-electrique": "<rect stroke=\"var(--villa-icon-color,currentColor)\" x=\"7\" y=\"18\" width=\"34\" height=\"20\" rx=\"3\"/><path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M13 22v12M18.5 22v12M24 22v12M29.5 22v12M35 22v12\"/><path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M11 38v3M37 38v3\"/><path stroke=\"var(--villa-icon-accent,#C0664A)\" d=\"M16 14c-1.5-1.5 1.5-3 0-5M24 14c-1.5-1.5 1.5-3 0-5M32 14c-1.5-1.5 1.5-3 0-5\"/>",
  "wc": "<rect stroke=\"var(--villa-icon-color,currentColor)\" x=\"9\" y=\"7\" width=\"10\" height=\"16\" rx=\"2\"/><path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M19 22h20a1.5 1.5 0 0 1 1.5 1.5v0a11 11 0 0 1-11 11h-3\"/><path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M19 22v4a8.5 8.5 0 0 0 7.5 8.5\"/><path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M24 34.5l-2 6.5h12l-2-6.5\"/><path stroke=\"var(--villa-icon-accent,#C0664A)\" d=\"M12.5 11.5h3\"/>",
  "machine-a-cafe": "<path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M11 7h24v34H11z\"/><path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M11 14h24\"/><path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M19 14v4h8v-4\"/><path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M11 37h24\"/><path stroke=\"var(--villa-icon-accent,#C0664A)\" d=\"M16 27h12v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4z\"/><path stroke=\"var(--villa-icon-accent,#C0664A)\" d=\"M28 28.5h1.5a1.75 1.75 0 0 1 0 3.5H28\"/><path stroke=\"var(--villa-icon-accent,#C0664A)\" d=\"M23 20v4\"/>",
  "bouteille-d-eau": "<path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M21 5h6v5h-6z\"/><path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M21 10c0 3-5 4-5 9v20a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V19c0-5-5-6-5-9\"/><path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M16 24h16M16 34h16\"/><path stroke=\"var(--villa-icon-accent,#C0664A)\" d=\"M24 26.5c-1.8 2.3-2.6 3.6-2.6 4.6a2.6 2.6 0 0 0 5.2 0c0-1-.8-2.3-2.6-4.6z\"/>",
  "seche-cheveux": "<path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M8 14h20a8 8 0 0 1 0 16H18\"/><path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M8 14v6h4\"/><circle stroke=\"var(--villa-icon-color,currentColor)\" cx=\"28\" cy=\"22\" r=\"3.5\"/><path stroke=\"var(--villa-icon-color,currentColor)\" d=\"M18 30l-2 12h6l1.5-12\"/><path stroke=\"var(--villa-icon-accent,#C0664A)\" d=\"M3 15h2M3 19h2M2 23h3\"/>"
} as const;

export type VillaIconName = keyof typeof PATHS;

export function VillaIcon({ name, size = 24, className, title }: { name: VillaIconName; size?: number; className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      aria-label={title}
      dangerouslySetInnerHTML={{ __html: PATHS[name] }}
    />
  );
}
