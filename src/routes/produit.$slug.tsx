import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import {
  formatMoney,
  productQueryOptions,
  productsQueryOptions,
  type ShopifyProduct,
} from "@/lib/shopify/client";
import { useCartStore } from "@/stores/cartStore";
import { Breadcrumbs } from "@/components/zelor/Breadcrumbs";
import { ImageSlot } from "@/components/zelor/Placeholder";
import { ProductCard } from "@/components/zelor/ProductCard";
import { Reveal } from "@/components/zelor/Reveal";

export const Route = createFileRoute("/produit/$slug")({
  head: ({ params }) => {
    const title = `${params.slug} — ZELOR — Maison éditoriale`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content:
            "Une pièce ZELOR choisie pour son allure, sa justesse et sa tenue dans le temps. Livraison en France et dans l'Union européenne.",
        },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content: "Une pièce ZELOR choisie pour son allure et sa tenue dans le temps.",
        },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/produit/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/produit/${params.slug}` }],
    };
  },
  component: ProductPage,
});

function ProductNotFound() {
  return (
    <div className="container-z py-24 text-center">
      <h1 className="font-display text-4xl">Cette pièce n'est pas disponible.</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Elle a peut-être été retirée du catalogue.
      </p>
      <Link to="/collection" className="btn-lux mt-8">
        Voir la collection
      </Link>
    </div>
  );
}

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product, isLoading } = useQuery(productQueryOptions(slug));
  const { data: catalog } = useQuery(productsQueryOptions(8));

  if (isLoading) {
    return (
      <div className="container-z py-24">
        <div className="skeleton-lux aspect-[4/5] max-w-xl rounded-[var(--radius-media)]" />
      </div>
    );
  }
  if (!product) return <ProductNotFound />;

  return <ProductDetail product={product} catalog={catalog ?? []} />;
}

function ProductDetail({
  product,
  catalog,
}: {
  product: ShopifyProduct;
  catalog: ShopifyProduct[];
}) {
  const node = product.node;
  const variants = useMemo(() => node.variants.edges.map((e) => e.node), [node]);
  const [variantId, setVariantId] = useState(variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const selectedVariant = variants.find((v) => v.id === variantId) ?? variants[0];
  const images = node.images.edges.map((e) => e.node);
  const related = catalog.filter((p) => p.node.handle !== node.handle).slice(0, 3);

  const handleAdd = async () => {
    if (!selectedVariant) return;
    await addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions ?? [],
    });
    setAdded(true);
  };

  const price = formatMoney(selectedVariant?.price ?? node.priceRange.minVariantPrice);
  const available = selectedVariant?.availableForSale ?? false;

  return (
    <>
      <Breadcrumbs items={[{ label: "Collection", to: "/collection" }, { label: node.title }]} />

      <div className="container-z grid gap-10 pt-8 pb-16 lg:grid-cols-2 lg:gap-16">
        {/* Galerie */}
        <Reveal className="space-y-3">
          {images[0] ? (
            <img
              src={images[0].url}
              alt={images[0].altText ?? node.title}
              className="aspect-[4/5] w-full rounded-[var(--radius-media)] object-cover"
            />
          ) : (
            <ImageSlot ratio="aspect-4/5" caption={node.title} label={node.title} />
          )}
          {images.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {images.slice(1, 4).map((image) => (
                <img
                  key={image.url}
                  src={image.url}
                  alt={image.altText ?? node.title}
                  loading="lazy"
                  className="aspect-square w-full rounded-[var(--radius-media)] object-cover"
                />
              ))}
            </div>
          )}
        </Reveal>

        {/* Achat */}
        <Reveal delay={90} className="lg:sticky lg:top-28 lg:self-start">
          {node.productType && <p className="eyebrow">{node.productType}</p>}
          <h1 className="mt-3 font-display text-3xl md:text-5xl">{node.title}</h1>
          <p className="mt-4 text-lg">{price}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {available ? "Disponible — expédié depuis notre atelier." : "Actuellement indisponible."}
          </p>

          {variants.length > 1 && (
            <fieldset className="mt-8">
              <legend className="eyebrow">Variante</legend>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {variants.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setVariantId(option.id)}
                    aria-pressed={variantId === option.id}
                    disabled={!option.availableForSale}
                    className={`chip-z min-h-11 px-5 text-sm disabled:opacity-40 ${
                      variantId === option.id ? "text-navy-foreground" : "text-foreground"
                    }`}
                  >
                    {option.title}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

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
              <span aria-live="polite" className="w-10 text-center text-sm tabular-nums">
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
            onClick={handleAdd}
            disabled={isLoading || !selectedVariant || !available}
            className="btn-lux mt-8 flex w-full items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
            Ajouter au panier
          </button>
          {added && (
            <p role="status" className="mt-4 text-sm">
              Ajouté à votre panier.{" "}
              <Link to="/panier" className="link-underline">
                Voir le panier
              </Link>
            </p>
          )}

          <p className="mt-6 text-sm text-foreground/80">
            Retour possible dans le délai légal — paiement sécurisé Shopify — service client en
            français et en anglais.
          </p>
        </Reveal>
      </div>

      {/* Informations détaillées */}
      <div className="container-z grid gap-10 pb-20 lg:grid-cols-2 lg:gap-16">
        <Reveal className="space-y-8">
          <section>
            <h2 className="font-display text-2xl">Description</h2>
            <p className="mt-3 text-base whitespace-pre-line text-foreground/85">
              {node.description}
            </p>
          </section>
          {node.options.length > 0 && (
            <section>
              <h2 className="font-display text-2xl">Caractéristiques</h2>
              <dl className="mt-3 divide-y divide-border border-y border-border text-sm">
                {node.options.map((option) => (
                  <div key={option.name} className="flex justify-between gap-6 py-3">
                    <dt className="text-muted-foreground">{option.name}</dt>
                    <dd className="text-right">{option.values.join(", ")}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </Reveal>
        <Reveal delay={90} className="space-y-8">
          <section>
            <h2 className="font-display text-2xl">Livraison et retours</h2>
            <p className="mt-3 text-sm text-foreground/85">
              Le délai et les frais exacts s'affichent avant le paiement. Retour possible dans le
              délai légal, remboursement après réception et contrôle.
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
              Chaque pièce bénéficie de la garantie légale de conformité et de la garantie contre
              les vices cachés. Les modalités figurent dans les conditions générales de vente.
            </p>
          </section>
        </Reveal>
      </div>

      {related.length > 0 && (
        <Reveal as="section" aria-labelledby="related-title" className="container-z pb-24">
          <h2 id="related-title" className="font-display text-2xl md:text-3xl">
            À découvrir également
          </h2>
          <div className="stagger-z mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6">
            {related.map((item) => (
              <ProductCard key={item.node.id} product={item} />
            ))}
          </div>
        </Reveal>
      )}

      {/* Barre d'achat fixe mobile */}
      <div className="sticky bottom-0 z-30 mx-2 mb-2 rounded-[var(--radius-sheet)] border border-border/70 bg-background/80 shadow-[0_-18px_50px_-40px_color-mix(in_oklab,var(--navy)_80%,transparent)] backdrop-blur-xl lg:hidden">
        <div className="container-z flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{node.title}</p>
            <p className="truncate text-xs text-muted-foreground">{price}</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={isLoading || !available}
            className="btn-lux shrink-0 px-5 disabled:opacity-60"
          >
            Ajouter
          </button>
        </div>
      </div>
    </>
  );
}
