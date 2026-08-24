import { createFileRoute, Link } from "@tanstack/react-router";

import { DEMO_PRODUCTS } from "@/lib/zelor/content";
import { ProductCard } from "@/components/zelor/ProductCard";
import { Breadcrumbs } from "@/components/zelor/Breadcrumbs";
import { DraftNote } from "@/components/zelor/Placeholder";

export const Route = createFileRoute("/nouveautes")({
  head: () => ({
    meta: [
      { title: "Nouveautés — ZELOR" },
      {
        name: "description",
        content:
          "Les dernières pièces entrées dans la sélection ZELOR. Collection en préparation, arrivées annoncées prochainement.",
      },
      { property: "og:title", content: "Nouveautés — ZELOR" },
      {
        property: "og:description",
        content: "Les dernières pièces entrées dans la sélection ZELOR.",
      },
      { property: "og:url", content: "/nouveautes" },
    ],
    links: [{ rel: "canonical", href: "/nouveautes" }],
  }),
  component: NewPage,
});

function NewPage() {
  const products = DEMO_PRODUCTS.filter((p) => p.isNew);

  return (
    <>
      <Breadcrumbs items={[{ label: "Nouveautés" }]} />
      <header className="container-z pt-10 pb-8 md:pt-14">
        <h1 className="font-display text-4xl md:text-6xl">Nouveautés</h1>
        <p className="mt-5 max-w-2xl text-base text-muted-foreground">
          Les dernières pièces entrées dans la sélection. Cette page se remplira
          automatiquement à partir de la collection « Nouveautés » de Shopify.
        </p>
        <div className="mt-6 max-w-2xl">
          <DraftNote label="Démonstration">
            Exemples de mise en page. Aucun produit n'est en vente.
          </DraftNote>
        </div>
      </header>
      <div className="container-z pb-24">
        {products.length === 0 ? (
          <div className="border border-dashed border-border px-6 py-20 text-center">
            <h2 className="font-display text-2xl">
              Les prochaines pièces arrivent bientôt.
            </h2>
            <Link to="/collection" className="link-underline mt-4 inline-block text-sm">
              Voir la collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
