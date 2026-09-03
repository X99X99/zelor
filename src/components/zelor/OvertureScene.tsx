import { useEffect, useRef } from "react";

import detailImage from "@/assets/detail.jpg";
import detailVideo from "@/assets/video-detail.mp4.asset.json";
import { useScrollSteps } from "@/hooks/useScrollSteps";
import { BRAND } from "@/lib/zelor/content";
import { WordReveal } from "./WordReveal";

/**
 * ————— L'ouverture —————
 *
 * Une seule scène collante, trois écrans et demi de piste, et une seule
 * valeur continue — `--sp`, la progression — dont tout le reste est déduit en
 * CSS. Rien n'est animé qui touche à la mise en page : uniquement `transform`,
 * `opacity` et `clip-path`.
 *
 * Le déroulé, dans l'ordre où on le voit :
 *
 *   0,00 → 0,10   fond papier, en-tête absent, une ligne d'attente qui s'encre
 *                 et un filet qui se remplit de gauche à droite
 *   0,10 → 0,14   l'attente se retire
 *   0,11 → 0,34   la scène s'ouvre au centre et gagne le plein écran
 *   0,28 → 0,46   le logo paraît, clair, au centre de la scène
 *   0,36 → 0,52   une ligne secondaire s'inscrit par-dessus
 *   0,52 → 0,80   la scène recule ; le logo la suit, se réduit, passe du clair
 *                 au sombre et rejoint sa place dans l'en-tête, revenu
 *                 l'attendre
 *   0,74 → 1,00   la ligne secondaire s'efface, le texte éditorial arrive
 *
 * L'en-tête n'existe pas pendant l'immersion : il est escamoté vers le haut et
 * ne redescend qu'au moment où le logo va se poser, de sorte que le voyageur
 * trouve une place prête plutôt qu'une barre qui l'aurait devancé. Le logo ne
 * se duplique jamais : le mot-symbole de l'en-tête reste effacé tant que le
 * voyageur n'a pas atteint sa place, puis prend le relais exactement quand
 * l'autre disparaît. Le changement clair → sombre est un fondu croisé entre
 * deux copies superposées, faute de pouvoir interpoler une couleur en `calc`.
 *
 * La destination n'est pas devinée : elle est mesurée sur le vrai mot-symbole
 * de l'en-tête et réécrite à chaque redimensionnement.
 */

const LOADING = "Un instant";

export function OvertureScene() {
  // La progression est miroitée sur la racine : c'est ainsi que l'en-tête sait
  // rester en place pendant le voyage, puis reprendre la main à l'arrivée.
  const { ref } = useScrollSteps(1, "--ovt-p");
  const logoRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  /**
   * La vidéo n'est servie que par le pipeline d'assets du déploiement : en
   * développement local son URL répond 404, et le navigateur journalise
   * l'échec — ce qu'un garde-fou du projet interdit à juste titre.
   *
   * Une vérification préalable ne règle rien : Chromium journalise aussi le
   * 404 d'un `fetch`. Mesuré, pas supposé.
   *
   * La source n'est donc posée qu'en production. Ailleurs, la scène retombe
   * sur la photographie — même sujet, même matière, même cadrage — de sorte
   * que rien n'est substitué et que la composition est identique.
   */
  const source = import.meta.env.PROD ? detailVideo.url : null;

  /**
   * Signale à la feuille de style qu'une ouverture est en cours sur cette page.
   *
   * La progression seule ne suffisait pas : une variable absente vaut sa valeur
   * par défaut, donc `--ovt-p` ne permet pas de distinguer « pas d'ouverture »
   * de « ouverture terminée ». Or l'en-tête doit se comporter différemment dans
   * ces deux cas — escamoté et sans transition pendant l'immersion, normal
   * partout ailleurs. Un attribut se sélectionne ; une variable manquante, non.
   */
  useEffect(() => {
    const root = document.documentElement;
    root.dataset["overture"] = "";
    return () => {
      delete root.dataset["overture"];
    };
  }, []);

  // La scène ne tourne que lorsqu'on la regarde. Une vidéo qui continue de
  // décoder hors écran coûte une batterie pour rien, et sous mouvement réduit
  // elle ne démarre pas du tout.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) void video.play().catch(() => undefined);
          else video.pause();
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(video);
    return () => observer.disconnect();
    // La vidéo n'existe qu'une fois la source confirmée : sans cette
    // dépendance, l'effet tournerait au montage sur une référence vide et
    // n'observerait jamais rien.
  }, [source]);

  // Mesure la place d'arrivée sur le mot-symbole réel de l'en-tête, puis
  // écrit le trajet en variables. Aucune position n'est animée : c'est une
  // translation, et elle part d'un centre connu.
  useEffect(() => {
    const track = ref.current;
    const travelling = logoRef.current;
    if (!track || !travelling) return;

    const measure = () => {
      const target = document.querySelector<HTMLElement>("header .wordmark-z");
      if (!target) return;

      /**
       * L'en-tête est escamoté pendant toute la fenêtre de mesure : lu tel
       * quel, le mot-symbole se trouve 123 px au-dessus de l'écran, et le
       * voyageur atterrissait donc hors champ. Mesuré, pas supposé.
       *
       * On neutralise l'escamotage le temps de la lecture. Le changement de
       * style et sa reprise ont lieu dans la même tâche, avant toute peinture :
       * rien n'apparaît à l'écran, seule la géométrie est celle de la place au
       * repos — celle que le logo doit rejoindre.
       */
      const root = document.documentElement;
      root.dataset["overtureMeasure"] = "";
      const to = target.getBoundingClientRect();
      const from = travelling.getBoundingClientRect();
      delete root.dataset["overtureMeasure"];

      if (!from.width || !to.width) return;

      // La mesure est prise au repos, quand la progression vaut zéro : le
      // voyageur est alors à son échelle de départ, et le rapport est direct.
      track.style.setProperty(
        "--logo-x",
        `${to.left + to.width / 2 - (from.left + from.width / 2)}px`,
      );
      track.style.setProperty(
        "--logo-y",
        `${to.top + to.height / 2 - (from.top + from.height / 2)}px`,
      );
      track.style.setProperty("--logo-scale", (to.width / from.width).toFixed(4));
    };

    // La mesure est refaite tant que le voyage n'a pas commencé. Prise au seul
    // montage, elle tombait 123 px trop haut : la scène collante n'a pas encore
    // sa géométrie définitive à cet instant, et le logo n'est donc pas là où il
    // sera au départ. Constaté à la mesure, pas supposé.
    //
    let frame = 0;
    const remeasure = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const progress = Number(track.style.getPropertyValue("--sp") || "0");
        if (progress < 0.45) measure();
      });
    };

    measure();
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("scroll", remeasure, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", remeasure);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [ref]);

  return (
    <section aria-labelledby="ouverture-title" className="ovt-track-z" ref={ref}>
      {/* `data-media-ground` : sous ce texte il y a une scene filmee ou une
          photographie voilee, pas une couleur. Le contraste ne s'y deduit pas
          des styles calcules et se juge a l'oeil. */}
      <div className="ovt-scene-z" data-media-ground="">
        {/* Le voile passe du papier à l'encre à mesure que la scène s'ouvre. */}
        <div className="ovt-ground-z" aria-hidden="true" />

        <p className="ovt-loading-z" aria-hidden="true">
          {LOADING}
        </p>

        {/* Le filet d'attente. Il ne feint pas un chargement réseau : il trace
            l'avancement réel de la séquence, celui-là même que le visiteur
            pilote. Décalé des bords, comme le reste de la composition. */}
        <div className="ovt-bar-z" aria-hidden="true">
          <span className="ovt-bar-fill-z" />
        </div>

        {/* La scène : une arête de pierre en rotation, filmée. Pas une 3D.
            La photographie sert d'affiche et de repli — même sujet, même
            matière, donc rien n'est substitué.

            La boîte occupe tout l'écran et c'est l'échelle qui la réduit : un
            petit rectangle au centre, aux proportions de la fenêtre, qui gagne
            le plein écran puis recule. Aucune largeur n'est animée. */}
        <div className="ovt-stage-z">
          {source ? (
            <video
              className="ovt-media-z"
              ref={videoRef}
              src={source}
              poster={detailImage}
              width={1088}
              height={768}
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              aria-hidden="true"
              tabIndex={-1}
            />
          ) : (
            <img
              className="ovt-media-z"
              src={detailImage}
              width={1408}
              height={1008}
              alt=""
              decoding="async"
            />
          )}
          <div className="ovt-grain-z" aria-hidden="true" />
        </div>

        {/* Deux copies superposées, l'une claire, l'autre sombre. */}
        <div className="ovt-logo-z" ref={logoRef} aria-hidden="true">
          <span className="ovt-logo-face-z" data-face="light">
            {BRAND.name}
          </span>
          <span className="ovt-logo-face-z" data-face="dark">
            {BRAND.name}
          </span>
        </div>

        <p className="ovt-caption-z" aria-hidden="true">
          Archives sculptées
        </p>

        <div className="ovt-editorial-z">
          <h1 id="ouverture-title" className="sr-only">
            {BRAND.name} — l'élégance dans chaque détail
          </h1>
          <WordReveal
            className="ovt-statement-z"
            text="Ce qui a été **porté** une fois _mérite_ une **forme** qui *demeure.*"
            step={90}
          />
          <p className="ovt-promise-z hero-promise-z">Pour faire de chaque détail une promesse.</p>
        </div>

        <p className="ovt-cue-z" aria-hidden="true">
          <span className="ovt-cue-line-z" />
          Faire défiler
          <span className="ovt-cue-arrow-z" />
        </p>
      </div>
    </section>
  );
}
