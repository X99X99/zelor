import { Link } from "@tanstack/react-router";

import { PLACEHOLDER, type DemoProduct } from "@/lib/zelor/content";
import { ImageSlot } from "./Placeholder";

export function ProductCard({ product }: { product: DemoProduct }) {
  return (
    <article className="group">
      <Link
        to="/produit/$slug"
        params={{ slug: product.slug }}
        className="block"
      >
        <div className="overflow-hidden">
          <div className="transition-transform duration-700 group-hover:scale-[1.03]">
            <ImageSlot tone={product.tone} caption="Visuel produit à fournir" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-3">
          <h3 className="font-sans text-sm font-medium">{product.name}</h3>
          {product.isNew && <span className="eyebrow">Nouveauté</span>}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{product.line}</p>
        <p className="mt-2 text-sm">
          <span className="bg-draft px-1.5 py-0.5 font-mono text-xs text-draft-foreground">
            {PLACEHOLDER.price} {PLACEHOLDER.currency}
          </span>
        </p>
      </Link>
    </article>
  );
}
