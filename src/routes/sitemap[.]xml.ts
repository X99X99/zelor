import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { storefrontApiRequest } from "@/lib/shopify/client";
import { SITE_ORIGIN } from "@/lib/zelor/site";

/**
 * Plan du site.
 *
 * Les fiches produit sont lues chez Shopify, jamais inventées : un plan qui
 * déclare des URL inexistantes fait perdre la confiance des moteurs de
 * recherche bien plus vite qu'un plan incomplet.
 */

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

const HANDLES_QUERY = `
  query SitemapHandles($first: Int!) {
    products(first: $first) {
      edges { node { handle updatedAt } }
    }
  }
`;

type HandleEdge = { node: { handle: string; updatedAt: string } };

/** Échappe les cinq caractères que XML n'accepte pas tels quels. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function fetchProductEntries(): Promise<SitemapEntry[]> {
  try {
    const data = await storefrontApiRequest(HANDLES_QUERY, { first: 250 });
    const edges = (data?.data?.products?.edges ?? []) as HandleEdge[];
    return edges
      .filter((edge) => Boolean(edge.node?.handle))
      .map((edge) => ({
        path: `/produit/${edge.node.handle}`,
        changefreq: "weekly" as const,
        priority: "0.8",
      }));
  } catch {
    // Shopify indisponible : on publie le plan des pages fixes plutôt que
    // de renvoyer une erreur. Un plan partiel vaut mieux qu'un plan absent.
    return [];
  }
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [...STATIC_PATHS, ...(await fetchProductEntries())];

        const urls = entries.map((entry) =>
          [
            `  <url>`,
            `    <loc>${escapeXml(`${SITE_ORIGIN}${entry.path}`)}</loc>`,
            entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : null,
            entry.priority ? `    <priority>${entry.priority}</priority>` : null,
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
