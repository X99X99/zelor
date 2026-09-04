import { useEffect, useRef } from "react";

import { WordReveal } from "./WordReveal";

/**
 * ————— Le manifeste —————
 *
 * Trois propositions, aucune image — mais elles ne restent plus épinglées à
 * l'écran pendant trois écrans de défilement. Mesuré sur le site publié,
 * cette version-là se lisait comme un vide : le décor ne bougeait pas, une
 * seule phrase relayait la précédente à un seuil discret, et rien d'autre ne
 * se passait entre deux relais. Signalé, comparé au comportement réel de la
 * référence : chez elle, ce texte se déplace avec la page — il apparaît en
 * sortant d'un bord, reste lisible le temps de passer par le centre, puis
 * repart et s'efface à un point précis, sans jamais s'arrêter.
 *
 * Reprend donc exactement le mécanisme du diptyque (`--ep`, la distance de
 * chaque élément au centre du viewport, ramenée en continu entre 0 et 1) —
 * déjà prouvé réversible et sans fuite — appliqué ici à du texte plutôt qu'à
 * des figures. Chaque proposition a sa propre place dans le flux normal de
 * la page, avec sa respiration ; aucune n'est plus jamais « la seule
 * visible » pendant que les deux autres attendent, invisibles, au même
 * endroit.
 */

const TRACKED = "[data-ep-track]";

function useManifestFlow(trackRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const elements = Array.from(track.querySelectorAll<HTMLElement>(TRACKED));
    if (!elements.length) return;

    let frame = 0;
    const write = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;
      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const reach = viewportCenter + rect.height / 2;
        const distance = Math.abs(elementCenter - viewportCenter);
        const progress = reach > 0 ? Math.max(0, Math.min(1, 1 - distance / reach)) : 1;
        el.style.setProperty("--ep", progress.toFixed(4));
      }
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(write);
    };

    write();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [trackRef]);
}

const PROPOSITIONS = [
  "Les objets que l'on garde ne sont pas ceux que l'on remarque en premier.",
  "Ce sont ceux dont la main retrouve la forme sans y penser.",
  "ZELOR ne choisit rien qui ne tienne cette épreuve-là.",
] as const;

export function ManifestScene() {
  const trackRef = useRef<HTMLElement>(null);
  useManifestFlow(trackRef);

  return (
    <section aria-labelledby="manifeste-title" className="manifest-track-z" ref={trackRef}>
      <h2 id="manifeste-title" className="sr-only">
        Le parti de la maison
      </h2>

      {PROPOSITIONS.map((texte) => (
        // La fenêtre de centrage est un conteneur séparé, jamais l'hôte de
        // WordReveal lui-même : flex/grid annule les espaces entre ses mots
        // (nœuds de texte nus entre les fenêtres de rognage) — constaté à
        // l'image, « Cesontceuxdontlamain... » soudé.
        <div key={texte} className="manifest-slot-z" data-ep-track="">
          <WordReveal text={texte} className="manifest-line-z" />
        </div>
      ))}
    </section>
  );
}
