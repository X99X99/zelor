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

export type CartLine = {
  slug: string;
  name: string;
  variant: string;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  add: (line: CartLine) => void;
  setQuantity: (slug: string, variant: string, quantity: number) => void;
  remove: (slug: string, variant: string) => void;
  clear: () => void;
  ready: boolean;
};

const STORAGE_KEY = "zelor.demo.cart";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
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

  const add = useCallback((line: CartLine) => {
    setLines((current) => {
      const index = current.findIndex(
        (l) => l.slug === line.slug && l.variant === line.variant,
      );
      if (index === -1) return [...current, line];
      const next = [...current];
      next[index] = {
        ...next[index],
        quantity: next[index].quantity + line.quantity,
      };
      return next;
    });
  }, []);

  const setQuantity = useCallback(
    (slug: string, variant: string, quantity: number) => {
      setLines((current) =>
        current
          .map((l) =>
            l.slug === slug && l.variant === variant
              ? { ...l, quantity: Math.max(0, quantity) }
              : l,
          )
          .filter((l) => l.quantity > 0),
      );
    },
    [],
  );

  const remove = useCallback((slug: string, variant: string) => {
    setLines((current) =>
      current.filter((l) => !(l.slug === slug && l.variant === variant)),
    );
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

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart doit être utilisé dans CartProvider");
  return context;
}
