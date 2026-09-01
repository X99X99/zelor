import { useEffect, useRef } from "react";

import { HeroFrame } from "./HeroFrame";

/**
 * Ouverture épinglée.
 *
 * Le geste d'accueil de Vero Studio, et le seul qui explique pourquoi leur
 * page ne ressemble à aucune autre : le titre ne surmonte pas une image, il
 * l'entoure. Deux lignes de capitales, l'image entre les deux, et le
 * défilement ne fait pas descendre la page — il fait grandir l'image jusqu'à
 * ce qu'elle passe derrière les mots.
 *
 * Chez eux la scène est rendue en WebGL sur toute la hauteur du cadre. Nous
 * la faisons en CSS : une section haute de deux écrans et demi, un contenu
 * collant qui reste à l'écran pendant qu'elle défile, et une seule variable
 * — la progression de 0 à 1 — qui pilote l'échelle de l'image et l'écart des
 * lignes. Le résultat se lit pareil et ne coûte ni Three.js ni une seconde de
 * chargement.
 *
 * La progression est écrite dans une propriété personnalisée plutôt que dans
 * l'état React : à soixante images par seconde, un rendu React par image
 * ferait tomber le défilement. Ici rien ne se recalcule, le navigateur
 * n'interpole que deux transformations.
 */
export function HeroScroll() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.style.setProperty("--p", "1");
      return;
    }

    let frame = 0;
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
    <section ref={ref} className="hero-scroll-z" aria-labelledby="hero-title">
      <div className="hero-stick-z">
        <p className="eyebrow hero-eyebrow-z">Maison ZELOR</p>

        {/* Le titre est un seul H1 : les deux lignes sont des fragments d'une
            même phrase, et l'image qui les sépare est décorative. Un lecteur
            d'écran doit entendre « L'élégance dans chaque détail » d'un trait. */}
        <h1 id="hero-title" className="hero-title-z display-hero-z">
          <span className="hero-line-z hero-line-a-z">L'élégance dans</span>
          <HeroFrame />
          <span className="hero-line-z hero-line-b-z">
            chaque <em>détail</em>
          </span>
        </h1>
      </div>
    </section>
  );
}
