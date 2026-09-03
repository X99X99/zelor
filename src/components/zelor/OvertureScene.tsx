import { useEffect, useRef, type CSSProperties } from "react";

import detailImage from "@/assets/detail.jpg";
import detailVideo from "@/assets/video-detail.mp4.asset.json";
import { useOvertureLoad } from "@/hooks/useOvertureLoad";
import { useScrollSteps } from "@/hooks/useScrollSteps";
import { BRAND } from "@/lib/zelor/content";
import { WordReveal } from "./WordReveal";

/**
 * ————— L'ouverture —————
 *
 * Deux temps, et deux valeurs continues.
 *
 * ┌ `--load` ─ automatique, de 0 à 1, écrite par une horloge. Le visiteur n'a
 * │ rien à faire : la page s'ouvre seule.
 * │
 * │   0,00 → 0,18   la déclaration s'inscrit sur le fond clair
 * │   0,00 → 1,00   le filet se remplit ; le pourcentage chevauche son bord
 * │   0,60 → 1,00   les deux moitiés de la déclaration s'écartent, et le
 * │                 masque du média s'ouvre entre elles jusqu'au plein écran
 * │   1,00          le fond clair et l'attente ont disparu ; la vidéo joue,
 * │                 le logo clair est au centre, la légende et la flèche sont
 * │                 en place, l'en-tête n'existe toujours pas
 * │
 * └ `--sp` ─ le défilement, un écran, et seulement une fois l'attente finie.
 *
 *     0,00 → 0,85   la scène se réduit, remonte et quitte l'écran par le haut
 *     0,00 → 0,70   le logo la suit, se réduit, passe du clair au sombre et
 *                   rejoint exactement sa place dans l'en-tête
 *     0,62 → 0,74   l'en-tête redescend, une fois le logo posé
 *     0,55 → 1,00   le texte éditorial arrive mot par mot
 *
 * Le média ne grandit pas par une échelle mais par un masque : le sujet reste
 * à sa taille, c'est la fenêtre qui s'ouvre. Une échelle aurait fait un zoom —
 * l'arête de pierre aurait grossi avec le cadre, ce qui se lit comme un
 * agrandissement d'image, pas comme une ouverture de scène.
 *
 * Rien n'est animé qui touche à la mise en page : `transform`, `opacity` et
 * `clip-path`, et rien d'autre.
 */

export function OvertureScene() {
  // La progression du défilement est miroitée sur la racine : c'est ainsi que
  // l'en-tête sait rester escamoté puis reprendre la main à l'arrivée du logo.
  const { ref } = useScrollSteps(1, "--ovt-p");
  const logoRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

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

  // L'attente attend le vrai média, pas une durée décidée d'avance.
  const { done } = useOvertureLoad(ref, source ? videoRef : imageRef, counterRef);

  /**
   * Signale à la feuille de style qu'une ouverture est en cours sur cette page.
   *
   * La progression seule ne suffit pas : une variable absente vaut sa valeur
   * par défaut, donc `--ovt-p` ne distingue pas « pas d'ouverture » de
   * « ouverture terminée ». Un attribut se sélectionne ; une variable
   * manquante, non.
   */
  useEffect(() => {
    const root = document.documentElement;
    root.dataset["overture"] = "";
    return () => {
      delete root.dataset["overture"];
    };
  }, []);

  /**
   * La lecture démarre dès que la vidéo est décodable — pas au premier
   * verdict de l'observateur d'intersection.
   *
   * La scène occupe l'écran entier dès le montage, mais son masque, piloté
   * par l'attente, la maintient fermée sur la seule fente de la déclaration
   * pendant tout le premier temps du chargement : `--lp-open` vaut zéro tant
   * que `--load` n'a pas atteint 0,6, soit 1,5 s par construction. Or
   * `.ovt-stage-z` porte `overflow: hidden` : l'observateur mesure alors
   * honnêtement une quasi-absence d'intersection — ce n'est pas une erreur de
   * mesure, c'est l'effet réel du masque qu'il observe. Attendre son verdict
   * revenait donc à attendre la fin du masque pour lancer une lecture qui
   * doit au contraire être déjà en mouvement quand le masque s'ouvre.
   *
   * Mesuré sur le site publié, instrumenté image par image : la lecture ne
   * démarrait qu'à 1,9 s, exactement quand le masque franchissait 5 %
   * d'aire visible — la coïncidence du seuil choisi avec l'ouverture du
   * masque, pas un aléa de réseau. Écart mesuré sur trois essais frais :
   * 1582, 1577 et 1507 ms entre la vidéo décodable et sa lecture réelle.
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }

    const attemptPlay = () => {
      if (!video.paused) return;
      video.play().catch((error: unknown) => {
        const name = error instanceof DOMException ? error.name : "";
        // Une lecture interrompue par une commande suivante (AbortError), ou
        // refusée par une politique de navigateur malgré `muted` et
        // `playsInline` (NotAllowedError), n'est pas une erreur de notre
        // code : la photographie de repli reste affichée par le poster.
        // Toute autre cause est signalée, jamais masquée en silence.
        if (name !== "AbortError" && name !== "NotAllowedError") {
          console.error("Lecture de la scène d'ouverture impossible :", error);
        }
      });
    };

    if (video.readyState >= 3) attemptPlay();
    video.addEventListener("canplay", attemptPlay);

    // Une fois lancée, la scène s'arrête quand elle quitte réellement l'écran.
    // Ici l'observateur redevient fiable : passé le chargement, le masque
    // reste grand ouvert et seuls `transform`/`opacity` bougent pendant la
    // sortie, ce que l'intersection mesure correctement.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) attemptPlay();
          else video.pause();
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(video);

    return () => {
      video.removeEventListener("canplay", attemptPlay);
      observer.disconnect();
    };
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

    // La mesure est refaite au défilement tant que le voyage est jeune : prise
    // au seul montage, elle tombait 123 px trop haut, la scène collante n'ayant
    // pas encore sa géométrie définitive à cet instant.
    //
    // Le même attribut neutralise l'escamotage de l'en-tête ET la translation
    // du voyageur : sans le second, une mesure prise après le moindre
    // défilement enregistrait un trajet déjà entamé, donc trop court, et le
    // logo s'arrêtait 145 px avant sa place. Constaté à la mesure.
    let frame = 0;
    const remeasure = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const progress = Number(track.style.getPropertyValue("--sp") || "0");
        if (progress < 0.3) measure();
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
    <section
      aria-labelledby="ouverture-title"
      className="ovt-track-z"
      data-loaded={done ? "true" : "false"}
      ref={ref}
    >
      {/* `data-media-ground` : sous ce texte il y a une scene filmee ou une
          photographie voilee, pas une couleur. Le contraste ne s'y deduit pas
          des styles calcules et se juge a l'oeil. */}
      <div className="ovt-scene-z" data-media-ground="">
        {/* Le fond de l'attente. Papier tant que la scène n'est pas ouverte,
            encre ensuite. */}
        <div className="ovt-ground-z" aria-hidden="true" />

        {/* La scène. Elle occupe l'écran entier dès le premier instant ; c'est
            son masque qui ne laisse voir qu'un rectangle au centre, puis
            s'ouvre. Le sujet ne bouge donc jamais d'échelle. */}
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
              preload="auto"
              aria-hidden="true"
              tabIndex={-1}
            />
          ) : (
            <img
              className="ovt-media-z"
              ref={imageRef}
              src={detailImage}
              width={1408}
              height={1008}
              alt=""
              fetchPriority="high"
              decoding="async"
            />
          )}
          <div className="ovt-grain-z" aria-hidden="true" />
        </div>

        {/* Le logo reste clair de bout en bout.

            La référence le fait passer du clair au sombre parce que son en-tête
            est sombre sur fond crème. Celui de ZELOR est marine et son
            mot-symbole est clair ; le fond que le logo traverse pendant sa
            sortie est marine lui aussi. Un logo qui s'assombrirait en route
            deviendrait un fantôme à mi-parcours puis n'arriverait pas — c'est
            exactement ce que montrait la capture à 0,55 de la sortie.

            Le geste transposé n'est donc pas de changer de couleur, c'est que
            le logo prenne celle de sa destination. Ici, les deux coïncident. */}
        <div className="ovt-logo-z" ref={logoRef} aria-hidden="true">
          <span className="ovt-logo-face-z">
            {BRAND.name.split("").map((letter, index) => (
              <span key={index} className="ovt-logo-letter-mask-z">
                <span
                  className="ovt-logo-letter-z"
                  style={{ "--letter-i": index } as CSSProperties}
                >
                  {letter}
                </span>
              </span>
            ))}
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

        {/* La flèche seule, sans libellé : à ce moment la page n'a plus qu'une
            chose à dire, et un mot de plus la ferait bavarder. */}
        <p className="ovt-cue-z" aria-hidden="true">
          <span className="ovt-cue-arrow-z" />
        </p>
      </div>

      {/* ——— L'attente ———
          Elle reste montée, invisible et hors d'atteinte, une fois finie : la
          démonter ferait un remontage au moindre re-rendu, et un trou à la
          place de la scène. Aucun élément focalisable, donc rien qui traîne
          dans l'ordre de tabulation. */}
      <div className="ovt-loader-z" aria-hidden="true">
        <div className="ovt-decl-z">
          <span className="ovt-decl-half-z" data-half="haut">
            <span className="ovt-decl-line-z">
              <span className="ovt-w-z" data-rank="liaison">
                l&rsquo;
              </span>
              <span className="ovt-w-z" data-rank="majeur">
                Élégance
              </span>
            </span>
            {/* Le mot de liaison seul sur sa ligne, juste au-dessus de la
                fente : c'est une respiration, et c'est ce qui laisse au mot
                principal toute sa place. */}
            <span className="ovt-decl-line-z">
              <span className="ovt-w-z" data-rank="liaison">
                dans
              </span>
            </span>
          </span>

          {/* La place du média : c'est par cette fente que la scène apparaît,
              et c'est en l'écartant que les deux moitiés lui font place. */}
          <span className="ovt-decl-gap-z" />

          <span className="ovt-decl-half-z" data-half="bas">
            <span className="ovt-decl-line-z">
              <span className="ovt-w-z" data-rank="median">
                chaque
              </span>
            </span>
            <span className="ovt-decl-line-z">
              <span className="ovt-w-z" data-rank="mineur">
                détail
              </span>
              <span className="ovt-w-z" data-rank="point">
                .
              </span>
            </span>
          </span>
        </div>

        <div className="ovt-bar-z">
          <span className="ovt-bar-fill-z" />
          <span className="ovt-bar-pct-z" ref={counterRef}>
            0 %
          </span>
        </div>
      </div>
    </section>
  );
}
