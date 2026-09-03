import { useEffect, useState, type RefObject } from "react";

/**
 * ————— La progression de l'ouverture —————
 *
 * Une seule valeur, de 0 à 1, écrite une fois par trame sur la piste. Tout ce
 * que le visiteur voit pendant l'attente en est déduit en CSS : le filet, le
 * pourcentage qui chevauche son bord, l'écartement de la déclaration,
 * l'ouverture du masque, la sortie du fond clair. Aucune horloge parallèle,
 * donc rien qui puisse se désynchroniser.
 *
 * Elle est **automatique** : le visiteur n'a rien à faire. C'était le défaut
 * de fond de la version précédente, où l'ouverture ne commençait qu'au
 * défilement — un site qui attend qu'on le pousse ne fait pas attendre, il
 * reste immobile.
 *
 * Elle est **honnête**. Le premier temps, jusqu'à 0,6, est une attente
 * délibérée : celle qu'on donne à une page pour qu'elle s'installe. Le second
 * ne s'achève que lorsque le média est réellement décodable — `readyState`
 * pour une vidéo, `decode()` pour une image. Si le réseau traîne, la barre
 * traîne avec lui au lieu de mentir ; si le média est déjà là, elle finit sans
 * s'attarder. Un plancher de durée l'empêche de sauter à 100 % sur un cache
 * chaud, où la séquence n'aurait plus de temps pour exister.
 *
 * Elle est **interruptible**. Une molette, une touche, un doigt, et l'attente
 * se termine : on ne retient jamais quelqu'un qui veut entrer.
 *
 * Sous mouvement réduit ou sans JavaScript, elle n'existe pas — la valeur par
 * défaut de la variable place la scène à son état final.
 */

/** Durée du premier temps, celui de l'attente installée. */
const SETTLE_MS = 1500;
/** Durée du second, celui de l'ouverture — plancher, jamais plafond. */
const OPEN_MS = 1100;
/** Part de la course consacrée au premier temps. */
const SETTLE_END = 0.6;

/** Amortissement : rapide au début, posé à l'arrivée. */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function useOvertureLoad(
  track: RefObject<HTMLElement | null>,
  /** Le média dont l'ouverture dépend réellement. */
  media: RefObject<HTMLVideoElement | HTMLImageElement | null>,
  /**
   * Le compteur, écrit directement dans le nœud.
   *
   * Le passer par un état React ferait un rendu par trame pour deux chiffres :
   * soixante rendus par seconde pendant toute l'attente, au moment précis où
   * la page a le plus besoin de son processeur.
   */
  counter: RefObject<HTMLElement | null>,
): { done: boolean } {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const node = track.current;
    if (!node) return;

    let shown = -1;
    const write = (value: number) => {
      node.style.setProperty("--load", value.toFixed(4));
      const pct = Math.round(value * 100);
      // Le pourcentage est un entier : un compteur à décimales se lit comme une
      // métrique, pas comme une attente. Et on n'écrit que s'il a changé.
      if (pct !== shown) {
        shown = pct;
        // L'espace fine insécable avant le signe pourcent est la typographie
        // française juste. Écrite au clavier, elle est signalée comme caractère
        // irrégulier ; échappée, elle passe et reste exactement le même signe.
        if (counter.current) counter.current.textContent = `${pct}\u202f%`;
      }
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      write(1);
      setDone(true);
      return;
    }

    write(0);

    /** Le média est-il réellement prêt à être montré ? */
    const ready = () => {
      const el = media.current;
      if (!el) return true;
      if (el instanceof HTMLVideoElement) return el.readyState >= 3;
      return el.complete && el.naturalWidth > 0;
    };

    const start = performance.now();
    let frame = 0;
    let finished = false;
    let skipped = false;
    let released = () => {};

    const finish = () => {
      if (finished) return;
      finished = true;
      released();
      write(1);
      setDone(true);
    };

    const step = (now: number) => {
      const elapsed = now - start;

      if (skipped) {
        // Sauter ne veut pas dire couper : la course s'achève en une demi-
        // seconde, sur la même trajectoire, plutôt que de disparaître d'un
        // coup et de laisser un trou à la place de l'ouverture.
        const from = Number(node.style.getPropertyValue("--load") || "0");
        const value = Math.min(1, from + 0.045);
        write(value);
        if (value >= 1) return finish();
        frame = window.requestAnimationFrame(step);
        return;
      }

      if (elapsed < SETTLE_MS) {
        write(easeOutCubic(elapsed / SETTLE_MS) * SETTLE_END);
        frame = window.requestAnimationFrame(step);
        return;
      }

      const openElapsed = elapsed - SETTLE_MS;
      const floor = Math.min(1, openElapsed / OPEN_MS);
      // Le second temps ne dépasse pas 0,96 tant que le média n'est pas là :
      // la barre continue d'avancer, sans jamais annoncer une fin qui
      // n'existe pas.
      const cap = ready() ? 1 : 0.96;
      const value = SETTLE_END + Math.min(floor, cap) * (1 - SETTLE_END);
      write(value);

      if (value >= 1) return finish();
      frame = window.requestAnimationFrame(step);
    };

    frame = window.requestAnimationFrame(step);

    /**
     * Pendant l'attente, la page ne bouge pas.
     *
     * Sans ce verrou, une molette impatiente faisait courir la sortie de la
     * scène alors que la scène n'était pas encore ouverte : le logo partait
     * rejoindre l'en-tête avant d'être apparu.
     *
     * Le verrou passe par l'événement, jamais par `overflow` : masquer la
     * barre de défilement le temps de l'attente élargirait la page de quinze
     * pixels puis la rétrécirait — un décalage de mise en page visible, et
     * mesuré comme tel.
     *
     * Le même geste abrège l'attente. Retenir quelqu'un qui veut entrer serait
     * indéfendable ; ici son geste sert à la fois de frein et d'accélérateur,
     * et l'attente s'achève en une demi-seconde.
     */
    const hold = (event: Event) => {
      skipped = true;
      if (event.cancelable) event.preventDefault();
    };
    const blocking = { passive: false } as const;
    window.addEventListener("wheel", hold, blocking);
    window.addEventListener("touchmove", hold, blocking);
    const keys = new Set([" ", "PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End"]);
    const onKey = (event: KeyboardEvent) => {
      skipped = true;
      if (keys.has(event.key)) event.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    const onPointer = () => {
      skipped = true;
    };
    window.addEventListener("pointerdown", onPointer, { passive: true });

    const release = () => {
      window.removeEventListener("wheel", hold);
      window.removeEventListener("touchmove", hold);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
    released = release;

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      release();
      node.style.removeProperty("--load");
    };
  }, [track, media, counter]);

  return { done };
}
