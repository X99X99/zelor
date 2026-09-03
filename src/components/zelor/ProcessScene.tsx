import { Link } from "@tanstack/react-router";

import heroImage from "@/assets/hero.jpg";
import { beaconStyle, useScrollSteps } from "@/hooks/useScrollSteps";
import { MediaSlot } from "./MediaSlot";

/**
 * ————— Ce que nous vérifions —————
 *
 * Aucune photographie du dépôt ne montre un geste, un atelier ou une étape de
 * fabrication : les trois images disponibles sont des plans de matière ou des
 * scènes de style, jamais un process. Construire une scène « atelier » avec
 * elles mentirait sur ce qu'elles montrent — cette scène n'en construit donc
 * pas une.
 *
 * Ce qui existe réellement : quatre critères, déjà écrits et publiés sur
 * `/qualite`, présentés là comme « ce que nous regardons, dans l'ordre ».
 * C'est cette phrase même — pas une nouvelle affirmation — qui justifie une
 * séquence plutôt qu'une liste plate. Aucun des quatre n'est nouveau ici.
 *
 * La structure s'écarte donc du gabarit habituel « image principale +
 * détails » : une seule image réelle ancre la scène (un plan de matière, tout
 * ce qu'une photographie de ce dépôt peut honnêtement montrer), et c'est le
 * texte qui avance en quatre temps — pas des vignettes fabriquées pour
 * occuper la place d'un détail qui n'existe pas.
 *
 * Trois des quatre critères existent déjà dans `Reassurance`, en fin de page.
 * Ce n'est pas une redite masquée : ici ils sont mis en séquence (« dans
 * l'ordre », la phrase déjà publiée), le quatrième — le délai d'essai avant
 * mise en ligne — n'apparaît nulle part ailleurs, et la scène sort vers la
 * page qui les détaille tous.
 */

const STEPS = [
  {
    title: "Finition",
    text: "Une arête franche, une couture régulière, un assemblage qui ne se remarque pas.",
  },
  {
    title: "Matière",
    text: "Une main agréable, une teinte stable, une surface qui se patine sans se marquer.",
  },
  {
    title: "Conception",
    text: "Un usage évident dès la première prise en main, sans notice ni apprentissage.",
  },
  {
    title: "Avant la mise en ligne",
    text: "Plusieurs semaines d'essai, pour chaque pièce, avant qu'elle ne rejoigne la sélection.",
  },
] as const;

export function ProcessScene() {
  const { ref, step } = useScrollSteps(STEPS.length);

  return (
    <section aria-labelledby="process-title" className="process-track-z" ref={ref}>
      <h2 id="process-title" className="sr-only">
        Ce que nous vérifions, dans l'ordre
      </h2>

      {/* Balises sans hauteur ni apparence : elles seules disent à
          useScrollSteps quand un temps devient actif. Sans elles, son
          observateur ne trouve rien et `step` ne bouge jamais — constaté à la
          mesure, corrigé ici. */}
      {STEPS.map((_, index) => (
        <span
          key={`beacon-${index}`}
          className="scene-beacon-z"
          data-beacon={index}
          style={beaconStyle(index, STEPS.length)}
        />
      ))}

      <div className="process-scene-z">
        <div className="process-anchor-z">
          <figure className="process-figure-z">
            <MediaSlot
              source={{
                // La céramique du vase, resserrée : la vue large sert déjà le
                // diptyque, celle-ci n'a jamais été cadrée ailleurs sur le
                // site. Vérifié à l'image avant de choisir ce recadrage.
                src: heroImage,
                position: "58% 52%",
                width: 1920,
                height: 1200,
              }}
              fichier="zelor-matiere-ceramique"
              role="Matière"
              format="4:5"
              className="process-media-z"
              // Largeur réelle de la colonne d'ancrage : minmax(0, 30rem)
              // desktop, max-width 20rem en dessous de 768px.
              sizes="(max-width: 767px) 20rem, min(30rem, 100vw)"
            />
          </figure>
        </div>

        <div className="process-flow-z">
          <p className="eyebrow process-eyebrow-z">Ce que nous vérifions</p>

          <ol className="process-steps-z">
            {STEPS.map((s, index) => (
              <li key={s.title} className="process-step-z" data-active={step === index}>
                <span className="process-step-index-z">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p className="process-step-title-z">{s.title}</p>
                  <p className="process-step-text-z">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="process-bar-z" aria-hidden="true">
            <span className="process-bar-fill-z" />
          </div>

          <Link to="/qualite" className="link-underline text-sm process-link-z">
            Nos critères en détail
          </Link>
        </div>
      </div>
    </section>
  );
}
