/** Small night-blue band of three facts (Services blocks, client brief ch. 08). */
export function FactsBand({ items }: { items: string[] }) {
  return (
    <ul className="grid sm:grid-cols-3 gap-px bg-villa-gold/25 border border-villa-gold/25">
      {items.map((s) => (
        <li key={s} className="bg-villa-ink px-4 py-5 text-center font-serif text-xl text-villa-gold">
          {s}
        </li>
      ))}
    </ul>
  );
}
