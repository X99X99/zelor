import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { STAGES, STAGE_ASSETS, STAGE_INTENT, STAGE_LABELS, type Stage } from "@/lib/zelor/stages";

/**
 * ————— La séquence : matière, détail, pièce —————
 *
 * Trois panneaux plein cadre qui se relaient sous un grand titre qui, lui, ne
 * bouge pas. La piste mesure trois écrans ; la scène, elle, en occupe un seul
 * et reste collée. C'est de cet écart que vient la profondeur : on parcourt
 * trois écrans de défilement sans que la scène ne quitte le regard.
 *
 * Le passage d'un temps au suivant se fait par masque — `clip-path` — et non
 * par fondu : un fondu superpose deux images, un masque en découvre une. La
 * seconde lecture est plus franche, et c'est celle que l'on cherche.
 *
 * Trois principes de construction, tous vérifiables :
 *
 * 1. Rien n'est animé qui touche à la mise en page. Uniquement `transform`,
 *    `opacity` et `clip-path`, c'est-à-dire ce que le compositeur sait faire
 *    sans recalculer la page.
 *
 * 2. Le changement de temps est déclenché par des balises de hauteur nulle
 *    observées par IntersectionObserver, jamais par un calcul de position dans
 *    un écouteur de défilement. Une balise franchit le milieu de l'écran, le
 *    temps change. C'est tout.
 *
 * 3. La parallaxe, elle, a besoin d'une valeur continue : un seul écouteur
 *    passif, throttlé par requestAnimationFrame, écrit une variable CSS `--sp`
 *    sur la piste. Une écriture par trame, aucune lecture de style forcée.
 *
 * Sans JavaScript, la piste se déplie : les trois panneaux se suivent en flux
 * normal et le titre se répète. Sans mouvement, la parallaxe ne démarre pas et
 * les masques sont instantanés. Dans les deux cas la séquence reste lisible —
 * c'est le contenu qui porte le sens, jamais l'effet.
 */

/** Profondeur simulée : trois calques, trois vitesses. Ce n'est pas de la 3D. */
const LAYERS = ["fond", "sujet", "voile"] as const;

function StageMedia({ stage, index }: { stage: Stage; index: number }) {
  const source = STAGE_ASSETS[stage];

  // Photographie posée sur ce temps. `object-position` fait tout le cadrage :
  // la scène est en plein cadre, l'image y est recoupée, et c'est ce réglage
  // qui décide de ce qui reste dans le champ, en paysage comme en portrait.
  if (source) {
    return (
      <img
        className="stage-media-z"
        src={source.src}
        style={
          {
            "--pos": source.position,
            "--pos-mobile": source.positionMobile ?? source.position,
          } as CSSProperties
        }
        width={source.width}
        height={source.height}
        sizes="100vw"
        // Seul le premier temps entre dans le chemin critique.
        fetchPriority={index === 0 ? "high" : "low"}
        loading={index === 0 ? "eager" : "lazy"}
        decoding="async"
        alt=""
      />
    );
  }

  // Aucune photographie : un emplacement qui se déclare comme tel. On ne
  // substitue jamais une autre image ZELOR — la scène mentirait sur son sujet.
  return (
    <div className="stage-slot-z" data-stage={stage}>
      <p className="stage-slot-label-z">Plan manquant — {STAGE_LABELS[stage]}</p>
      <p className="stage-slot-note-z">{STAGE_INTENT[stage]}</p>
      <p className="stage-slot-note-z">
        Aucune image du dépôt ne montre ce sujet. Rien n'est substitué.
      </p>
    </div>
  );
}

export function StageSequence() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  // Le temps courant est décidé par des balises de hauteur nulle : une balise
  // qui franchit le milieu de l'écran devient le temps actif.
  useEffect(() => {
    const track = trackRef.current;
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
  }, []);

  // Parallaxe : une valeur continue, écrite une fois par trame. Coupée net
  // lorsque l'appareil demande moins de mouvement.
  useEffect(() => {
    const track = trackRef.current;
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

  return (
    <section aria-labelledby="sequence-title" className="stage-track-z" ref={trackRef}>
      <h2 id="sequence-title" className="sr-only">
        Trois temps du regard : la matière, le détail, la pièce
      </h2>

      {/* Déclencheurs sans hauteur ni apparence : ils ne servent qu'à marquer
          le tiers de piste où le temps bascule. */}
      {STAGES.map((stage, index) => (
        <span key={`beacon-${stage}`} className="stage-beacon-z" data-beacon={index} />
      ))}

      {/* Même raison que pour l'ouverture : le fond est une photographie, le
          contraste ne se calcule pas depuis les styles. */}
      <div className="stage-scene-z" data-media-ground="" data-step={step}>
        {STAGES.map((stage, index) => (
          <div
            key={stage}
            className="stage-panel-z"
            data-stage={stage}
            data-active={step === index}
            data-passed={step > index}
            aria-hidden="true"
          >
            {LAYERS.map((layer) => (
              <div key={layer} className="stage-layer-z" data-layer={layer}>
                {layer === "sujet" ? <StageMedia stage={stage} index={index} /> : null}
              </div>
            ))}
          </div>
        ))}

        {/* Le grand titre ne bouge pas : ce sont ses libellés qui se relaient,
            chacun derrière sa propre fenêtre de rognage. */}
        <div className="stage-title-z" aria-hidden="true">
          {STAGES.map((stage, index) => (
            <span key={stage} className="stage-title-line-z" data-active={step === index}>
              <span className="stage-title-word-z">{STAGE_LABELS[stage]}</span>
            </span>
          ))}
        </div>

        {/* Le bouton appartient au dernier temps : il n'a pas à flotter
            au-dessus de la scène du début à la fin. */}
        <div className="stage-cta-z" data-visible={step === STAGES.length - 1}>
          <Link to="/collection" className="btn-lux whitespace-nowrap">
            Découvrir la collection
          </Link>
        </div>
      </div>
    </section>
  );
}
