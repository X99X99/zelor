import { type CSSProperties, type ElementType } from "react";

import { Reveal } from "./Reveal";

/**
 * Titre révélé mot à mot.
 *
 * Le geste que Vero Studio emploie sur tous ses titres, et qu'aucun des
 * autres sites mesurés n'a : le titre ne se fond pas, il se relève. Chaque
 * mot est enfermé dans une fenêtre qui le rogne et remonte depuis le bas,
 * décalé de 100 ms sur le précédent — la cadence relevée chez Vero comme
 * chez Cucinelli.
 *
 * On découpe par mot, jamais par lettre. Une lettre qui bouge seule est un
 * effet ; un mot qui se lève est une phrase qui se compose.
 *
 * L'italique est traité ici plutôt qu'en appelant, parce que le découpage
 * détruirait tout balisage passé en enfant : `italicWords` penche les n
 * premiers mots, ce qui suffit à la seule construction dont nous ayons
 * besoin — un mot penché en tête d'une ligne romaine.
 */
export function SplitReveal({
  text,
  as: Tag = "h2",
  italicWords = 0,
  className = "",
  ...rest
}: {
  text: string;
  as?: ElementType;
  /** Nombre de mots en tête à composer en italique. */
  italicWords?: number;
  className?: string;
  [key: string]: unknown;
}) {
  const words = text.split(" ").filter(Boolean);

  return (
    <Reveal as={Tag} className={`split-host-z ${className}`} {...rest}>
      {words.map((word, index) => (
        // Le mot et son espace vivent dans la même fenêtre : sans cela,
        // l'espace reste fixe et la ligne se disloque pendant la montée.
        <span key={`${word}-${index}`} className="split-line-z">
          <span
            className={`split-word-z${index < italicWords ? " italic" : ""}`}
            style={{ "--word-index": index } as CSSProperties}
          >
            {word}
            {index < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </Reveal>
  );
}
