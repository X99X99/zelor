import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { productsQueryOptions } from "@/lib/shopify/client";
import { ProductCard } from "@/components/zelor/ProductCard";
import { EmptyCatalog } from "@/components/zelor/EmptyCatalog";
import { Breadcrumbs } from "@/components/zelor/Breadcrumbs";
import { Reveal } from "@/components/zelor/Reveal";

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
          "Découvrez la collection ZELOR : des pièces choisies pour leur forme, leur fonction et leur finition.",
      },
      { property: "og:title", content: "Collection — ZELOR" },
      {
        property: "og:description",
        content: "Des pièces choisies pour leur équilibre entre forme, fonction et présence.",
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

  const { data, isLoading } = useQuery(productsQueryOptions(50));
  const all = useMemo(() => data ?? [], [data]);

  const lines = useMemo(
    () => ["Toutes", ...new Set(all.map((p) => p.node.productType).filter(Boolean))],
    [all],
  );

  const products = useMemo(() => {
    const term = query.trim().toLowerCase();
    let list = all.filter(
      (p) =>
        (line === "Toutes" || p.node.productType === line) &&
        (!term ||
          p.node.title.toLowerCase().includes(term) ||
          (p.node.productType ?? "").toLowerCase().includes(term)),
    );
    if (sort === "nouveaute") {
      list = [...list].sort((a, b) => b.node.createdAt.localeCompare(a.node.createdAt));
    } else if (sort === "alpha") {
      list = [...list].sort((a, b) => a.node.title.localeCompare(b.node.title, "fr"));
    } else if (sort === "ligne") {
      list = [...list].sort(
        (a, b) =>
          (a.node.productType ?? "").localeCompare(b.node.productType ?? "", "fr") ||
          a.node.title.localeCompare(b.node.title, "fr"),
      );
    }
    return list;
  }, [all, query, line, sort]);

  return (
    <>
      <Breadcrumbs items={[{ label: "Collection" }]} />
      <Reveal as="header" className="container-z pt-10 pb-8 md:pt-14">
        <h1 className="font-display text-4xl md:text-6xl">Collection</h1>
        <p className="mt-5 max-w-2xl text-base text-muted-foreground">
          La collection ZELOR réunit des pièces choisies pour leur équilibre entre forme, fonction
          et finition. Chaque référence est décrite avec précision : matière, usage, entretien et
          livraison, sans promesse approximative.
        </p>
      </Reveal>

      <Reveal delay={80} className="container-z pb-10">
        <hr className="glowline-z mb-6" />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
            <span className="eyebrow mr-2">Lignes</span>
            {lines.map((option) => {
              const active = option === line;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setLine(option)}
                  aria-pressed={active}
                  className={`chip-z min-h-9 px-4 text-sm ${
                    active ? "text-navy-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
            <div className="input-z flex min-h-11 items-center gap-2 px-4 text-foreground sm:w-60">
              <label htmlFor="collection-search" className="sr-only">
                Rechercher dans la collection
              </label>
              <Search
                aria-hidden="true"
                className="pointer-events-none size-4 shrink-0 text-muted-foreground"
              />
              <input
                id="collection-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rechercher une pièce"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
              />
            </div>
            <div className="input-z relative flex min-h-11 items-center px-4 text-foreground sm:w-56">
              <label htmlFor="collection-sort" className="sr-only">
                Ordre d'affichage
              </label>
              <select
                id="collection-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="w-full cursor-pointer appearance-none bg-transparent pr-6 text-sm outline-none"
              >
                <option value="nouveaute">Ordre de la maison</option>
                <option value="ligne">Par ligne</option>
                <option value="alpha">Ordre alphabétique</option>
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </Reveal>

      <div className="container-z pb-28">
        <p className="sr-only" role="status">
          {products.length} produit(s) affiché(s)
        </p>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-lux aspect-[4/5] rounded-[var(--radius-media)]" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyCatalog
            body={
              all.length === 0
                ? "Le catalogue Shopify ne contient encore aucune pièce."
                : "Essayez un autre terme ou revenez à la collection complète."
            }
          />
        ) : (
          <Reveal
            key={`${line}-${sort}-${query}`}
            delay={120}
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
