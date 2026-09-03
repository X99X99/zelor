import { useEffect, useRef } from "react";

import editorialImage from "@/assets/editorial.jpg";
import heroImage from "@/assets/hero.jpg";
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
 *
 * ——— La respiration continue ———
 *
 * Les deux figures secondaires et les deux temps de texte ne sont pas épinglés
 * — ils défilent normalement, à des hauteurs qui dépendent de la longueur du
 * texte. Une fraction fixe de la progression de la piste (`--sp`) se serait
 * donc désynchronisée dès que le contenu ou le viewport change : elle suppose
 * une position que rien ne garantit.
 *
 * Chaque élément est donc piloté par sa propre géométrie : sa distance au
 * centre du viewport, ramenée en continu entre 0 (au bord, ou hors champ) et 1
 * (centré). C'est une fonction paire de la position — remonter donne
 * exactement les mêmes valeurs que descendre, sans état à retenir d'une trame
 * à l'autre. Aucun seuil, donc aucun saut.
 */

/** Éléments suivis : les deux figures secondaires, les deux temps de texte. */
const TRACKED = "[data-ep-track]";

/**
 * Écrit la progression de chaque élément suivi, une fois par trame pendant le
 * défilement — jamais dans le rendu React, qui ne gère que la structure.
 *
 * Même garde que `useScrollSteps` : sous mouvement réduit, rien n'est
 * installé. La variable reste absente, et chaque règle qui la lit retombe sur
 * `var(--ep, 1)` — l'état plein, immédiatement lisible.
 */
function useDiptychFlow(trackRef: React.RefObject<HTMLElement | null>) {
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
  const trackRef = useRef<HTMLElement>(null);
  useDiptychFlow(trackRef);

  return (
    <section aria-labelledby="diptyque-title" className="diptych-track-z" ref={trackRef}>
      <h2 id="diptyque-title" className="sr-only">
        La maison ZELOR
      </h2>

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
            // Largeur réelle de .diptych-anchor-z : min(42vw, 34rem) desktop,
            // pleine largeur en dessous de 768px.
            sizes="(max-width: 767px) 100vw, min(42vw, 34rem)"
          />
        </figure>
      </div>

      <div className="diptych-flow-z">
        {TEMPS.map((temps) => (
          <div key={temps.surtitre} className="diptych-beat-z" data-ep-track="">
            <p className="eyebrow">{temps.surtitre}</p>
            <p className="diptych-text-z">{temps.texte}</p>
          </div>
        ))}

        <figure className="diptych-minor-z" data-scale="moyen" data-ep-track="">
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
            // Largeur réelle du plan « moyen » : min(27vw, 22rem) desktop,
            // 72vw en dessous de 768px.
            sizes="(max-width: 767px) 72vw, min(27vw, 22rem)"
          />
        </figure>

        <figure className="diptych-minor-z" data-scale="petit" data-ep-track="">
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
