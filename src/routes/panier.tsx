import { createFileRoute, Link } from "@tanstack/react-router";

import { useCart } from "@/lib/zelor/cart";
import { DEMO_PRODUCTS, PRICING } from "@/lib/zelor/content";
import { Breadcrumbs } from "@/components/zelor/Breadcrumbs";
import { ImageSlot } from "@/components/zelor/Placeholder";
import { Reveal } from "@/components/zelor/Reveal";
import { absoluteUrl } from "@/lib/zelor/site";

export const Route = createFileRoute("/panier")({
  head: () => ({
    meta: [
      { title: "Panier — ZELOR — Maison éditoriale" },
      {
        name: "description",
        content:
          "Votre panier ZELOR. Paiement sécurisé, livraison en France et dans l'Union européenne.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Panier — ZELOR — Maison éditoriale" },
      {
        property: "og:description",
        content: "Votre panier ZELOR, paiement sécurisé.",
      },
      { property: "og:url", content: absoluteUrl("/panier") },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/panier") }],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, setQuantity, remove, ready } = useCart();
  const suggestion = DEMO_PRODUCTS.find((p) => !lines.some((l) => l.slug === p.slug));

  return (
    <>
      <Breadcrumbs items={[{ label: "Panier" }]} />
      <Reveal as="header" className="container-z pt-10 pb-8">
        <h1 className="font-display text-4xl md:text-5xl">Panier</h1>
      </Reveal>

      {!ready ? (
        <div className="container-z pb-24" aria-live="polite">
          <div className="skeleton-lux h-24 rounded-2xl" />
        </div>
      ) : lines.length === 0 ? (
        <div className="container-z pb-24">
          <Reveal className="surface-light aura-z rounded-3xl border border-border/70 px-6 py-24 text-center">
            <h2 className="font-display text-2xl">Votre panier est vide.</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Parcourez la collection pour y ajouter une pièce.
            </p>
            <Link to="/collection" className="btn-lux mt-8">
              Voir la collection
            </Link>
          </Reveal>
        </div>
      ) : (
        <div className="container-z grid gap-12 pb-24 lg:grid-cols-[1fr_22rem]">
          <Reveal as="ul" className="stagger-z divide-y divide-border border-y border-border">
            {lines.map((line) => (
              <li key={`${line.slug}-${line.variant}`} className="flex gap-4 py-5">
                <div className="w-20 shrink-0">
                  <ImageSlot ratio="aspect-4/5" caption={line.name} />
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    to="/produit/$slug"
                    params={{ slug: line.slug }}
                    className="link-underline text-sm font-medium"
                  >
                    {line.name}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">{line.variant}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{PRICING.label}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="stepper-z">
                      <button
                        type="button"
                        aria-label={`Diminuer la quantité de ${line.name}`}
                        onClick={() => setQuantity(line.slug, line.variant, line.quantity - 1)}
                        className="size-10"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm tabular-nums">{line.quantity}</span>
                      <button
                        type="button"
                        aria-label={`Augmenter la quantité de ${line.name}`}
                        onClick={() => setQuantity(line.slug, line.variant, line.quantity + 1)}
                        className="size-10"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(line.slug, line.variant)}
                      className="link-underline press-z text-xs text-muted-foreground hover:text-foreground"
                    >
                      Retirer
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </Reveal>

          <Reveal as="aside" delay={120} className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="surface-panel relief-z space-y-2 p-6">
              <div className="flex justify-between text-sm">
                <span>Sous-total</span>
                <span className="text-muted-foreground">{PRICING.short}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Livraison</span>
                <span>Calculée au paiement</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Taxes</span>
                <span>Incluses pour l'Union européenne</span>
              </div>
            </div>
            <button type="button" disabled className="btn-lux w-full disabled:opacity-60">
              Passer commande
            </button>
            <p className="text-xs text-muted-foreground">
              La commande ouvrira avec la boutique. Retour possible dans le délai légal. Moyens de
              paiement acceptés :{" "}
              <Link to="/paiements" className="link-underline">
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
                  className="press-z mt-3 flex items-center gap-3 rounded-2xl p-2 transition-colors duration-[var(--dur-2)] ease-[var(--ease-lux)] hover:bg-accent/60"
                >
                  <span className="w-16 shrink-0">
                    <ImageSlot tone={suggestion.tone} ratio="aspect-square" caption=" " />
                  </span>
                  <span className="text-sm">{suggestion.name}</span>
                </Link>
              </div>
            )}
          </Reveal>
        </div>
      )}
    </>
  );
}
