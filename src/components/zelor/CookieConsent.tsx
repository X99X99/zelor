import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const STORAGE_KEY = "zelor.consent.v1";

/**
 * Bandeau de consentement — discret, marine, éditorial.
 * Démonstration : à relier à la Customer Privacy API Shopify avant publication.
 */
export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const t = setTimeout(() => setOpen(true), 900);
        return () => clearTimeout(t);
      }
    } catch {
      /* stockage indisponible */
    }
    return;
  }, []);

  const decide = (value: "all" | "essential") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Préférences de confidentialité"
      className="slide-up-lux fixed inset-x-4 bottom-4 z-60 md:inset-x-auto md:right-8 md:bottom-8 md:max-w-md"
    >
      <div className="overlay-navy border border-navy-foreground/12 p-6 shadow-[var(--shadow-float)] md:p-7">
        <p className="eyebrow text-navy-foreground/60">Confidentialité</p>
        <h2 className="mt-2 font-display text-2xl text-navy-foreground">
          Une expérience mesurée.
        </h2>
        <p className="mt-3 text-sm text-navy-foreground/75">
          Nous n'activons aucune mesure d'audience ni cookie marketing sans
          votre accord. Les cookies nécessaires assurent seulement le
          fonctionnement du site et du panier.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => decide("all")}
            className="min-h-12 flex-1 bg-navy-foreground px-6 text-[0.8125rem] tracking-[0.16em] text-navy uppercase transition-opacity duration-500 hover:opacity-85"
          >
            Tout accepter
          </button>
          <button
            type="button"
            onClick={() => decide("essential")}
            className="min-h-12 flex-1 border border-navy-foreground/30 px-6 text-[0.8125rem] tracking-[0.16em] text-navy-foreground uppercase transition-colors duration-500 hover:bg-navy-foreground/10"
          >
            Essentiels
          </button>
        </div>
        <Link
          to="/cookies"
          onClick={() => setOpen(false)}
          className="mt-4 inline-block text-xs tracking-wide text-navy-foreground/70 underline underline-offset-4 transition-opacity hover:opacity-100"
        >
          Personnaliser mes préférences
        </Link>
      </div>
    </div>
  );
}
