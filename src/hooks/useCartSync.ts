import { useEffect } from "react";

import { useCartStore } from "@/stores/cartStore";

/** Aligne le panier local sur Shopify : au chargement et au retour d'onglet. */
export function useCartSync() {
  const syncCart = useCartStore((state) => state.syncCart);

  useEffect(() => {
    syncCart();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") syncCart();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [syncCart]);
}
