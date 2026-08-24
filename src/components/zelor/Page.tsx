import type { ReactNode } from "react";

import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

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
      <Breadcrumbs items={crumbs} />
      <header className="container-z pt-10 pb-8 md:pt-16">
        <h1 className="max-w-3xl font-display text-4xl md:text-6xl">{title}</h1>
        {intro && (
          <p className="mt-5 max-w-2xl text-base text-muted-foreground">
            {intro}
          </p>
        )}
      </header>
      <div className="container-z grid gap-12 pb-16 lg:grid-cols-[minmax(0,42rem)_1fr] lg:gap-20">
        <div className="prose-zelor space-y-6">{children}</div>
        {aside && <aside className="space-y-6 text-sm">{aside}</aside>}
      </div>
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
