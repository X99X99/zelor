import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";

import {
  DEMO_PRODUCTS,
  PRICING,
  getProduct,
  type DemoProduct,
} from "@/lib/zelor/content";
import { useCart } from "@/lib/zelor/cart";
import { Breadcrumbs } from "@/components/zelor/Breadcrumbs";
import { ImageSlot } from "@/components/zelor/Placeholder";
import { ProductCard } from "@/components/zelor/ProductCard";
import { Reveal } from "@/components/zelor/Reveal";

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
    const description = `${product.name}, ${product.line} — une pièce ZELOR choisie pour son allure, sa justesse et sa tenue dans le temps.`;
    return {
      meta: [
        { title: `${product.name} — ZELOR` },
        { name: "description", content: description },
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
        className="btn-lux mt-8"
      >
        Voir la collection
      </Link>
    </div>
  );
}

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: DemoProduct };
  const { add } = useCart();
  const [variant, setVariant] = useState(product.variants[0] ?? "Unique");
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
        <Reveal className="space-y-3">
          <ImageSlot
            tone={product.tone}
            ratio="aspect-4/5"
            caption={product.name}
          />
          <div className="grid grid-cols-3 gap-3">
            <ImageSlot tone="sand" ratio="aspect-square" caption="Allure" />
            <ImageSlot tone="stone" ratio="aspect-square" caption="Matière" />
            <ImageSlot tone="forest" ratio="aspect-square" caption="Détail" />
          </div>
        </Reveal>

        {/* Achat */}
        <Reveal delay={90} className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">{product.line}</p>
          <h1 className="mt-3 font-display text-3xl md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 text-lg">{PRICING.label}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Pièce de la sélection d'ouverture. La disponibilité sera indiquée
            dès la mise en vente.
          </p>

          <fieldset className="mt-8">
            <legend className="eyebrow">Variante</legend>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {product.variants.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setVariant(option)}
                  aria-pressed={variant === option}
                  className={`chip-z min-h-11 px-5 text-sm ${
                    variant === option ? "text-navy-foreground" : "text-foreground"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 flex items-center gap-4">
            <span className="eyebrow">Quantité</span>
            <div className="stepper-z">
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
            className="btn-lux mt-8 w-full"
          >
            Ajouter au panier
          </button>
          <p className="mt-3 text-xs text-muted-foreground">
            Paiement accéléré disponible à l'ouverture.
          </p>
          {added && (
            <p role="status" className="mt-4 text-sm">
              Ajouté à votre panier.{" "}
              <Link to="/panier" className="link-underline">
                Voir le panier
              </Link>
            </p>
          )}

          <p className="mt-6 text-sm text-foreground/80">
            Retour possible dans le délai légal — paiement sécurisé — service
            client en français et en anglais.
          </p>

          {/* Bénéfices */}
          <ul className="mt-8 space-y-2 text-sm">
            {product.benefits.map((benefit) => (
              <li key={benefit} className="flex gap-3">
                <span aria-hidden="true" className="text-gold">
                  —
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {/* Informations détaillées */}
      <div className="container-z grid gap-10 pb-20 lg:grid-cols-2 lg:gap-16">
        <Reveal className="space-y-8">
          <section>
            <h2 className="font-display text-2xl">Description</h2>
            <p className="mt-3 text-base text-foreground/85">{product.intro}</p>
          </section>
          <section>
            <h2 className="font-display text-2xl">Caractéristiques</h2>
            <dl className="mt-3 divide-y divide-border border-y border-border text-sm">
              {[
                ["Ligne", product.line],
                ["Finitions", product.variants.join(", ")],
                ["Dimensions", "Communiquées à l'ouverture"],
                ["Composition", "Communiquée à l'ouverture"],
                ["Entretien", "Un chiffon doux et sec suffit."],
              ].map(([term, value]) => (
                <div key={term} className="flex justify-between gap-6 py-3">
                  <dt className="text-muted-foreground">{term}</dt>
                  <dd className="text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </Reveal>
        <Reveal delay={90} className="space-y-8">
          <section>
            <h2 className="font-display text-2xl">Livraison et retours</h2>
            <p className="mt-3 text-sm text-foreground/85">
              Expédition en France et dans l'Union européenne. Le délai et les
              frais exacts s'affichent avant le paiement. Retour possible dans
              le délai légal, remboursement après réception et contrôle.
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
              Chaque pièce bénéficie de la garantie légale de conformité et de
              la garantie contre les vices cachés. Les modalités figurent dans
              les conditions générales de vente.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl">Questions fréquentes</h2>
            <div className="mt-3 divide-y divide-border border-y border-border">
              {[
                [
                  "Quel est le délai de livraison ?",
                  "Il dépend de la destination et du transporteur retenu ; il est affiché avant le paiement et rappelé dans l'email de confirmation.",
                ],
                [
                  "Comment entretenir cette pièce ?",
                  "Un chiffon doux et sec, à l'abri de l'humidité prolongée et de la lumière directe. Rien de plus.",
                ],
                [
                  "Puis-je échanger ma commande ?",
                  "Oui. Écrivez-nous avec votre numéro de commande : nous vous adressons la marche à suivre et l'adresse de retour.",
                ],
              ].map(([question, answer]) => (
                <details key={question} className="group py-3">
                  <summary className="cursor-pointer list-none text-sm font-medium transition-colors duration-[var(--dur-2)] ease-[var(--ease-lux)] hover:text-navy">
                    {question}
                  </summary>
                  <p className="slide-up-lux mt-2 text-sm text-muted-foreground">
                    {answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </Reveal>
      </div>

      <Reveal
        as="section"
        aria-labelledby="related-title"
        className="container-z pb-24"
      >
        <h2 id="related-title" className="font-display text-2xl md:text-3xl">
          À découvrir également
        </h2>
        <div className="stagger-z mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6">
          {related.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
      </Reveal>

      {/* Barre d'achat fixe mobile */}
      <div className="sticky bottom-0 z-30 mx-2 mb-2 rounded-[var(--radius-sheet)] border border-border/70 bg-background/80 shadow-[0_-18px_50px_-40px_color-mix(in_oklab,var(--navy)_80%,transparent)] backdrop-blur-xl lg:hidden">
        <div className="container-z flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{product.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {PRICING.short}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              add({ slug: product.slug, name: product.name, variant, quantity });
              setAdded(true);
            }}
            className="btn-lux shrink-0 px-5"
          >
            Ajouter
          </button>
        </div>
      </div>
    </>
  );
}
