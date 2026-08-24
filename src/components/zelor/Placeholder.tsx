import type { ReactNode } from "react";

const toneClass: Record<string, string> = {
  sand: "bg-sand",
  stone: "bg-stone",
  forest: "bg-navy",
  ink: "bg-navy-deep",
};

const toneText: Record<string, string> = {
  sand: "text-foreground/45",
  stone: "text-foreground/45",
  forest: "text-navy-foreground/55",
  ink: "text-navy-foreground/55",
};

/**
 * Aplat éditorial tenant lieu de visuel tant que la photographie officielle
 * n'est pas livrée. Aucune image d'illustration n'est présentée comme un produit.
 */
export function ImageSlot({
  tone = "sand",
  ratio = "aspect-[4/5]",
  caption = "ZELOR",
}: {
  tone?: string;
  ratio?: string;
  caption?: ReactNode;
}) {
  return (
    <div
      role="img"
      aria-label="Visuel ZELOR"
      className={`${ratio} ${toneClass[tone] ?? "bg-sand"} flex items-center justify-center overflow-hidden`}
    >
      <span
        className={`eyebrow ${toneText[tone] ?? "text-foreground/45"} px-4 text-center`}
      >
        {caption}
      </span>
    </div>
  );
}
