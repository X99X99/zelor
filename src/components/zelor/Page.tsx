import type { ReactNode } from "react";

import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { LineReveal } from "./LineReveal";
import { Reveal } from "./Reveal";

/**
 * Gabarit de page : fil d'Ariane, H1 unique, contenu en colonne.
 *
 * Quinze routes passent par ici, et seulement quatre sont éditoriales —
 * univers, journal, à propos, qualité. Les onze autres sont fonctionnelles ou
 * juridiques, et « compte » en fait partie. C'est pourquoi la composition
 * décalée est une option et jamais un défaut : la rendre systématique
 * restructurerait la page compte, les CGV et les mentions légales, dont la
 * régularité n'est pas un défaut de composition mais une qualité de lecture.
 */
export function PageShell({
  title,
  intro,
  crumbs,
  children,
  aside,
  editorial = false,
}: {
  title: string;
  intro?: string;
  crumbs: Crumb[];
  children: ReactNode;
  aside?: ReactNode;
  /** Composition décalée, réservée aux pages de maison. */
  editorial?: boolean;
}) {
  return (
    <>
      <div className="surface-light hairline-z border-t-0">
        <Breadcrumbs items={crumbs} />
        <header className="container-z pt-10 pb-12 md:pt-16">
          {/* Quinze pages passent par ce titre. Il se relevait mot à mot, ce
              qui convient à un titre de maison et pas à « Conditions générales
              de vente » : le masque de fenêtre dit la même chose sans faire
              attendre, et laisse le texte en un seul morceau. */}
          <LineReveal as="h1" className="display-2-z max-w-4xl">
            {title}
          </LineReveal>
          {intro && (
            <p className="lead-z slide-up-lux mt-8 max-w-2xl" style={{ animationDelay: "90ms" }}>
              {intro}
            </p>
          )}
        </header>
      </div>
      <Reveal className="container-z grid gap-12 pt-14 pb-20 lg:grid-cols-[minmax(0,42rem)_1fr] lg:gap-20">
        <div className={`prose-zelor ${editorial ? "space-y-24" : "space-y-14"}`}>{children}</div>
        {/* L'image accompagne la lecture au lieu de la précéder : collante
            seulement là où il y a deux colonnes. */}
        {aside && (
          <aside className={`space-y-6 text-sm${editorial ? " aside-sticky-z" : ""}`}>
            {aside}
          </aside>
        )}
      </Reveal>
    </>
  );
}

export function Section({
  title,
  children,
  offset = false,
}: {
  title: string;
  children: ReactNode;
  /** Décale la section vers la droite au-delà de 1024 px. Une sur deux. */
  offset?: boolean;
}) {
  return (
    <section className={`space-y-4${offset ? " section-offset-z" : ""}`}>
      {/* Cinquante-cinq intertitres passent par ici, dont ceux des CGV et des
          mentions légales. Ils étaient en capitales et découpés mot à mot :
          deux gestes de titre de marque appliqués à de la lecture juridique.
          Bas-de-casse, un seul nœud de texte, une seule montée.

          Chaque section observe le défilement pour son propre compte : sinon
          tous les titres de la page se lèveraient au même instant, ce qui est
          exactement l'effet que ce geste doit éviter. */}
      <LineReveal className="font-display text-2xl">{title}</LineReveal>
      <div className="space-y-3 text-base text-foreground/85">{children}</div>
    </section>
  );
}
