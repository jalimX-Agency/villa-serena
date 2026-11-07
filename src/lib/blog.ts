/** Blog helpers: anchor ids for H2s (table of contents) and locale-aware fields. */

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Adds an id to every <h2> and returns the headings for the table of contents. */
export function withToc(html: string) {
  const toc: { id: string; text: string }[] = [];
  const out = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    const id = slugify(text);
    toc.push({ id, text });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { html: out, toc };
}

export const BLOG_CATEGORIES = ["guides", "golf", "famille"] as const;
