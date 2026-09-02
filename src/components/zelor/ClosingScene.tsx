import { Link } from "@tanstack/react-router";

import { LineReveal } from "./LineReveal";
import { Reveal } from "./Reveal";

/**
 * ————— La clôture —————
 *
 * Un écran et demi, dont la première moitié est vide.
 *
 * Sur la référence, cette section porte 330 px de marge haute avant que la
 * phrase n'apparaisse, et 173 px après. Le vide n'est pas une erreur de
 * réglage : c'est lui qui fait qu'on arrive au pied de page sans rupture, au
 * lieu de tomber dedans.
 *
 * La phrase se découvre derrière une fenêtre, en 1,4 s — la durée éditoriale
 * du répertoire, celle qu'on ne remarque pas et qui pourtant fait tout.
 */
export function ClosingScene() {
  return (
    <Reveal as="section" aria-labelledby="cloture-title" className="closing-track-z">
      <p className="eyebrow closing-eyebrow-z">Pour finir</p>
      <LineReveal id="cloture-title" className="closing-line-z">
        Rien ici n'a été retenu pour l'effet qu'il produit sur une image.
      </LineReveal>
      <div className="closing-foot-z">
        <Link to="/collection" className="btn-lux whitespace-nowrap">
          Voir la collection
        </Link>
        <Link to="/univers" className="link-underline text-sm whitespace-nowrap">
          L'univers ZELOR
        </Link>
      </div>
    </Reveal>
  );
}
