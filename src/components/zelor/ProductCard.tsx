import { Link } from "@tanstack/react-router";

import { PRICING, type DemoProduct } from "@/lib/zelor/content";
import { ImageSlot } from "./Placeholder";

export function ProductCard({ product }: { product: DemoProduct }) {
  return (
    <article className="group">
      <Link
        to="/produit/$slug"
        params={{ slug: product.slug }}
        className="block focus-visible:outline-offset-4"
      >
        <div className="lift-z sheen-z relative overflow-hidden rounded-[var(--radius-media)]">
          <div className="transition-[scale] duration-[var(--dur-5)] ease-[var(--ease-lux)] group-hover:scale-[1.04]">
            <ImageSlot tone={product.tone} caption={product.name} />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-navy/0 transition-colors duration-700 group-hover:bg-navy/8"
          />
          <span aria-hidden="true" className="discover-bar-z">
            Découvrir
          </span>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-3">
          <h3 className="font-sans text-sm font-medium">{product.name}</h3>
          {product.isNew && <span className="eyebrow">Nouveauté</span>}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{product.line}</p>
        <p className="mt-2 text-xs tracking-wide text-muted-foreground">
          {PRICING.label}
        </p>
      </Link>
    </article>
  );
}
