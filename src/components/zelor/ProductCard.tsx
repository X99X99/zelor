import { Link } from "@tanstack/react-router";

import { formatMoney, type ShopifyProduct } from "@/lib/shopify/client";
import { ImageSlot } from "./Placeholder";

/** Carte produit — données réelles Shopify (image, titre, prix). */
export function ProductCard({ product }: { product: ShopifyProduct }) {
  const node = product.node;
  const image = node.images?.edges?.[0]?.node;
  const price = formatMoney(node.priceRange?.minVariantPrice);
  const soldOut = node.variants?.edges?.every((v) => !v.node.availableForSale);

  return (
    <article className="group">
      <Link
        to="/produit/$slug"
        params={{ slug: node.handle }}
        className="block focus-visible:outline-offset-4"
      >
        <div className="lift-z sheen-z relative overflow-hidden rounded-[var(--radius-media)]">
          <div className="transition-[scale] duration-[var(--dur-5)] ease-[var(--ease-lux)] group-hover:scale-[1.04]">
            {image ? (
              <img
                src={image.url}
                alt={image.altText ?? node.title}
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full rounded-[var(--radius-media)] object-cover"
              />
            ) : (
              <ImageSlot caption={node.title} />
            )}
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-navy/0 transition-colors duration-700 group-hover:bg-navy/8"
          />
          <span aria-hidden="true" className="discover-bar-z">
            Découvrir
          </span>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-3">
          <h3 className="font-sans text-sm font-medium">{node.title}</h3>
          {soldOut && <span className="eyebrow">Épuisé</span>}
        </div>
        {node.productType && (
          <p className="mt-1 text-xs text-muted-foreground">{node.productType}</p>
        )}
        <p className="mt-2 text-xs tracking-wide text-muted-foreground">{price}</p>
      </Link>
    </article>
  );
}
