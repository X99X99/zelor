import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";

import { HeroFrame } from "./HeroFrame";

/** Les trois temps du regard : de la matière au détail, du détail à la pièce. */
const STEPS = ["La matière", "Le détail", "La pièce"] as const;

/**
 * Ouverture épinglée, en trois temps.
 *
 * Le titre n'est pas posé sur une image, il l'entoure : deux lignes de
 * capitales, l'image entre les deux, et le défilement ne fait pas descendre la
 * page — il fait grandir l'image jusqu'à ce qu'elle passe derrière les mots.
 *
 * Une seule variable pilote la scène : la progression de 0 à 1, écrite dans
 * une propriété personnalisée plutôt que dans l'état React. À soixante images
 * par seconde, un rendu React par image ferait tomber le défilement ; ici rien
 * ne se recalcule, le navigateur n'interpole que deux transformations.
 *
 * L'état React ne sert qu'au temps courant — trois valeurs sur toute la
 * course, donc trois rendus au maximum.
 *
 * Règle de commerce, et elle prime sur la mise en scène : la phrase de marque
 * et le bouton sont visibles dès le premier écran, avant tout défilement. Une
 * maison peut faire attendre pour être admirée ; une boutique ne peut pas
 * faire attendre pour être comprise.
 */
export function HeroScroll() {
  const ref = useRef<HTMLElement | null>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.style.setProperty("--p", "1");
      return;
    }

    let frame = 0;
    let current = -1;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      // La course utile va du haut de la section jusqu'à ce qu'il ne reste
      // qu'un écran : au-delà, le contenu collant se décolle et la scène est
      // terminée de toute façon.
      const run = rect.height - window.innerHeight;
      if (run <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / run));
      node.style.setProperty("--p", progress.toFixed(4));

      const next = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length));
      if (next !== current) {
        current = next;
        setStep(next);
      }
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={ref} className="hero-scroll-z" aria-labelledby="hero-title" data-step={step}>
      <div className="hero-stick-z">
        <p className="eyebrow hero-eyebrow-z">Maison ZELOR</p>

        {/* Le titre est un seul H1 : les deux lignes sont des fragments d'une
            même phrase, et l'image qui les sépare est décorative. Un lecteur
            d'écran doit entendre « L'élégance dans chaque détail » d'un trait. */}
        <h1 id="hero-title" className="caps-z hero-title-z display-hero-z">
          {/* L'espace en fin de chaîne est sémantique : sans elle, le
              textContent du titre se lit « L'élégance danschaque détail », les
              deux moitiés étant séparées par l'image. Une espace en fin de
              ligne d'un bloc est supprimée à la mise en page : le rendu ne
              bouge pas d'un pixel. */}
          <span className="hero-line-z hero-line-a-z">{"L'élégance dans "}</span>
          <HeroFrame />
          <span className="hero-line-z hero-line-b-z">
            chaque <em>détail</em>
          </span>
        </h1>

        {/* Nommer ce que l'on regarde. Trois mots qui se relaient au fil de la
            course : c'est la narration de la maison — de la matière au détail,
            du détail à la pièce. Décoratif pour un lecteur d'écran, qui
            entendrait sinon trois fragments sans phrase. */}
        <p aria-hidden="true" className="hero-steps-z">
          {STEPS.map((label) => (
            <span key={label} className="hero-step-z">
              {label}
            </span>
          ))}
        </p>

        <div className="hero-foot-z">
          <p className="hero-promise-z">Pour faire de chaque détail une promesse.</p>
          <Link to="/collection" className="btn-lux whitespace-nowrap">
            Découvrir la collection
          </Link>
        </div>
      </div>
    </section>
  );
}
