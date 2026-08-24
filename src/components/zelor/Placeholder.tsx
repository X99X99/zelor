import type { ReactNode } from "react";

/** Bandeau signalant un contenu provisoire à valider avant publication. */
export function DraftNote({
  children,
  label = "À valider",
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-l-2 border-draft-border bg-draft/60 px-3 py-2 text-sm text-draft-foreground">
      <span className="eyebrow text-draft-foreground">{label}</span>
      <span>{children}</span>
    </p>
  );
}

/** Marqueur inline pour une donnée manquante. */
export function Missing({ children }: { children: ReactNode }) {
  return (
    <span className="bg-draft px-1.5 py-0.5 font-mono text-[0.8em] tracking-tight text-draft-foreground">
      {children}
    </span>
  );
}

const toneClass: Record<string, string> = {
  sand: "bg-sand",
  stone: "bg-stone",
  forest: "bg-forest",
  ink: "bg-primary",
};

const toneText: Record<string, string> = {
  sand: "text-foreground/70",
  stone: "text-foreground/70",
  forest: "text-forest-foreground/80",
  ink: "text-primary-foreground/80",
};

/**
 * Emplacement visuel produit. Remplace une photo réelle non fournie :
 * on n'affiche jamais une image d'illustration comme si c'était le produit.
 */
export function ImageSlot({
  tone = "sand",
  ratio = "aspect-[4/5]",
  caption = "Visuel produit à fournir",
}: {
  tone?: string;
  ratio?: string;
  caption?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`Emplacement d'image : ${caption}`}
      className={`${ratio} ${toneClass[tone] ?? "bg-sand"} flex items-center justify-center overflow-hidden`}
    >
      <span
        className={`eyebrow ${toneText[tone] ?? "text-foreground/70"} px-4 text-center`}
      >
        {caption}
      </span>
    </div>
  );
}
