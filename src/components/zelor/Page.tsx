import type { ReactNode } from "react";

import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { LineReveal } from "./LineReveal";
import { Reveal } from "./Reveal";

/** Gabarit de page éditoriale : fil d'Ariane, H1 unique, contenu en colonne. */
export function PageShell({
  title,
  intro,
  crumbs,
  children,
  aside,
}: {
  title: string;
  intro?: string;
  crumbs: Crumb[];
  children: ReactNode;
  aside?: ReactNode;
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
        <div className="prose-zelor space-y-14">{children}</div>
        {aside && <aside className="space-y-6 text-sm">{aside}</aside>}
      </Reveal>
    </>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
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
