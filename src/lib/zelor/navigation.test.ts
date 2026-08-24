import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { isActivePath } from "../../components/zelor/NavLink";

const css = readFileSync("src/styles.css", "utf8");
const navLink = readFileSync("src/components/zelor/NavLink.tsx", "utf8");
const header = readFileSync("src/components/zelor/SiteHeader.tsx", "utf8");
const footer = readFileSync("src/components/zelor/SiteFooter.tsx", "utf8");

describe("logique de page active", () => {
  it("reconnaît la racine sans absorber les autres routes", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/collection", "/")).toBe(false);
  });

  it("reconnaît une route et ses sous-routes", () => {
    expect(isActivePath("/collection", "/collection")).toBe(true);
    expect(isActivePath("/collection/riviera", "/collection")).toBe(true);
    expect(isActivePath("/collections", "/collection")).toBe(false);
  });
});

describe("primitive partagée de retour en haut", () => {
  it("centralise la logique dans NavLink", () => {
    expect(navLink).toContain("export function useSameRouteTop");
    expect(navLink).toContain("export function BrandLink");
    // Aucune navigation, aucune entrée d'historique sur la page active.
    expect(navLink).toContain("event.preventDefault()");
    expect(navLink).toContain("scrollToTop()");
  });

  it("respecte prefers-reduced-motion", () => {
    expect(navLink).toContain("(prefers-reduced-motion: reduce)");
  });

  it("est utilisée par le logo du header et du footer", () => {
    expect(header).toContain("<BrandLink");
    expect(footer).toContain("<BrandLink");
    // Aucun second lien d'accueil concurrent.
    expect(header).not.toMatch(/<Link\s+to="\/"\s/);
    expect(footer).not.toMatch(/<Link\s+to="\/"\s/);
  });
});

describe("capsule de navigation partagée", () => {
  it("header, feuille mobile et footer réutilisent la primitive menu-row", () => {
    expect(navLink).toContain("menu-row menu-row-inline");
    expect(navLink).toContain('sheet: "menu-row"');
    expect(navLink).toContain("data-capsule");
  });

  it("le lien-capsule n'impose aucune géométrie propre", () => {
    expect(css).toContain("&:not(:where([data-capsule], .link-underline))");
  });

  it("les liens de lecture réutilisent la même capsule", () => {
    // `link-underline` n'est qu'un alias : aucune famille graphique parallèle.
    expect(css).toMatch(/@utility link-underline \{\s*@apply menu-row menu-row-inline nav-link-z;/);
  });

  it("le soulignement dérive de la géométrie de la capsule", () => {
    const rule = css.slice(css.indexOf("&:where([data-capsule], .link-underline)::after"));
    expect(rule).toMatch(/inset-inline:\s*var\(--cap-pad\)/);
    expect(rule).toMatch(/bottom:\s*var\(--cap-underline-bottom\)/);
    // La géométrie interne est définie une seule fois, dans menu-row.
    expect(css).toMatch(/--cap-pad:\s*0\.75rem/);
  });
});
