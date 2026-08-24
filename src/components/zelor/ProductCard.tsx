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
        <div className="lift-z sheen-z relative overflow-hidden">
          <div className="transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.04]">
            <ImageSlot tone={product.tone} caption={product.name} />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-navy/0 transition-colors duration-700 group-hover:bg-navy/8"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-navy/92 py-3 text-center text-[0.6875rem] tracking-[0.2em] text-navy-foreground uppercase backdrop-blur-sm transition-transform duration-600 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:translate-y-0"
          >
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
