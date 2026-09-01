import { type CSSProperties, type ElementType } from "react";

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
 * 2. Une ligne de capitales romaines qu'un seul mot en bas-de-casse italique
 *    vient contredire. C'est la construction de tous leurs titres, et elle ne
 *    tient que par l'exception : deux mots penchés et il n'y a plus d'accent.
 *
 * L'accent se note dans le texte lui-même, entre astérisques :
 *   « L'élégance dans chaque *détail* »
 * Le mot marqué sort des capitales et passe en italique ; tout le reste suit
 * la règle de la feuille de style. On note l'accent dans la chaîne plutôt que
 * par un index, parce que le mot penché n'est presque jamais le premier.
 */
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
  const words = text.split(" ").filter(Boolean);

  return (
    <Reveal as={Tag} className={`split-host-z ${className}`} {...rest}>
      {words.map((word, index) => {
        const accent = word.startsWith("*") && word.endsWith("*") && word.length > 2;
        const plain = accent ? word.slice(1, -1) : word;
        return (
          // Le mot et son espace vivent dans la même fenêtre : sans cela,
          // l'espace reste fixe et la ligne se disloque pendant la montée.
          <span key={`${word}-${index}`} className="split-line-z">
            <span
              className={`split-word-z${accent ? " accent-z" : ""}`}
              style={{ "--word-index": index } as CSSProperties}
            >
              {plain}
              {index < words.length - 1 ? " " : ""}
            </span>
          </span>
        );
      })}
    </Reveal>
  );
}
