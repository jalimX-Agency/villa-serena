import { headers } from "next/headers";
import type { MetadataRoute } from "next";

export default async function robots(): Promise<MetadataRoute.Robots> {
  // Preview domain: block everything (client brief ch. 13).
  if ((await headers()).get("host")?.endsWith(".vercel.app")) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/"] },
      {
        // Search engines and AI assistants named explicitly (SEO audit of 11 Nov 2026).
        userAgent: [
          "Googlebot",
          "Bingbot",
          "Applebot",
          "DuckDuckBot",
          "Google-Extended",
          "Applebot-Extended",
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-SearchBot",
          "Claude-User",
          "anthropic-ai",
          "PerplexityBot",
          "Perplexity-User",
          "Meta-ExternalAgent",
          "Amazonbot",
          "CCBot",
          "cohere-ai",
        ],
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: "https://www.villaserenamarrakech.com/sitemap.xml",
  };
}
