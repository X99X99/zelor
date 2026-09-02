import { Reveal } from "./Reveal";

/**
 * ————— La bande de réassurance —————
 *
 * Un quart d'écran, deux colonnes étroites — 290 et 255 px sur la référence —
 * posées juste avant le pied de page. C'est la dernière section, et la plus
 * courte de toute la page : 0,26 écran contre 4,27 pour la plus longue.
 *
 * Elle ne cherche pas à convaincre. Elle range trois faits vérifiables et se
 * tait. C'est ce qui la rend crédible, et c'est pourquoi rien n'y est promis
 * qui ne soit documenté.
 */

const FAITS = [
  {
    titre: "Finition",
    texte: "Une arête franche, une couture régulière, un assemblage qui ne se voit pas.",
  },
  {
    titre: "Matière",
    texte: "Une main agréable, une teinte stable, une surface qui se patine sans se marquer.",
  },
  {
    titre: "Conception",
    texte: "Un usage évident dès la première prise en main, sans notice ni apprentissage.",
  },
] as const;

export function Reassurance() {
  return (
    <Reveal as="section" aria-labelledby="reassurance-title" className="reassure-track-z">
      <h2 id="reassurance-title" className="sr-only">
        Ce que nous regardons
      </h2>
      <dl className="reassure-cols-z">
        {FAITS.map((fait) => (
          <div key={fait.titre} className="reassure-col-z">
            <dt className="eyebrow">{fait.titre}</dt>
            <dd className="reassure-text-z">{fait.texte}</dd>
          </div>
        ))}
      </dl>
      <p className="reassure-note-z">
        Nous n'annonçons une origine, une certification ou une garantie que lorsqu'elle est
        documentée.
      </p>
    </Reveal>
  );
}
