import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Scène pilotée par le défilement : un temps courant, et une progression.
 *
 * La mécanique est celle relevée sur la référence, et elle tient en deux
 * pièces :
 *
 * 1. Le **temps courant** vient de balises empilées sur la piste, observées par
 *    IntersectionObserver avec une fenêtre réduite à une ligne au milieu de
 *    l'écran. La part que cette ligne traverse devient le temps actif. Aucun
 *    calcul de position dans un écouteur, donc aucun risque de désynchronisation.
 *
 *    Les balises ont une hauteur réelle, jamais nulle : l'intersection d'une
 *    hauteur nulle avec une fenêtre de hauteur nulle est un cas dégénéré que le
 *    moteur ne rapporte pas. Mesuré, pas supposé.
 *
 * 2. La **progression** est continue, donc elle a besoin du défilement. Un seul
 *    écouteur passif, throttlé par requestAnimationFrame, écrit `--sp` sur la
 *    piste. Une écriture par trame, aucune lecture de style forcée, rien qui
 *    touche à la mise en page.
 *
 * Sous `prefers-reduced-motion`, la progression n'est jamais installée : la
 * variable reste absente et les styles retombent sur leur valeur par défaut.
 */
export function useScrollSteps(count: number): {
  ref: RefObject<HTMLDivElement | null>;
  step: number;
} {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const track = ref.current;
    if (!track) return;
    const beacons = Array.from(track.querySelectorAll<HTMLElement>("[data-beacon]"));
    if (!beacons.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number(entry.target.getAttribute("data-beacon"));
          if (Number.isInteger(index)) setStep(index);
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    for (const beacon of beacons) observer.observe(beacon);
    return () => observer.disconnect();
  }, [count]);

  useEffect(() => {
    const track = ref.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const write = () => {
      frame = 0;
      const rect = track.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const progress = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      track.style.setProperty("--sp", progress.toFixed(4));
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
  }, []);

  return { ref, step };
}

/**
 * Balises de déclenchement, réparties en parts égales sur la piste.
 * Rendues par le composant qui appelle le hook, pour rester du HTML lisible.
 */
export function beaconStyle(
  index: number,
  count: number,
): {
  top: string;
  height: string;
} {
  const part = 100 / count;
  return { top: `${(index * part).toFixed(4)}%`, height: `${part.toFixed(4)}%` };
}
