import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { DEMO_PRODUCTS } from "@/lib/zelor/content";
import { ProductCard } from "@/components/zelor/ProductCard";
import { Breadcrumbs } from "@/components/zelor/Breadcrumbs";

type CollectionSearch = { q?: string };

export const Route = createFileRoute("/collection")({
  validateSearch: (search: Record<string, unknown>): CollectionSearch => {
    const raw = search["q"];
    return typeof raw === "string" && raw ? { q: raw } : {};
  },
  head: () => ({
    meta: [
      { title: "Collection — ZELOR" },
      {
        name: "description",
        content:
          "Découvrez la collection ZELOR : des pièces choisies pour leur forme, leur fonction et leur finition. Catalogue en préparation.",
      },
      { property: "og:title", content: "Collection — ZELOR" },
      {
        property: "og:description",
        content:
          "Des pièces choisies pour leur équilibre entre forme, fonction et présence.",
      },
      { property: "og:url", content: "/collection" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/collection" }],
  }),
  component: CollectionPage,
});

function CollectionPage() {
  const { q } = Route.useSearch();
  const [query, setQuery] = useState(q ?? "");
  const [line, setLine] = useState("Toutes");
  const [sort, setSort] = useState("nouveaute");

  const lines = useMemo(
    () => ["Toutes", ...new Set(DEMO_PRODUCTS.map((p) => p.line))],
    [],
  );

  const products = useMemo(() => {
    const term = query.trim().toLowerCase();
    let list = DEMO_PRODUCTS.filter(
      (p) =>
        (line === "Toutes" || p.line === line) &&
        (!term ||
          p.name.toLowerCase().includes(term) ||
          p.line.toLowerCase().includes(term)),
    );
    if (sort === "nouveaute") {
      list = [...list].sort(
        (a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)),
      );
    }
    return list;
  }, [query, line, sort]);

  return (
    <>
      <Breadcrumbs items={[{ label: "Collection" }]} />
      <header className="container-z pt-10 pb-8 md:pt-14">
        <h1 className="font-display text-4xl md:text-6xl">Collection</h1>
        <p className="mt-5 max-w-2xl text-base text-muted-foreground">
          La collection ZELOR réunit des pièces choisies pour leur équilibre
          entre forme, fonction et finition. Chaque référence est décrite avec
          précision : matière, usage, entretien et livraison, sans promesse
          approximative.
        </p>
      </header>

      <div className="container-z flex flex-col gap-4 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div>
            <label htmlFor="collection-search" className="sr-only">
              Rechercher dans la collection
            </label>
            <input
              id="collection-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher"
              className="min-h-11 w-full border border-input bg-transparent px-3 text-sm outline-none sm:w-56"
            />
          </div>
          <div>
            <label htmlFor="collection-line" className="sr-only">
              Filtrer par ligne
            </label>
            <select
              id="collection-line"
              value={line}
              onChange={(event) => setLine(event.target.value)}
              className="min-h-11 w-full border border-input bg-transparent px-3 text-sm sm:w-48"
            >
              {lines.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="collection-sort" className="text-sm">
            Trier par
          </label>
          <select
            id="collection-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="min-h-11 border border-input bg-transparent px-3 text-sm"
          >
            <option value="nouveaute">Nouveautés</option>
            <option value="prix-asc" disabled>
              Prix croissant (prix à renseigner)
            </option>
            <option value="prix-desc" disabled>
              Prix décroissant (prix à renseigner)
            </option>
            <option value="popularite" disabled>
              Popularité (données de ventes requises)
            </option>
          </select>
        </div>
      </div>

      <div className="container-z pb-24">
        <p className="sr-only" role="status">
          {products.length} produit(s) affiché(s)
        </p>
        {products.length === 0 ? (
          <div className="surface-light border border-border/70 px-6 py-24 text-center">
            <h2 className="font-display text-2xl">Aucun résultat</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Essayez un autre terme ou revenez à la collection complète.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setLine("Toutes");
              }}
              className="btn-lux mt-6"
            >
              Réinitialiser
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
        <p className="mt-12 text-center text-xs text-muted-foreground">
          Pagination ou chargement progressif à activer dès que le catalogue
          dépasse 24 références.
        </p>
      </div>
    </>
  );
}
