import sanitizeHtml from "sanitize-html";

/**
 * Article HTML is rendered with dangerouslySetInnerHTML, so everything saved from the admin
 * editor goes through this allowlist: structure, emphasis, links and simple tables only.
 */
export function sanitizeArticle(html: string) {
  return sanitizeHtml(html, {
    allowedTags: ["h2", "h3", "p", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li", "blockquote", "table", "thead", "tbody", "tr", "th", "td", "hr", "img", "figure", "figcaption"],
    allowedAttributes: { img: ["src", "alt"], a: ["href", "target", "rel"], th: ["colspan", "rowspan"], td: ["colspan", "rowspan"] },
    allowedSchemes: ["https", "http", "mailto", "tel"],
    // Images only from https (our R2 bucket in practice): no data: or javascript: URLs.
    allowedSchemesByTag: { img: ["https"] },
    allowProtocolRelative: false,
    transformTags: {
      // External links open in a new tab, safely; internal links stay as they are.
      a: (tagName, attribs) => {
        const href = attribs.href ?? "";
        const external = /^https?:\/\//.test(href) && !href.includes("villaserenamarrakech.com");
        const out: Record<string, string> = external ? { href, target: "_blank", rel: "noopener noreferrer" } : { href };
        return { tagName, attribs: out };
      },
    },
    // Empty paragraphs the editor leaves behind.
    exclusiveFilter: (frame) =>
      (frame.tag === "p" && !frame.text.trim() && !frame.mediaChildren.length) || (frame.tag === "img" && !frame.attribs.src),
  }).trim();
}

/** Plain text word count, for the reading time (≈ 200 words a minute). */
export function readingMinutes(html: string) {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
