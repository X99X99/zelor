import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";

import {
  DEMO_PRODUCTS,
  PLACEHOLDER,
  getProduct,
  type DemoProduct,
} from "@/lib/zelor/content";
import { useCart } from "@/lib/zelor/cart";
import { Breadcrumbs } from "@/components/zelor/Breadcrumbs";
import { DraftNote, ImageSlot, Missing } from "@/components/zelor/Placeholder";
import { ProductCard } from "@/components/zelor/ProductCard";

export const Route = createFileRoute("/produit/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Produit indisponible — ZELOR" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { product } = loaderData;
    const description = `${product.name} — ${product.line}. Fiche produit ZELOR en préparation : caractéristiques, matières et disponibilité à venir.`;
    return {
      meta: [
        { title: `${product.name} — ZELOR` },
        { name: "description", content: description },
        { name: "robots", content: "noindex" },
        { property: "og:title", content: `${product.name} — ZELOR` },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/produit/${product.slug}` },
      ],
      links: [{ rel: "canonical", href: `/produit/${product.slug}` }],
    };
  },
  notFoundComponent: ProductNotFound,
  component: ProductPage,
});

function ProductNotFound() {
  return (
    <div className="container-z py-24 text-center">
      <h1 className="font-display text-4xl">Cette pièce n'est pas disponible.</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Elle a peut-être été retirée du catalogue.
      </p>
      <Link
        to="/collection"
        className="mt-8 inline-flex min-h-12 items-center bg-primary px-6 text-sm tracking-[0.14em] text-primary-foreground uppercase"
      >
        Voir la collection
      </Link>
    </div>
  );
}

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: DemoProduct };
  const { add } = useCart();
  const [variant, setVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const related = DEMO_PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Collection", to: "/collection" },
          { label: product.name },
        ]}
      />

      <div className="container-z grid gap-10 pt-8 pb-16 lg:grid-cols-2 lg:gap-16">
        {/* Galerie */}
        <div className="space-y-3">
          <ImageSlot
            tone={product.tone}
            ratio="aspect-4/5"
            caption="Visuel principal à fournir (zoom, WebP/AVIF)"
          />
          <div className="grid grid-cols-3 gap-3">
            <ImageSlot tone="sand" ratio="aspect-square" caption="Vue 2" />
            <ImageSlot tone="stone" ratio="aspect-square" caption="Vue 3" />
            <ImageSlot tone="forest" ratio="aspect-square" caption="Détail" />
          </div>
        </div>

        {/* Achat */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">{product.line}</p>
          <h1 className="mt-3 font-display text-3xl md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 text-lg">
            <Missing>
              {PLACEHOLDER.price} {PLACEHOLDER.currency}
            </Missing>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Disponibilité : synchronisée avec l'inventaire Shopify.
          </p>

          <div className="mt-8">
            <DraftNote label="Démonstration">
              Produit d'exemple, non disponible à la vente. Le bouton
              ci-dessous n'ouvre aucun paiement.
            </DraftNote>
          </div>

          <fieldset className="mt-8">
            <legend className="eyebrow">Variante</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.variants.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setVariant(option)}
                  aria-pressed={variant === option}
                  className={`min-h-11 border px-4 text-sm transition-colors ${
                    variant === option
                      ? "border-foreground bg-primary text-primary-foreground"
                      : "border-input hover:bg-accent"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 flex items-center gap-4">
            <span className="eyebrow">Quantité</span>
            <div className="flex items-center border border-input">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Diminuer la quantité"
                className="size-11 text-lg"
              >
                −
              </button>
              <span
                aria-live="polite"
                className="w-10 text-center text-sm tabular-nums"
              >
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                aria-label="Augmenter la quantité"
                className="size-11 text-lg"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              add({
                slug: product.slug,
                name: product.name,
                variant,
                quantity,
              });
              setAdded(true);
            }}
            className="mt-8 flex min-h-13 w-full items-center justify-center bg-primary px-6 text-sm tracking-[0.14em] text-primary-foreground uppercase transition-opacity hover:opacity-85"
          >
            Ajouter au panier
          </button>
          <p className="mt-3 text-xs text-muted-foreground">
            Paiement accéléré (Shop Pay, Apple Pay, Google Pay) à activer depuis
            Shopify Checkout.
          </p>
          {added && (
            <p role="status" className="mt-4 text-sm">
              Ajouté au panier de démonstration.{" "}
              <Link to="/panier" className="link-underline">
                Voir le panier
              </Link>
            </p>
          )}

          <p className="mt-6 text-sm text-foreground/80">
            Retours sous <Missing>[DÉLAI À RENSEIGNER]</Missing> — paiement
            sécurisé via Shopify — service client en français et en anglais.
          </p>

          {/* Bénéfices */}
          <ul className="mt-8 space-y-2 text-sm">
            {product.benefits.map((benefit) => (
              <li key={benefit} className="flex gap-3">
                <span aria-hidden="true" className="text-gold">
                  —
                </span>
                <Missing>{benefit}</Missing>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Informations détaillées */}
      <div className="container-z grid gap-10 pb-20 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-8">
          <section>
            <h2 className="font-display text-2xl">Description</h2>
            <p className="mt-3 text-base text-foreground/85">{product.intro}</p>
          </section>
          <section>
            <h2 className="font-display text-2xl">Caractéristiques</h2>
            <dl className="mt-3 divide-y divide-border border-y border-border text-sm">
              {[
                ["Dimensions", "[DIMENSIONS À RENSEIGNER]"],
                ["Poids", "[POIDS À RENSEIGNER]"],
                ["Composition / matières", "[MATIÈRES À RENSEIGNER]"],
                ["Origine", "[ORIGINE À RENSEIGNER]"],
                ["Entretien", "[ENTRETIEN À RENSEIGNER]"],
                ["Référence", "[SKU SHOPIFY]"],
              ].map(([term, value]) => (
                <div key={term} className="flex justify-between gap-6 py-3">
                  <dt className="text-muted-foreground">{term}</dt>
                  <dd className="text-right">
                    <Missing>{value}</Missing>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
        <div className="space-y-8">
          <section>
            <h2 className="font-display text-2xl">Livraison et retours</h2>
            <p className="mt-3 text-sm text-foreground/85">
              Expédition depuis <Missing>[PAYS D'EXPÉDITION]</Missing>, délai{" "}
              <Missing>[DÉLAI À RENSEIGNER]</Missing>, frais{" "}
              <Missing>[FRAIS DE PORT À RENSEIGNER]</Missing>. Retours et
              remboursements selon les conditions à publier.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <Link to="/livraison" className="link-underline">
                Livraison
              </Link>
              <Link to="/retours" className="link-underline">
                Retours
              </Link>
            </div>
          </section>
          <section>
            <h2 className="font-display text-2xl">Garantie légale</h2>
            <p className="mt-3 text-sm text-foreground/85">
              Les garanties légales applicables seront précisées dans les CGV
              après vérification juridique. Aucun engagement contractuel n'est
              formulé sur cette page.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl">Questions fréquentes</h2>
            <div className="mt-3 divide-y divide-border border-y border-border">
              {[
                "Quel est le délai de livraison ?",
                "Comment entretenir cette pièce ?",
                "Puis-je échanger ma commande ?",
              ].map((question) => (
                <details key={question} className="group py-3">
                  <summary className="cursor-pointer list-none text-sm font-medium">
                    {question}
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground">
                    <Missing>[RÉPONSE À RENSEIGNER]</Missing>
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </div>

      <section
        aria-labelledby="related-title"
        className="container-z pb-24"
      >
        <h2 id="related-title" className="font-display text-2xl md:text-3xl">
          À découvrir également
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6">
          {related.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
      </section>

      {/* Barre d'achat fixe mobile */}
      <div className="sticky bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur-sm lg:hidden">
        <div className="container-z flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{product.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {PLACEHOLDER.price}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              add({ slug: product.slug, name: product.name, variant, quantity });
              setAdded(true);
            }}
            className="min-h-12 shrink-0 bg-primary px-5 text-xs tracking-[0.14em] text-primary-foreground uppercase"
          >
            Ajouter
          </button>
        </div>
      </div>
    </>
  );
}
