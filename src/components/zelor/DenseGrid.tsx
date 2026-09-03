import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { Reveal } from "./Reveal";

/**
 * Progression continue du passage de la planche à travers le viewport — 0
 * quand son bord haut touche le bas de l'écran, 1 quand son bord bas quitte
 * le haut. `useScrollSteps` suppose une piste plus haute que l'écran (elle
 * l'est, pour l'ouverture ou le diptyque) ; mesuré ici, `grid-plate-z` ne
 * l'est pas (555px pour 900px d'écran) — sa formule y restait bloquée à 0.
 * Même discipline que partout ailleurs : une écriture par trame, jamais de
 * transition sur la valeur, rien sous mouvement réduit.
 */
function usePlateFlow(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const write = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const span = window.innerHeight + rect.height;
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / span));
      node.style.setProperty("--sp", progress.toFixed(4));
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
  }, [ref]);
}

/**
 * ————— La grille dense —————
 *
 * Un écran et demi, vingt vignettes verticales de 153 × 191 sur la référence,
 * serrées, sans texte entre elles. C'est le contrepoint des sections longues :
 * après trois écrans où il ne se passe presque rien, la page se remplit d'un
 * coup.
 *
 * Le format est le même pour toutes — 4:5 — et c'est ce qui fait tenir la
 * densité. Une grille de formats mêlés se lit comme un désordre ; une grille
 * d'un seul format se lit comme une planche-contact.
 *
 * Le catalogue Shopify est vide aujourd'hui. On n'invente ni pièce, ni prix,
 * ni disponibilité : la planche montre ses emplacements, chacun nommé, et la
 * grille est prête à recevoir les vraies données sans changer d'un pixel.
 */

const PLANCHE = Array.from({ length: 12 }, (_, index) => ({
  fichier: `zelor-piece-${String(index + 1).padStart(2, "0")}`,
  role: "Pièce de la sélection",
}));

export function DenseGrid({ catalogueVide }: { catalogueVide: boolean }) {
  // Progression continue du passage de la planche dans l'écran — ni la
  // révélation d'entrée (gérée par Reveal, sur la section) ni un décalage
  // chronométré. Bord et centre n'avancent pas à la même vitesse ; c'est ce
  // qui fait la profondeur d'une planche par ailleurs strictement plate
  // (même format, même grille).
  const plateRef = useRef<HTMLDivElement>(null);
  usePlateFlow(plateRef);

  return (
    <Reveal as="section" aria-labelledby="planche-title" className="grid-track-z">
      <div className="grid-head-z">
        <p className="eyebrow">La sélection</p>
        <h2 id="planche-title" className="grid-title-z">
          Douze pièces, pas davantage
        </h2>
        <Link to="/collection" className="link-underline text-sm">
          Voir la collection
        </Link>
      </div>

      <div className="grid-plate-z" ref={plateRef}>
        {PLANCHE.map((slot, index) => (
          <div
            key={slot.fichier}
            className="grid-cell-z"
            style={{ "--i": index } as React.CSSProperties}
          >
            {/* Couche séparée de grid-cell-z : celle-ci porte la révélation
                d'entrée (transition, une fois), celle-ci la parallaxe
                (continue, jamais transitionnée) — les deux sur la même
                propriété se seraient disputé chaque trame. */}
            <div className="grid-cell-parallax-z">
              <div
                className="slot-empty-z grid-cell-hover-z"
                role="img"
                aria-label={`Image à venir : ${slot.role}`}
              >
                <p className="slot-empty-file-z">{slot.fichier}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {catalogueVide ? (
        <p className="grid-note-z">
          Le catalogue n'est pas encore ouvert. Ces emplacements attendent les pièces réelles et
          leurs photographies — aucune n'est inventée ici.
        </p>
      ) : null}
    </Reveal>
  );
}
