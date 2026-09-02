import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { useCart } from "@/lib/zelor/cart";
import { formatMoney, productsQueryOptions } from "@/lib/shopify/client";
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
  const { lines, setQuantity, remove, ready, busy, subtotal, currencyCode, checkoutUrl } =
    useCart();
  const { data: catalog } = useQuery(productsQueryOptions(8));

  const suggestion = (catalog ?? []).find(
    (product) => !lines.some((line) => line.handle === product.node.handle),
  );
  const suggestionImage = suggestion?.node.images.edges[0]?.node;

  const canCheckout = ready && !busy && lines.length > 0 && checkoutUrl !== null;

  // Le paiement se déroule sur le domaine Shopify : une navigation complète,
  // jamais un routage interne, sinon la session de caisse n'est pas créée.
  const goToCheckout = () => {
    if (!checkoutUrl) return;
    window.location.href = checkoutUrl;
  };

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
              <li key={line.variantId} className="flex gap-4 py-5">
                <div className="w-20 shrink-0">
                  {line.image ? (
                    <img
                      src={line.image.url}
                      alt={line.image.alt}
                      loading="lazy"
                      className="aspect-4/5 w-full rounded-[var(--radius-media)] object-cover"
                    />
                  ) : (
                    <ImageSlot ratio="aspect-4/5" caption={line.name} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    to="/produit/$slug"
                    params={{ slug: line.handle }}
                    className="link-underline text-sm"
                  >
                    {line.name}
                  </Link>
                  {line.variant && (
                    <p className="mt-1 text-xs text-muted-foreground">{line.variant}</p>
                  )}
                  <p className="mt-2 text-sm text-muted-foreground">{formatMoney(line.price)}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="stepper-z">
                      <button
                        type="button"
                        aria-label={`Diminuer la quantité de ${line.name}`}
                        disabled={busy}
                        onClick={() => void setQuantity(line.variantId, line.quantity - 1)}
                        className="size-10 disabled:opacity-50"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm tabular-nums">{line.quantity}</span>
                      <button
                        type="button"
                        aria-label={`Augmenter la quantité de ${line.name}`}
                        disabled={busy}
                        onClick={() => void setQuantity(line.variantId, line.quantity + 1)}
                        className="size-10 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void remove(line.variantId)}
                      className="link-underline press-z text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
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
                <span className="tabular-nums" data-testid="cart-subtotal">
                  {formatMoney({ amount: String(subtotal), currencyCode })}
                </span>
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
            <button
              type="button"
              data-testid="checkout"
              disabled={!canCheckout}
              onClick={goToCheckout}
              className="btn-lux w-full disabled:opacity-60"
            >
              {busy ? "Mise à jour…" : "Passer commande"}
            </button>
            <p className="text-xs text-muted-foreground">
              Le paiement se déroule sur la caisse sécurisée de la boutique. Retour possible dans le
              délai légal. Moyens de paiement acceptés :{" "}
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
                  params={{ slug: suggestion.node.handle }}
                  className="press-z mt-3 flex items-center gap-3 rounded-2xl p-2 transition-colors duration-[var(--dur-2)] ease-[var(--ease-lux)] hover:bg-accent/60"
                >
                  <span className="w-16 shrink-0">
                    {suggestionImage ? (
                      <img
                        src={suggestionImage.url}
                        alt={suggestionImage.altText ?? suggestion.node.title}
                        loading="lazy"
                        className="aspect-square w-full rounded-[var(--radius-media)] object-cover"
                      />
                    ) : (
                      <ImageSlot ratio="aspect-square" caption=" " />
                    )}
                  </span>
                  <span className="text-sm">{suggestion.node.title}</span>
                </Link>
              </div>
            )}
          </Reveal>
        </div>
      )}
    </>
  );
}
