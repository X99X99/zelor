import { createFileRoute, Link } from "@tanstack/react-router";

import { useCart } from "@/lib/zelor/cart";
import { DEMO_PRODUCTS, PLACEHOLDER } from "@/lib/zelor/content";
import { Breadcrumbs } from "@/components/zelor/Breadcrumbs";
import { DraftNote, ImageSlot, Missing } from "@/components/zelor/Placeholder";

export const Route = createFileRoute("/panier")({
  head: () => ({
    meta: [
      { title: "Panier — ZELOR" },
      {
        name: "description",
        content:
          "Votre panier ZELOR. Le paiement est traité par Shopify Checkout.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Panier — ZELOR" },
      {
        property: "og:description",
        content: "Votre panier ZELOR, paiement sécurisé par Shopify Checkout.",
      },
      { property: "og:url", content: "/panier" },
    ],
    links: [{ rel: "canonical", href: "/panier" }],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, setQuantity, remove, ready } = useCart();
  const suggestion = DEMO_PRODUCTS.find(
    (p) => !lines.some((l) => l.slug === p.slug),
  );

  return (
    <>
      <Breadcrumbs items={[{ label: "Panier" }]} />
      <header className="container-z pt-10 pb-8">
        <h1 className="font-display text-4xl md:text-5xl">Panier</h1>
      </header>

      {!ready ? (
        <div className="container-z pb-24" aria-live="polite">
          <div className="h-24 animate-pulse bg-muted" />
        </div>
      ) : lines.length === 0 ? (
        <div className="container-z pb-24">
          <div className="border border-dashed border-border px-6 py-20 text-center">
            <h2 className="font-display text-2xl">Votre panier est vide.</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Parcourez la collection pour y ajouter une pièce.
            </p>
            <Link
              to="/collection"
              className="mt-8 inline-flex min-h-12 items-center bg-primary px-6 text-sm tracking-[0.14em] text-primary-foreground uppercase"
            >
              Voir la collection
            </Link>
          </div>
        </div>
      ) : (
        <div className="container-z grid gap-12 pb-24 lg:grid-cols-[1fr_22rem]">
          <ul className="divide-y divide-border border-y border-border">
            {lines.map((line) => (
              <li
                key={`${line.slug}-${line.variant}`}
                className="flex gap-4 py-5"
              >
                <div className="w-20 shrink-0">
                  <ImageSlot ratio="aspect-4/5" caption="Visuel" />
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    to="/produit/$slug"
                    params={{ slug: line.slug }}
                    className="text-sm font-medium underline-offset-4 hover:underline"
                  >
                    {line.name}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {line.variant}
                  </p>
                  <p className="mt-2 text-sm">
                    <Missing>{PLACEHOLDER.price}</Missing>
                  </p>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex items-center border border-input">
                      <button
                        type="button"
                        aria-label={`Diminuer la quantité de ${line.name}`}
                        onClick={() =>
                          setQuantity(line.slug, line.variant, line.quantity - 1)
                        }
                        className="size-10"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm tabular-nums">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Augmenter la quantité de ${line.name}`}
                        onClick={() =>
                          setQuantity(line.slug, line.variant, line.quantity + 1)
                        }
                        className="size-10"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(line.slug, line.variant)}
                      className="text-xs text-muted-foreground underline underline-offset-4"
                    >
                      Retirer
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rule-z pt-5">
              <div className="flex justify-between text-sm">
                <span>Sous-total</span>
                <Missing>{PLACEHOLDER.price}</Missing>
              </div>
              <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                <span>Livraison</span>
                <span>Calculée au paiement</span>
              </div>
              <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                <span>Taxes</span>
                <span>Selon la configuration Shopify</span>
              </div>
            </div>
            <button
              type="button"
              disabled
              className="min-h-13 w-full bg-primary px-6 text-sm tracking-[0.14em] text-primary-foreground uppercase disabled:opacity-60"
            >
              Passer commande
            </button>
            <DraftNote label="Shopify">
              Le paiement sera assuré par Shopify Checkout. Aucun paiement n'est
              simulé ici et aucune donnée bancaire n'est collectée.
            </DraftNote>
            <p className="text-xs text-muted-foreground">
              Retours possibles sous <Missing>[DÉLAI À RENSEIGNER]</Missing>.
              Moyens de paiement acceptés :{" "}
              <Link to="/paiements" className="underline underline-offset-4">
                voir la page dédiée
              </Link>
              .
            </p>
            {suggestion && (
              <div className="rule-z pt-5">
                <p className="eyebrow">Pour compléter</p>
                <Link
                  to="/produit/$slug"
                  params={{ slug: suggestion.slug }}
                  className="mt-3 flex items-center gap-3"
                >
                  <span className="w-16 shrink-0">
                    <ImageSlot
                      tone={suggestion.tone}
                      ratio="aspect-square"
                      caption=" "
                    />
                  </span>
                  <span className="text-sm underline-offset-4 hover:underline">
                    {suggestion.name}
                  </span>
                </Link>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
