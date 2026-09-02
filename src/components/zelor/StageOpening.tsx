import openingImage from "@/assets/hero.jpg";
import { BRAND } from "@/lib/zelor/content";

/**
 * ————— L'ouverture —————
 *
 * Un écran, pas plus. Et un titre volontairement petit.
 *
 * C'est le point le plus contre-intuitif du modèle relevé : sur la référence,
 * le titre d'ouverture ne fait que 21 px. La monumentalité ne vient pas du
 * corps de la lettre mais de l'image, du vide autour, et du fait que la scène
 * occupe exactement un écran — ni plus, ni moins. Les très grands corps sont
 * gardés pour plus tard, dans des bandes courtes où ils frappent parce qu'ils
 * arrivent après du silence.
 *
 * La photographie est celle du dépôt qui n'avait jamais servi : un vase de
 * céramique sur un socle de pierre, lin froissé, lumière rasante. Elle est
 * cadrée à 70 % vers la droite pour que le mur nu reste libre à gauche —
 * c'est là que le texte se pose, et c'est pourquoi il est aligné à gauche et
 * non centré. Un voile horizontal assombrit ce seul côté : l'image est claire,
 * un voile uniforme la ternirait sans garantir le contraste.
 *
 * Elle est décorative : la phrase se lit sans elle, donc `alt` reste vide et
 * l'image n'interrompt pas la lecture d'un lecteur d'écran.
 */

const SIZES = "100vw";

export function StageOpening() {
  return (
    <section aria-labelledby="ouverture-title" className="open-track-z">
      {/* `data-media-ground` prévient les vérifications automatiques : sous ce
          texte il y a une photographie voilée, pas une couleur. Le contraste
          n'y est pas déductible des styles calculés et se juge à l'œil. */}
      <div className="open-scene-z" data-media-ground="">
        <div className="open-layer-z" data-layer="fond">
          <img
            className="open-media-z"
            src={openingImage}
            sizes={SIZES}
            width={1920}
            height={1200}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            alt=""
          />
        </div>

        <div className="open-layer-z" data-layer="voile" />

        <div className="open-content-z">
          <p className="eyebrow open-eyebrow-z">Maison {BRAND.name}</p>
          <h1 id="ouverture-title" className="open-title-z">
            L'élégance dans chaque détail
          </h1>
          {/* La phrase de marque reste dans le premier écran : c'est un
              engagement pris avant cette refonte, et rien dans la nouvelle
              composition n'oblige à y renoncer. */}
          <p className="open-promise-z hero-promise-z">Pour faire de chaque détail une promesse.</p>
          <p className="open-cue-z" aria-hidden="true">
            <span className="open-cue-line-z" />
            Faire défiler
          </p>
        </div>
      </div>
    </section>
  );
}
