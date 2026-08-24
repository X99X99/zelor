import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const STORAGE_KEY = "zelor.consent.v1";

/**
 * Bandeau de consentement — discret, marine, éditorial.
 */
export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      /* stockage indisponible */
    }
    // Le bandeau ne coupe jamais la première impression : il attend que la
    // lecture soit engagée, ou un court silence, avant de se présenter.
    let done = false;
    const show = () => {
      if (done) return;
      done = true;
      window.removeEventListener("scroll", onScroll);
      setOpen(true);
    };
    const onScroll = () => {
      if (window.scrollY > 280) show();
    };
    const t = window.setTimeout(show, 3200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);


  // Le bandeau se retire avec le même soin qu'il apparaît.
  const dismiss = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      setOpen(false);
    }, 480);
  };

  const decide = (value: "all" | "essential") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    dismiss();
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Préférences de confidentialité"
      className={`${closing ? "slide-down-out" : "slide-up-lux"} fixed inset-x-4 bottom-4 z-60 md:inset-x-auto md:right-8 md:bottom-8 md:max-w-md`}
    >
      <div className="panel-navy p-6 md:p-7">
        <p className="eyebrow text-navy-foreground/60">Confidentialité</p>
        <h2 className="mt-2 font-display text-2xl text-navy-foreground">
          Une expérience mesurée.
        </h2>
        <p className="mt-3 text-sm text-navy-foreground/75">
          Nous n'activons aucune mesure d'audience ni cookie marketing sans
          votre accord. Les cookies nécessaires assurent seulement le
          fonctionnement du site et du panier.
        </p>
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={() => decide("all")}
            className="btn-veil btn-veil-solid flex-1"
          >
            Tout accepter
          </button>
          <button
            type="button"
            onClick={() => decide("essential")}
            className="btn-veil flex-1"
          >
            Essentiels
          </button>
        </div>
        <Link
          to="/cookies"
          onClick={dismiss}
          className="link-underline mt-4 text-xs tracking-wide text-navy-foreground/70 hover:text-navy-foreground"
        >
          Personnaliser mes préférences
        </Link>
      </div>
    </div>
  );
}
