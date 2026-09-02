import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { formatMoney, type ShopifyProduct } from "@/lib/shopify/client";
import { ImageSlot } from "./Placeholder";

/**
 * Carte produit — données réelles Shopify (image, titre, prix).
 *
 * Deux présentations, une seule source. Les trois calculs commerciaux — quelle
 * image, comment formater le prix, comment déduire « épuisé » de l'ensemble des
 * variantes — restent ici et ne sont jamais dupliqués : deux endroits où une
 * pièce se rend, c'est deux endroits où elle peut afficher un prix différent.
 *
 * `default` est le rendu historique, employé par l'accueil, les nouveautés et
 * le bas de la fiche produit. Il n'a pas bougé d'une ligne.
 *
 * `collection-editorial` n'est employé que par la page Collection : le prix y
 * gagne en présence, la hiérarchie devient image → titre → prix →
 * disponibilité, et une seconde photographie se substitue à la première au
 * survol lorsqu'elle existe.
 */
export function ProductCard({
  product,
  variant = "default",
}: {
  product: ShopifyProduct;
  variant?: "default" | "collection-editorial";
}) {
  const node = product.node;
  const image = node.images?.edges?.[0]?.node;
  const secondImage = node.images?.edges?.[1]?.node;
  const price = formatMoney(node.priceRange?.minVariantPrice);
  const soldOut = node.variants?.edges?.every((v) => !v.node.availableForSale);
  const editorial = variant === "collection-editorial";

  // La seconde image n'est montée que sur pointeur fin. Sur un écran tactile
  // elle n'existe pas dans le DOM : elle n'est donc pas téléchargée, et non
  // simplement masquée. Même motif que HoverVideo, et même raison.
  const [finePointer, setFinePointer] = useState(false);
  useEffect(() => {
    if (!editorial) return;
    setFinePointer(!window.matchMedia("(hover: none), (pointer: coarse)").matches);
  }, [editorial]);

  const showSecond = editorial && finePointer && !!secondImage;

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
          {showSecond && secondImage && (
            <img
              src={secondImage.url}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="card-hover-image-z rounded-[var(--radius-media)]"
            />
          )}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-navy/0 transition-colors duration-700 group-hover:bg-navy/8"
          />
          <span aria-hidden="true" className="discover-bar-z">
            Découvrir
          </span>
        </div>
        {editorial ? (
          <div className="mt-5 space-y-1.5">
            <h3 className="font-display text-lg leading-tight">{node.title}</h3>
            <p className="font-sans text-base">{price}</p>
            <p className="text-xs tracking-wide text-muted-foreground">
              {soldOut ? "Épuisé" : node.productType}
            </p>
          </div>
        ) : (
          <>
            <div className="mt-4 flex items-baseline justify-between gap-3">
              <h3 className="font-sans text-sm">{node.title}</h3>
              {soldOut && <span className="eyebrow">Épuisé</span>}
            </div>
            {node.productType && (
              <p className="mt-1 text-xs text-muted-foreground">{node.productType}</p>
            )}
            <p className="mt-2 text-xs tracking-wide text-muted-foreground">{price}</p>
          </>
        )}
      </Link>
    </article>
  );
}
