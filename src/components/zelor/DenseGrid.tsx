import { Link } from "@tanstack/react-router";

import { Reveal } from "./Reveal";

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

      <div className="grid-plate-z">
        {PLANCHE.map((slot, index) => (
          <div
            key={slot.fichier}
            className="grid-cell-z"
            style={{ "--i": index } as React.CSSProperties}
          >
            <div className="slot-empty-z" role="img" aria-label={`Image à venir : ${slot.role}`}>
              <p className="slot-empty-file-z">{slot.fichier}</p>
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
