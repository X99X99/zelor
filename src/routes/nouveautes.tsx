import { createFileRoute, Link } from "@tanstack/react-router";

import { DEMO_PRODUCTS } from "@/lib/zelor/content";
import { ProductCard } from "@/components/zelor/ProductCard";
import { Breadcrumbs } from "@/components/zelor/Breadcrumbs";
import { Reveal } from "@/components/zelor/Reveal";

export const Route = createFileRoute("/nouveautes")({
  head: () => ({
    meta: [
      { title: "Nouveautés — ZELOR" },
      {
        name: "description",
        content:
          "Les dernières pièces entrées dans la sélection ZELOR : arrivées récentes de la Maison.",
      },
      { property: "og:title", content: "Nouveautés — ZELOR" },
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
  const products = DEMO_PRODUCTS.filter((p) => p.isNew);

  return (
    <>
      <Breadcrumbs items={[{ label: "Nouveautés" }]} />
      <Reveal as="header" className="container-z pt-10 pb-8 md:pt-14">
        <h1 className="font-display text-4xl md:text-6xl">Nouveautés</h1>
        <p className="mt-5 max-w-2xl text-base text-muted-foreground">
          Les dernières pièces entrées dans la sélection, présentées dès leur
          arrivée. Peu d'annonces, et seulement lorsqu'elles comptent.
        </p>
      </Reveal>
      <div className="container-z pb-24">
        {products.length === 0 ? (
          <Reveal className="surface-light aura-z rounded-3xl border border-border/70 px-6 py-24 text-center">
            <h2 className="font-display text-2xl">
              Les prochaines pièces arrivent bientôt.
            </h2>
            <Link to="/collection" className="link-underline mt-4 inline-block text-sm">
              Voir la collection
            </Link>
          </Reveal>
        ) : (
          <Reveal
            delay={100}
            className="stagger-z grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4"
          >
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </Reveal>
        )}
      </div>
    </>
  );
}
