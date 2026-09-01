import type { ReactNode } from "react";

import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { Reveal } from "./Reveal";
import { SplitReveal } from "./SplitReveal";

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
          {/* Toutes les pages éditoriales passent par ce gabarit : c'est le
              seul endroit où l'ouverture mot à mot devait être posée pour
              valoir sur l'ensemble du site. */}
          <SplitReveal
            as="h1"
            text={title}
            className="max-w-3xl font-display text-4xl leading-[1.05] md:text-6xl"
          />
          {intro && (
            <p
              className="prose-z slide-up-lux mt-6 max-w-2xl text-muted-foreground"
              style={{ animationDelay: "90ms" }}
            >
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
      {/* Chaque section observe le défilement pour son propre compte : sinon
          tous les titres de la page se lèveraient au même instant, ce qui est
          exactement l'effet que ce geste doit éviter. */}
      <SplitReveal text={title} className="font-display text-2xl leading-[1.15]" />
      <div className="space-y-3 text-base text-foreground/85">{children}</div>
    </section>
  );
}
