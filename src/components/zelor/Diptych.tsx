import editorialImage from "@/assets/editorial.jpg";
import heroImage from "@/assets/hero.jpg";
import { beaconStyle, useScrollSteps } from "@/hooks/useScrollSteps";
import { MediaSlot } from "./MediaSlot";

/**
 * ————— Le diptyque éditorial —————
 *
 * Deux écrans et demi de piste, sept plans sur la référence, à des échelles
 * qui n'ont aucun rapport entre elles : un grand plan portrait de 678 × 880,
 * puis 392 × 542, 377 × 522, 202 × 279. Tous en format vertical, tous
 * décalés, aucun aligné sur un autre.
 *
 * C'est ce désalignement qui fait l'éditorial. Une grille régulière produirait
 * un catalogue ; ici les plans se répondent à distance, et le texte se glisse
 * dans les intervalles qu'ils laissent.
 *
 * Le grand plan reste collé pendant que les autres défilent : la profondeur
 * naît de cet écart de vitesse, pas d'un effet.
 */

const TEMPS = [
  {
    surtitre: "Notre point de départ",
    texte:
      "Les pièces que nous retenons se reconnaissent à l'usage, pas en photographie. Elles tombent bien, se rangent sans qu'on y pense, se patinent au lieu de se fatiguer.",
  },
  {
    surtitre: "Notre manière de choisir",
    texte:
      "La forme, l'usage, la finition — dans cet ordre. Une pièce est prise en main, portée, posée, déplacée pendant plusieurs semaines avant d'être retenue.",
  },
] as const;

export function Diptych() {
  const { ref, step } = useScrollSteps(TEMPS.length);

  return (
    <section aria-labelledby="diptyque-title" className="diptych-track-z" ref={ref}>
      <h2 id="diptyque-title" className="sr-only">
        La maison ZELOR
      </h2>

      {TEMPS.map((_, index) => (
        <span
          key={`beacon-${index}`}
          className="scene-beacon-z"
          data-beacon={index}
          style={beaconStyle(index, TEMPS.length)}
        />
      ))}

      {/* Le grand plan reste, les autres passent. */}
      <div className="diptych-anchor-z">
        <figure className="diptych-major-z">
          <MediaSlot
            source={{
              src: editorialImage,
              position: "50% 42%",
              positionMobile: "50% 50%",
              width: 1408,
              height: 1760,
            }}
            fichier="zelor-maison-01"
            role="Intérieur habité"
            format="4:5 — 1600 × 2000"
          />
        </figure>
      </div>

      <div className="diptych-flow-z">
        {TEMPS.map((temps, index) => (
          <div key={temps.surtitre} className="diptych-beat-z" data-active={step === index}>
            <p className="eyebrow">{temps.surtitre}</p>
            <p className="diptych-text-z">{temps.texte}</p>
          </div>
        ))}

        <figure className="diptych-minor-z" data-scale="moyen">
          <MediaSlot
            source={{
              src: heroImage,
              // Un plan large recadré en portrait serré sur la pièce : le
              // cadrage change, le sujet reste le sien.
              position: "62% 46%",
              positionMobile: "62% 42%",
              width: 1920,
              height: 1200,
            }}
            fichier="zelor-maison-02"
            role="Pièce en situation"
            format="4:5 — 1600 × 2000"
          />
        </figure>

        <figure className="diptych-minor-z" data-scale="petit">
          <MediaSlot
            source={null}
            fichier="zelor-maison-03"
            role="Détail rapproché"
            format="4:5 — 1200 × 1500"
          />
        </figure>
      </div>
    </section>
  );
}
