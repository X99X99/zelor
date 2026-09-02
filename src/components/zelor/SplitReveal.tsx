import { Fragment, type CSSProperties, type ElementType } from "react";

import { Reveal } from "./Reveal";

/**
 * Titre révélé mot à mot, avec accent penché.
 *
 * Deux gestes de Vero Studio réunis dans un seul composant, parce qu'ils ne
 * se séparent pas chez eux :
 *
 * 1. Le titre ne se fond pas, il se relève. Chaque mot est enfermé dans une
 *    fenêtre qui le rogne et remonte depuis le bas, décalé de 100 ms sur le
 *    précédent — la cadence relevée chez Vero comme chez Cucinelli. On
 *    découpe par mot, jamais par lettre : une lettre qui bouge seule est un
 *    effet, un mot qui se lève est une phrase qui se compose.
 *
 * 2. Une ligne romaine qu'un passage en italique vient contredire. C'est la
 *    construction de tous leurs titres, et elle ne tient que par l'exception :
 *    tout pencher, c'est ne plus rien accentuer.
 *
 * L'accent se note dans le texte lui-même, entre astérisques, et il peut
 * couvrir plusieurs mots :
 *   « Le goût des choses bien *choisies.* »
 *   « Ce que nous regardons *avant de sélectionner* une pièce. »
 *
 * Le fragment est repéré avant le découpage, pas après : la détection portait
 * auparavant sur chaque mot pris isolément, si bien qu'un fragment de
 * plusieurs mots laissait ses astérisques à l'écran. On lit donc la chaîne
 * une fois, on en extrait les passages penchés, puis on découpe.
 */

/** Un mot prêt à être posé : son texte, et s'il appartient à un passage penché. */
type Word = { text: string; accent: boolean };

/**
 * Découpe la chaîne en mots, en marquant ceux qui tombent dans un passage
 * entre astérisques. Une astérisque non refermée est traitée comme du texte :
 * mieux vaut un titre correct qu'un titre à moitié penché.
 */
function parseWords(text: string): Word[] {
  const words: Word[] = [];
  for (const segment of text.split(/(\*[^*]+\*)/g)) {
    if (!segment) continue;
    const accent = segment.startsWith("*") && segment.endsWith("*") && segment.length > 2;
    const plain = accent ? segment.slice(1, -1) : segment;
    for (const word of plain.split(" ")) {
      if (word) words.push({ text: word, accent });
    }
  }
  return words;
}

export function SplitReveal({
  text,
  as: Tag = "h2",
  className = "",
  ...rest
}: {
  text: string;
  as?: ElementType;
  className?: string;
  [key: string]: unknown;
}) {
  const words = parseWords(text);

  return (
    <Reveal as={Tag} className={`split-host-z ${className}`} {...rest}>
      {words.map((word, index) => (
        // L'espace vit ENTRE les fenêtres, jamais dedans. Placé à l'intérieur,
        // il tombait en fin de contenu d'un inline-block, où le traitement des
        // blancs le supprime : les trois titres de l'accueil se lisaient
        // « Legoûtdeschosesbienchoisies. ». Entre deux boîtes inline-block, en
        // revanche, il est conservé et autorise le retour à la ligne. Il reste
        // hors du rognage, ce qui est sans effet visible — un espace n'a pas de
        // glyphe à faire monter.
        <Fragment key={`${word.text}-${index}`}>
          {index > 0 ? " " : null}
          <span className="split-line-z">
            <span
              className={`split-word-z${word.accent ? " accent-z" : ""}`}
              style={{ "--word-index": index } as CSSProperties}
            >
              {word.text}
            </span>
          </span>
        </Fragment>
      ))}
    </Reveal>
  );
}
