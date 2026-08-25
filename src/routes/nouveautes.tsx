import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { productsQueryOptions } from "@/lib/shopify/client";
import { ProductCard } from "@/components/zelor/ProductCard";
import { EmptyCatalog } from "@/components/zelor/EmptyCatalog";
import { Breadcrumbs } from "@/components/zelor/Breadcrumbs";
import { Reveal } from "@/components/zelor/Reveal";

export const Route = createFileRoute("/nouveautes")({
  head: () => ({
    meta: [
      { title: "Nouveautés — ZELOR — Maison éditoriale" },
      {
        name: "description",
        content:
          "Les dernières pièces entrées dans la sélection ZELOR : arrivées récentes de la Maison.",
      },
      { property: "og:title", content: "Nouveautés — ZELOR — Maison éditoriale" },
      {
        property: "og:description",
        content: "Les dernières pièces entrées dans la sélection ZELOR.",
      },
      { property: "og:url", content: "/nouveautes" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/nouveautes" }],
  }),
  component: NewPage,
});

function NewPage() {
  const { data, isLoading } = useQuery(productsQueryOptions(12));
  const products = [...(data ?? [])]
    .sort((a, b) => b.node.createdAt.localeCompare(a.node.createdAt))
    .slice(0, 8);

  return (
    <>
      <Breadcrumbs items={[{ label: "Nouveautés" }]} />
      <Reveal as="header" className="container-z pt-10 pb-8 md:pt-14">
        <h1 className="font-display text-4xl md:text-6xl">Nouveautés</h1>
        <p className="mt-5 max-w-2xl text-base text-muted-foreground">
          Les dernières pièces entrées dans la sélection, présentées dès leur arrivée. Peu
          d'annonces, et seulement lorsqu'elles comptent.
        </p>
      </Reveal>
      <div className="container-z pb-24">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-lux aspect-[4/5] rounded-[var(--radius-media)]" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <>
            <EmptyCatalog body="Le catalogue Shopify ne contient encore aucune pièce." />
            <Link to="/collection" className="link-underline mt-4 inline-block text-sm">
              Voir la collection
            </Link>
          </>
        ) : (
          <Reveal
            delay={100}
            className="stagger-z grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4"
          >
            {products.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </Reveal>
        )}
      </div>
    </>
  );
}
