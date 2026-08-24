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

describe("contrat visuel du menu mobile", () => {
  it("le lien en feuille n'impose aucune géométrie propre", () => {
    expect(css).toContain('&:not([data-variant="sheet"])');
  });

  it("le soulignement de la feuille reste contenu dans la capsule", () => {
    const rule = css.slice(css.indexOf('&[data-variant="sheet"]::after'));
    expect(rule).toMatch(/inset-inline:\s*0\.9rem/);
    expect(rule).toMatch(/bottom:\s*0\.55rem/);
  });
});
