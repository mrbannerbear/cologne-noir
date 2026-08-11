import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/order/confirmation"],
      },
      // AI crawlers — explicitly allowed for AEO citation visibility
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
      },
      // Training-only crawler (no citation benefit) — currently allowed by default.
      // Uncomment below to block if desired in future:
      // {
      //   userAgent: "CCBot",
      //   disallow: "/",
      // },
    ],
    sitemap: "https://colognenoir.com/sitemap.xml",
  };
}