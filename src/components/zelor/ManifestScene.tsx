import { beaconStyle, useScrollSteps } from "@/hooks/useScrollSteps";
import { WordReveal } from "./WordReveal";

/**
 * ————— Le manifeste —————
 *
 * Trois écrans de piste, aucune image, un seul écran de scène.
 *
 * C'est le geste le plus difficile à admettre du modèle relevé : après
 * l'ouverture vient une section de trois écrans **entièrement vide d'images**,
 * où seule une phrase se tient au centre. Elle ne se lit pas d'un coup — elle
 * se relaie, une proposition à la fois, à mesure que l'on descend.
 *
 * Le corps employé n'est pas celui d'un titre : c'est le palier d'accroche,
 * en sans, graisse 500, approche resserrée. Le contraste des deux familles à
 * cet endroit précis fait toute la respiration de la page — un serif y serait
 * décoratif, un corps de titre y serait bruyant.
 *
 * Chaque proposition se révèle mot par mot — `WordReveal`, déjà éprouvé dans
 * l'ouverture — plutôt qu'en un seul bloc translaté. La translation de bloc
 * d'origine (`translate: 0 110%` sur la ligne entière) faisait arriver la
 * phrase d'un coup, comme un carton plutôt que comme une pensée qui se forme ;
 * le mot par mot est la seule composition du site qui installe une durée dans
 * la lecture elle-même, pas seulement dans son arrivée.
 *
 * Le déclenchement reste celui déjà en place : `data-active`, porté par
 * `step`, la même valeur discrète qui relaie les trois propositions. Réversible
 * par construction — la valeur de repos de `word-body-z` est l'état caché ;
 * quand `data-active` retombe à `false` puis revient à `true` en remontant, la
 * transition rejoue d'elle-même, sans état à réinitialiser.
 */

const PROPOSITIONS = [
  "Les objets que l'on garde ne sont pas ceux que l'on remarque en premier.",
  "Ce sont ceux dont la main retrouve la forme sans y penser.",
  "ZELOR ne choisit rien qui ne tienne cette épreuve-là.",
] as const;

export function ManifestScene() {
  const { ref, step } = useScrollSteps(PROPOSITIONS.length);

  return (
    <section aria-labelledby="manifeste-title" className="manifest-track-z" ref={ref}>
      <h2 id="manifeste-title" className="sr-only">
        Le parti de la maison
      </h2>

      {PROPOSITIONS.map((_, index) => (
        <span
          key={`beacon-${index}`}
          className="scene-beacon-z"
          data-beacon={index}
          style={beaconStyle(index, PROPOSITIONS.length)}
        />
      ))}

      <div className="manifest-scene-z" data-step={step}>
        <div className="manifest-stack-z">
          {PROPOSITIONS.map((texte, index) => (
            <WordReveal
              key={texte}
              text={texte}
              className="manifest-line-z"
              data-active={step === index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
