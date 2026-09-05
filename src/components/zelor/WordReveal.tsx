import { Fragment, type CSSProperties, type ElementType } from "react";

/**
 * ————— Le texte qui arrive mot par mot —————
 *
 * Chaque mot monte derrière sa propre fenêtre de rognage, décalé sur le
 * précédent. Deux règles gouvernent le composant, et elles ont toutes deux été
 * apprises en cassant quelque chose :
 *
 * 1. **L'espace vit ENTRE les fenêtres, jamais dedans.** Placé à l'intérieur,
 *    il tombe en fin de contenu d'un `inline-block`, où le traitement des
 *    blancs le supprime — trois titres du site se sont lus
 *    « Legoûtdeschosesbienchoisies. » pendant plusieurs versions. Entre deux
 *    boîtes, il est conservé et autorise le retour à la ligne.
 *
 * 2. **Le `textContent` reste lisible d'un trait.** Un lecteur d'écran lit la
 *    phrase, pas une liste de mots ; le découpage est purement visuel.
 *
 * La hiérarchie ne passe jamais par la graisse. Elle passe par le corps, la
 * famille et le décalage vertical, notés dans le texte lui-même :
 *
 *   *mot*    accent penché, dans la famille d'affichage
 *   **mot**  palier majeur, nettement plus grand
 *   _mot_    palier mineur, plus petit et décalé
 *
 * Sans JavaScript et sous mouvement réduit, tous les mots sont simplement là.
 */

type Rank = "base" | "major" | "minor" | "accent";

type Word = { text: string; rank: Rank };

/**
 * Lit la chaîne une fois, en extrait les fragments marqués, puis découpe. La
 * détection portait autrefois sur chaque mot pris isolément, si bien qu'un
 * fragment de plusieurs mots laissait ses marques à l'écran.
 */
function parseWords(text: string): Word[] {
  const words: Word[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g;

  for (const segment of text.split(pattern)) {
    if (!segment) continue;

    let rank: Rank = "base";
    let plain = segment;

    if (segment.startsWith("**") && segment.endsWith("**") && segment.length > 4) {
      rank = "major";
      plain = segment.slice(2, -2);
    } else if (segment.startsWith("*") && segment.endsWith("*") && segment.length > 2) {
      rank = "accent";
      plain = segment.slice(1, -1);
    } else if (segment.startsWith("_") && segment.endsWith("_") && segment.length > 2) {
      rank = "minor";
      plain = segment.slice(1, -1);
    }

    for (const word of plain.split(" ")) {
      if (word) words.push({ text: word, rank });
    }
  }

  return words;
}

export function WordReveal({
  text,
  as: Tag = "p",
  className = "",
  // 100 ms, la valeur de la référence : son décalage s'écrit
  // `calc(var(--stagger) * .1s)`, soit un dixième de seconde par rang.
  step = 100,
  delay = 0,
  ...rest
}: {
  text: string;
  as?: ElementType;
  className?: string;
  /** Décalage entre deux mots, en millisecondes. */
  step?: number;
  /** Retard avant le premier mot. */
  delay?: number;
} & Record<string, unknown>) {
  const words = parseWords(text);

  return (
    <Tag className={`word-host-z ${className}`.trim()} {...rest}>
      {words.map((word, index) => (
        <Fragment key={`${word.text}-${index}`}>
          {index > 0 ? " " : null}
          {/* Le rang porte sur le masque, pas sur le mot.
              Posé sur le mot, il n'en changeait que le corps : la fenêtre
              gardait la hauteur du texte courant, tandis que le mot réduit ne
              se translatait que de sa propre hauteur — plus petite — et
              dépassait par le bas. « mérite » restait lisible neuf pixels
              au-dessus de la ligne avant son entrée. Constaté à l'image.
              Sur le masque, le mot hérite du corps : les deux boîtes ont la
              même métrique et la fenêtre rogne à nouveau. */}
          <span className="word-mask-z" data-rank={word.rank}>
            <span
              className="word-body-z"
              style={
                {
                  // Deux façons de décaler les mots : un retard, quand la
                  // montée est chronométrée ; un rang, quand elle est pilotée
                  // par le défilement. Le composant fournit les deux, la
                  // feuille de style choisit.
                  "--word-delay": `${delay + index * step}ms`,
                  "--word-i": index,
                } as CSSProperties
              }
            >
              {word.text}
            </span>
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}
