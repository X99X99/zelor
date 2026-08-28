import type { CartItem } from "@/stores/cartStore";

/**
 * Mise en forme des lignes de panier.
 *
 * Ce module est volontairement pur : aucun React, aucun store, aucun accès au
 * navigateur. Il ne fait que traduire le panier Shopify en lignes affichables,
 * ce qui le rend lisible d'un coup d'œil et vérifiable sans monter l'application.
 */

export type CartLine = {
  /** Identifiant de variante Shopify : la clé de toutes les opérations sur le panier. */
  variantId: string;
  /** Handle du produit, pour le lien vers sa fiche. */
  handle: string;
  name: string;
  /** Titre de la variante, vide lorsque le produit n'a pas d'option. */
  variant: string;
  quantity: number;
  price: { amount: string; currencyCode: string };
  image?: { url: string; alt: string } | undefined;
};

/** Titre que Shopify donne à la variante unique d'un produit sans option. */
export const DEFAULT_VARIANT_TITLE = "Default Title";

/** Traduit le panier Shopify en lignes prêtes à afficher. */
export function toCartLines(items: readonly CartItem[]): CartLine[] {
  return items.map((item) => {
    const node = item.product.node;
    const firstImage = node.images.edges[0]?.node;
    const image = firstImage
      ? { url: firstImage.url, alt: firstImage.altText ?? node.title }
      : undefined;

    return {
      variantId: item.variantId,
      handle: node.handle,
      name: node.title,
      variant: item.variantTitle === DEFAULT_VARIANT_TITLE ? "" : item.variantTitle,
      quantity: item.quantity,
      price: item.price,
      image,
    };
  });
}

/** Nombre de pièces, toutes lignes confondues. */
export function cartCount(lines: readonly CartLine[]): number {
  return lines.reduce((total, line) => total + line.quantity, 0);
}

/** Sous-total, calculé depuis les prix renvoyés par Shopify — jamais depuis un prix écrit en dur. */
export function cartSubtotal(lines: readonly CartLine[]): number {
  return lines.reduce((total, line) => total + Number(line.price.amount) * line.quantity, 0);
}

/** Devise du panier : celle de la première ligne, à défaut l'euro. */
export function cartCurrency(lines: readonly CartLine[], fallback = "EUR"): string {
  return lines[0]?.price.currencyCode ?? fallback;
}
