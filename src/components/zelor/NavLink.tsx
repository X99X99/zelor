import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

/**
 * Primitive de lien de navigation ZELOR — header et footer.
 *
 * Un vrai lien éditorial (jamais un bouton) doté de la même qualité de
 * réponse que les contrôles premium du site : filet `link-underline`,
 * état actif signalé par `aria-current`, focus visible, réponse tactile.
 * Lorsque le lien pointe vers la page déjà consultée, il ne navigue pas :
 * il fait remonter la lecture en haut, sans toucher l'URL ni l'historique.
 */
export function scrollToTop() {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: (reduced ? "auto" : "smooth") as ScrollBehavior,
  });
}

/** Vrai si `pathname` correspond à la route `to` (elle-même ou une sous-route). */
export function isActivePath(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function NavLink({
  to,
  children,
  className = "",
  activeClassName = "",
  onNavigate,
  variant = "header",
  ...rest
}: {
  to: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  onNavigate?: () => void;
  variant?: "header" | "footer" | "sheet";
} & Record<string, unknown>) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = isActivePath(pathname, to);

  return (
    <Link
      to={to}
      aria-current={active ? "page" : undefined}
      data-variant={variant}
      className={`nav-link-z ${className} ${active ? activeClassName : ""}`.trim()}
      onClick={(event) => {
        onNavigate?.();
        if (!active) return;
        // Même page : aucune navigation, aucun ajout d'historique.
        if (
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          (event as unknown as MouseEvent).button > 0
        )
          return;
        event.preventDefault();
        scrollToTop();
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
