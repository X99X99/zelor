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

/**
 * Logique partagée « lien vers la page déjà active ».
 * Header, menu mobile, footer et logo passent tous par ici : aucun de ces
 * points d'entrée ne peut diverger dans le futur.
 */
export function useSameRouteTop(to: string) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = isActivePath(pathname, to);

  const onClick = (event: {
    metaKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
    button?: number;
    preventDefault: () => void;
  }) => {
    if (!active) return;
    // Clic modifié ou secondaire : on laisse le navigateur faire son travail.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || (event.button ?? 0) > 0)
      return;
    // Même page : aucune navigation, aucun ajout d'historique.
    event.preventDefault();
    scrollToTop();
  };

  return { active, onClick };
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
  const { active, onClick } = useSameRouteTop(to);

  return (
    <Link
      to={to}
      aria-current={active ? "page" : undefined}
      data-variant={variant}
      className={`nav-link-z ${className} ${active ? activeClassName : ""}`.trim()}
      onClick={(event) => {
        onNavigate?.();
        onClick(event as unknown as MouseEvent & { preventDefault: () => void });
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}

/**
 * Logo ZELOR — lien d'accueil partout, retour en haut lorsqu'on est déjà
 * sur la homepage. Même primitive que les liens de navigation.
 */
export function BrandLink({
  children,
  className = "",
  onNavigate,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
} & Record<string, unknown>) {
  const { active, onClick } = useSameRouteTop("/");

  return (
    <Link
      to="/"
      aria-label="ZELOR — accueil"
      aria-current={active ? "page" : undefined}
      data-brand-home={active ? "current" : undefined}
      className={className}
      onClick={(event) => {
        onNavigate?.();
        onClick(event as unknown as MouseEvent & { preventDefault: () => void });
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
