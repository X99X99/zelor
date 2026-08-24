import type { ElementType, ReactNode } from "react";

/**
 * Matière marine unique du site.
 *
 * Le header et le panneau de recherche ne sont pas « deux surfaces
 * ressemblantes » : ils sont **la même surface**, rendue par ce composant.
 * Fond, voile, teinte et grammaire d'apparition / de retrait proviennent d'ici
 * et de nulle part ailleurs — c'est ce qui empêche tout écart de revenir.
 */
export function NavySurface({
  as,
  animate = false,
  closing = false,
  material = true,
  className = "",
  children,
  ...rest
}: {
  as?: ElementType;
  /** Applique la grammaire d'apparition partagée (unfold-z / unfold-out-z). */
  animate?: boolean;
  closing?: boolean;
  /**
   * `false` lorsque la zone s'ouvre **à l'intérieur** d'une surface marine
   * déjà peinte (la recherche dans le header) : elle hérite alors du même
   * volume de matière au lieu d'en repeindre un second par-dessus.
   */
  material?: boolean;
  className?: string;
  children: ReactNode;
} & Record<string, unknown>) {
  const Tag = (as ?? "div") as ElementType;
  const motion = animate ? (closing ? "unfold-out-z" : "unfold-z") : "";
  const surface = material ? "surface-navy grain-z" : "text-navy-foreground";
  return (
    <Tag className={`${surface} ${motion} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}

/** Durée exacte du retrait partagé, alignée sur --dur-4. */
export const NAVY_SURFACE_EXIT_MS = 900;
