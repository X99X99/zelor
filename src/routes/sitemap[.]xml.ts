import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { DEMO_PRODUCTS } from "@/lib/zelor/content";

// TODO: remplacer par l'URL du projet dès qu'un nom ou un domaine est défini.
const BASE_URL = "";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

/** Pages publiques indexables : le panier et le compte restent hors index. */
const STATIC_PATHS: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/collection", changefreq: "weekly", priority: "0.9" },
  { path: "/nouveautes", changefreq: "weekly", priority: "0.8" },
  { path: "/univers", changefreq: "monthly", priority: "0.7" },
  { path: "/qualite", changefreq: "monthly", priority: "0.7" },
  { path: "/journal", changefreq: "weekly", priority: "0.7" },
  { path: "/a-propos", changefreq: "monthly", priority: "0.6" },
  { path: "/aide", changefreq: "monthly", priority: "0.5" },
  { path: "/contact", changefreq: "monthly", priority: "0.5" },
  { path: "/livraison", changefreq: "monthly", priority: "0.5" },
  { path: "/retours", changefreq: "monthly", priority: "0.5" },
  { path: "/paiements", changefreq: "monthly", priority: "0.5" },
  { path: "/suivi-commande", changefreq: "monthly", priority: "0.4" },
  { path: "/mentions-legales", changefreq: "yearly", priority: "0.3" },
  { path: "/cgv", changefreq: "yearly", priority: "0.3" },
  { path: "/confidentialite", changefreq: "yearly", priority: "0.3" },
  { path: "/cookies", changefreq: "yearly", priority: "0.3" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          ...STATIC_PATHS,
          ...DEMO_PRODUCTS.map((product) => ({
            path: `/produit/${product.slug}`,
            changefreq: "weekly" as const,
            priority: "0.8",
          })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
