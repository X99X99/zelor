import { Reveal } from "./Reveal";

/** Grille vide — aucun produit fictif n'est affiché. */
export function EmptyCatalog({
  title = "No products found",
  body = "Le catalogue Shopify ne contient encore aucune pièce.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <Reveal className="surface-light aura-z rounded-3xl border border-border/70 px-6 py-24 text-center">
      <h2 className="font-display text-2xl">{title}</h2>
      <p className="mt-3 text-sm text-muted-foreground">{body}</p>
    </Reveal>
  );
}
