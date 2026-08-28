import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { useCartSync } from "@/hooks/useCartSync";
import {
  cartCount,
  cartCurrency,
  cartSubtotal,
  toCartLines,
  type CartLine,
} from "@/lib/zelor/cart-lines";
import { useCartStore, type CartItem } from "@/stores/cartStore";

/**
 * Porte d'entrée unique du panier.
 *
 * Tout ce que l'interface sait du panier passe par ici, et ce contexte ne parle
 * qu'à une seule source : le panier Shopify (`useCartStore`). Il n'existe plus
 * de panier local parallèle — c'était la cause du bouton « Passer commande »
 * qui ne menait nulle part.
 *
 * L'ancien panier de démonstration est conservé, inutilisé, dans `cart-demo.tsx`.
 */

export type { CartLine };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  /** Sous-total en unités de devise, hors livraison et taxes. */
  subtotal: number;
  currencyCode: string;
  /** URL de paiement Shopify, disponible dès qu'une ligne existe. */
  checkoutUrl: string | null;
  /** Faux tant que le composant n'est pas monté : évite une divergence d'hydratation. */
  ready: boolean;
  /** Vrai pendant un appel à Shopify : sert à désactiver les commandes. */
  busy: boolean;
  add: (item: Omit<CartItem, "lineId">) => Promise<void>;
  setQuantity: (variantId: string, quantity: number) => Promise<void>;
  remove: (variantId: string) => Promise<void>;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // Le panier est restauré depuis localStorage, donc vide au rendu serveur.
  // On n'expose son contenu qu'une fois monté : le premier rendu client est
  // ainsi identique au HTML reçu, et React n'a rien à corriger.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  // Réaligne le panier local sur Shopify au chargement et au retour d'onglet.
  useCartSync();

  const items = useCartStore((state) => state.items);
  const checkoutUrl = useCartStore((state) => state.checkoutUrl);
  const busy = useCartStore((state) => state.isLoading);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const lines = useMemo(() => (ready ? toCartLines(items) : []), [ready, items]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: cartCount(lines),
      subtotal: cartSubtotal(lines),
      currencyCode: cartCurrency(lines),
      checkoutUrl,
      ready,
      busy,
      add: addItem,
      setQuantity: updateQuantity,
      remove: removeItem,
      clear: clearCart,
    }),
    [lines, checkoutUrl, ready, busy, addItem, updateQuantity, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Panier de repli : utilisé si le contexte est momentanément indisponible
 * (rechargement à chaud du module en développement, par exemple). Le rendu
 * reste intact — jamais d'écran blanc — et l'état réel revient au montage
 * suivant sous `CartProvider`.
 */
const FALLBACK_CART: CartContextValue = {
  lines: [],
  count: 0,
  subtotal: 0,
  currencyCode: "EUR",
  checkoutUrl: null,
  ready: false,
  busy: false,
  add: async () => {},
  setQuantity: async () => {},
  remove: async () => {},
  clear: () => {},
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    if (import.meta.env.DEV) {
      console.warn("useCart : contexte indisponible, panier de repli utilisé.");
    }
    return FALLBACK_CART;
  }
  return context;
}
