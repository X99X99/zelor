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
    } else if (sort === "alpha") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name, "fr"));
    } else if (sort === "ligne") {
      list = [...list].sort(
        (a, b) => a.line.localeCompare(b.line, "fr") || a.name.localeCompare(b.name, "fr"),
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

      <div className="container-z pb-10">
        <hr className="glowline-z mb-6" />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Lignes : des onglets éditoriaux, pas un menu déroulant */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="eyebrow">Lignes</span>
            {lines.map((option) => {
              const active = option === line;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setLine(option)}
                  aria-pressed={active}
                  className={`link-underline press-z text-sm transition-opacity duration-[var(--dur-2)] ease-[var(--ease-lux)] ${
                    active
                      ? "text-foreground opacity-100 after:origin-left after:scale-x-100"
                      : "text-muted-foreground opacity-80 hover:opacity-100"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <div className="relative">
              <label htmlFor="collection-search" className="sr-only">
                Rechercher dans la collection
              </label>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-0 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <input
                id="collection-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rechercher une pièce"
                className="field-z min-h-11 w-full border-b border-input bg-transparent pl-6 text-sm outline-none placeholder:text-muted-foreground/70 sm:w-56"
              />
            </div>
            <div className="relative">
              <label htmlFor="collection-sort" className="sr-only">
                Ordre d'affichage
              </label>
              <select
                id="collection-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="field-z min-h-11 w-full cursor-pointer appearance-none border-b border-input bg-transparent pr-7 text-sm outline-none sm:w-52"
              >
                <option value="nouveaute">Ordre de la maison</option>
                <option value="ligne">Par ligne</option>
                <option value="alpha">Ordre alphabétique</option>
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-0 size-4 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container-z pb-28">
        <p className="sr-only" role="status">
          {products.length} produit(s) affiché(s)
        </p>
        {products.length === 0 ? (
          <div className="surface-light aura-z border border-border/70 px-6 py-24 text-center">
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
              Voir toute la collection
            </button>
          </div>
        ) : (
          <div
            key={`${line}-${sort}-${query}`}
            className="stagger-z grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4"
          >
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>

    </>
  );
}
