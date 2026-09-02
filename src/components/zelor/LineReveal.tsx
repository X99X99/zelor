import { type ElementType, type ReactNode } from "react";

import { Reveal } from "./Reveal";

/**
 * Titre révélé derrière une fenêtre qui le rogne.
 *
 * Remplace le découpage mot à mot partout où celui-ci ne se justifiait pas.
 * Il était branché dans le gabarit des pages éditoriales, donc appliqué à
 * quinze titres de page et cinquante-cinq intertitres — y compris ceux des
 * CGV et des mentions légales. Un intertitre juridique qui se compose mot à
 * mot fait attendre pour rien, et il arrive au lecteur d'écran en morceaux.
 *
 * Ici le texte reste un seul nœud : il se lit d'un trait, et il se relève
 * d'un bloc.
 *
 * Ce que le masque fait exactement — la nuance vaut d'être dite plutôt que
 * maquillée : il porte sur le bloc, pas sur chaque ligne mesurée. Sur un
 * titre d'une seule ligne, ce qui est le cas de la quasi-totalité, c'est
 * rigoureusement un masque de ligne. Au-delà, c'est une montée d'ensemble.
 * Mesurer les vraies lignes demanderait `getClientRects`, qui casse au
 * redimensionnement et n'existe pas au rendu serveur.
 *
 * Le voile de `reveal-z` est neutralisé par `split-host-z` : la fenêtre est
 * le geste, un fondu par-dessus en ferait deux.
 */
export function LineReveal({
  children,
  as: Tag = "h2",
  className = "",
  ...rest
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <Reveal as={Tag} className={`split-host-z line-mask-z ${className}`} {...rest}>
      <span className="line-mask-inner-z">{children}</span>
    </Reveal>
  );
}
