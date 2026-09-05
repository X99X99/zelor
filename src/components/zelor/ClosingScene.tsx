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
      <p className="eyebrow-mixed-z closing-eyebrow-z">
        <em>pour</em> FINIR
      </p>
      <LineReveal id="cloture-title" className="closing-line-z">
        RIEN ICI <em>n'a été retenu pour</em> L'EFFET <em>qu'il produit sur une</em> IMAGE.
      </LineReveal>
      <div className="closing-foot-z">
        {/* Le libellé est enveloppé dans un span : `btn-lux` est un conteneur
            flex, et un conteneur flex supprime les nœuds de texte qui ne
            contiennent qu'une espace. Sans cette enveloppe le bouton se
            rendait « VOIRlaCOLLECTION » — constaté à l'image. Le même piège
            avait déjà soudé les mots d'un titre ailleurs sur le site. */}
        <Link to="/collection" className="btn-lux whitespace-nowrap">
          <span>
            Voir <em>la</em> collection
          </span>
        </Link>
        <Link to="/univers" className="link-underline text-sm whitespace-nowrap">
          L'univers ZELOR
        </Link>
      </div>
    </Reveal>
  );
}
