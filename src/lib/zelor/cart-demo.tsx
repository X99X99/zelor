/**
 * ════════════════════════════════════════════════════════════════════════════
 *  DÉSACTIVÉ — panier local de démonstration, conservé pour mémoire.
 *
 *  Ce fichier n'est importé par personne. Le panier réel est celui de Shopify,
 *  exposé par `cart.tsx`. Il est gardé ici pour retrouver au besoin le
 *  comportement d'origine du prototype, avant la connexion à Shopify.
 *
 *  Ne pas réactiver : deux paniers en parallèle, c'est un tunnel d'achat cassé.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Panier local de DÉMONSTRATION.
 * En production, le panier et le checkout sont gérés par Shopify
 * (Cart API / Storefront API). Aucun paiement n'est simulé ici.
 */

export type DemoCartLine = {
  slug: string;
  name: string;
  variant: string;
  quantity: number;
};

type CartContextValue = {
  lines: DemoCartLine[];
  count: number;
  add: (line: DemoCartLine) => void;
  setQuantity: (slug: string, variant: string, quantity: number) => void;
  remove: (slug: string, variant: string) => void;
  clear: () => void;
  ready: boolean;
};

const STORAGE_KEY = "zelor.demo.cart";
const CartContext = createContext<CartContextValue | null>(null);

export function DemoCartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<DemoCartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as DemoCartLine[]);
    } catch {
      /* panier illisible : on repart d'un panier vide */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* stockage indisponible */
    }
  }, [lines, ready]);

  const add = useCallback((line: DemoCartLine) => {
    setLines((current) => {
      const index = current.findIndex((l) => l.slug === line.slug && l.variant === line.variant);
      if (index === -1) return [...current, line];
      return current.map((existing, i) =>
        i === index ? { ...existing, quantity: existing.quantity + line.quantity } : existing,
      );
    });
  }, []);

  const setQuantity = useCallback((slug: string, variant: string, quantity: number) => {
    setLines((current) =>
      current
        .map((l) =>
          l.slug === slug && l.variant === variant ? { ...l, quantity: Math.max(0, quantity) } : l,
        )
        .filter((l) => l.quantity > 0),
    );
  }, []);

  const remove = useCallback((slug: string, variant: string) => {
    setLines((current) => current.filter((l) => !(l.slug === slug && l.variant === variant)));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: lines.reduce((total, l) => total + l.quantity, 0),
      add,
      setQuantity,
      remove,
      clear,
      ready,
    }),
    [lines, add, setQuantity, remove, clear, ready],
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
  add: () => {},
  setQuantity: () => {},
  remove: () => {},
  clear: () => {},
  ready: false,
};

export function useDemoCart() {
  const context = useContext(CartContext);
  if (!context) {
    if (import.meta.env.DEV) {
      console.warn("useDemoCart : contexte indisponible, panier de repli utilisé.");
    }
    return FALLBACK_CART;
  }
  return context;
}
