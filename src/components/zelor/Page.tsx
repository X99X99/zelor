import type { ReactNode } from "react";

import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
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
          <h1 className="slide-up-lux max-w-3xl font-display text-4xl md:text-6xl">
            {title}
          </h1>
          {intro && (
            <p
              className="slide-up-lux mt-5 max-w-2xl text-base text-muted-foreground"
              style={{ animationDelay: "90ms" }}
            >
              {intro}
            </p>
          )}
        </header>
      </div>
      <Reveal className="container-z grid gap-12 pt-14 pb-20 lg:grid-cols-[minmax(0,42rem)_1fr] lg:gap-20">
        <div className="prose-zelor space-y-6">{children}</div>
        {aside && <aside className="space-y-6 text-sm">{aside}</aside>}
      </Reveal>
    </>
  );
}


export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="space-y-3 text-base text-foreground/85">{children}</div>
    </section>
  );
}
