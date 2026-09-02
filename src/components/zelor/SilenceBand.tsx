import { Reveal } from "./Reveal";

/**
 * ————— La bande de silence —————
 *
 * Un tiers d'écran, une phrase, rien d'autre.
 *
 * C'est la pièce qui donne son amplitude au reste. Sur la référence, ces
 * bandes de 0,32 écran s'intercalent entre des sections de trois et quatre
 * écrans : le rapport entre la plus longue et la plus courte dépasse seize.
 * Sans elles, toutes les sections se ressemblent et la page devient une liste.
 *
 * C'est aussi le seul endroit où le très grand corps apparaît. Il frappe
 * parce qu'il arrive après du vide, jamais parce qu'il est grand.
 */
export function SilenceBand({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <Reveal as="section" className="silence-track-z" {...(id ? { "aria-labelledby": id } : {})}>
      <h2 className="silence-line-z" {...(id ? { id } : {})}>
        {children}
      </h2>
    </Reveal>
  );
}
