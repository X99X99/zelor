import type { ReactNode } from "react";

const toneClass: Record<string, string> = {
  sand: "bg-sand",
  stone: "bg-stone",
  forest: "bg-navy",
  ink: "bg-navy-deep",
};

const toneText: Record<string, string> = {
  sand: "text-foreground/40",
  stone: "text-foreground/40",
  forest: "text-navy-foreground/50",
  ink: "text-navy-foreground/50",
};

const toneLight: Record<string, string> = {
  sand: "from-white/45",
  stone: "from-white/35",
  forest: "from-white/12",
  ink: "from-white/10",
};

/**
 * Aplat éditorial tenant lieu de visuel tant que la photographie officielle
 * n'est pas livrée : matière grainée, lumière rasante en haut à gauche,
 * filet intérieur. Jamais un simple carré de couleur.
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
      className={`grain-z ${ratio} ${toneClass[tone] ?? "bg-sand"} relative flex items-center justify-center overflow-hidden rounded-[var(--radius-media)]`}
    >
      {/* Lumière naturelle entrant par le haut à gauche */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-radial-[at_22%_14%] ${toneLight[tone] ?? "from-white/40"} to-transparent to-68%`}
      />
      {/* Ombre portée douce dans l'angle opposé */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-tl from-navy-deep/12 via-transparent to-transparent"
      />
      {/* Filet intérieur : la surface a une arête */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[var(--radius-media)] ring-1 ring-inset ring-navy/8"
      />
      <span
        className={`eyebrow relative ${toneText[tone] ?? "text-foreground/40"} px-4 text-center`}
      >
        {caption}
      </span>
    </div>
  );
}
