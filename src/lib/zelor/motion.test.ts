import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync("src/styles.css", "utf8");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : /\.tsx?$/.test(full) ? [full] : [];
  });
}

const sourceFiles = [...walk("src/components"), ...walk("src/routes")].filter(
  (f) => !f.endsWith(".test.ts") && !f.endsWith("routeTree.gen.ts"),
);

describe("système de mouvement ZELOR", () => {
  it("centralise les primitives critiques", () => {
    for (const utility of [
      "@utility tactile-z",
      "@utility press-z",
      "@utility utility-z",
      "@utility utility-icon-z",
      "@utility discover-bar-z",
      "@utility focal-list",
      "@utility seam-z",
      "@utility progress-z",
      "@utility reveal-z",
    ]) {
      expect(css, `${utility} manquant`).toContain(utility);
    }
  });

  it("respecte la logique boomerang : chaque entrée a sa sortie", () => {
    for (const [enter, exit] of [
      ["@utility unfold-z", "@utility unfold-out-z"],
      ["@utility panel-in", "@utility panel-out"],
      ["@utility overlay-in", "@utility overlay-out"],
    ]) {
      expect(css).toContain(enter);
      expect(css).toContain(exit);
    }
  });

  it("n'utilise plus transform dans les primitives tactiles", () => {
    const block = css.slice(css.indexOf("@utility tactile-z"), css.indexOf("@utility seam-z"));
    expect(block).not.toMatch(/\btransform:/);
  });

  it("n'écrit aucune courbe ni durée en dur dans les composants", () => {
    const offenders = sourceFiles.filter((file) => {
      const src = readFileSync(file, "utf8");
      return /cubic-bezier\(/.test(src) || /duration-\[\d+m?s\]/.test(src);
    });
    expect(offenders).toEqual([]);
  });

  it("header et recherche partagent une source de matière unique", () => {
    const block = css.slice(
      css.indexOf("@utility surface-navy"),
      css.indexOf("@utility surface-navy") + 600,
    );
    expect(block, "surface-navy doit réutiliser le token de fond").toContain(
      "var(--surface-navy-bg)",
    );
    expect(block, "surface-navy doit réutiliser le token de voile").toContain(
      "var(--surface-navy-veil)",
    );
    // La recherche ne peint plus aucune matière : elle s'ouvre dans le header.
    expect(css).not.toContain("@utility surface-search");
  });

  it("garde une seule nuit, pilotée par la classe posée sur <html>", () => {
    expect(css).toContain(":root.dark {");
    const night = css.slice(css.indexOf(":root.dark {"));
    expect(night).toContain("--background:");
    expect(night).toContain("--foreground:");
  });

  it("centralise les easings boomerang et respiration", () => {
    expect(css).toContain("--ease-back:");
    expect(css).toContain("--ease-breathe:");
    expect(css).toContain("--ease-glide:");
    const progress = css.slice(
      css.indexOf("@utility progress-z"),
      css.indexOf("@keyframes zelor-progress-drift"),
    );
    expect(progress).toContain("width var(--dur-3) var(--ease-back)");
    // La lumière décorative fait un vrai aller-retour : jamais de saut.
    expect(progress).toContain("infinite alternate");
    expect(css).not.toContain("zelor-progress-sheen");
  });

  it("le menu téléphone n'a qu'une seule chorégraphie, sans reflow", () => {
    const focal = css.slice(
      css.indexOf("@utility focal-list"),
      css.indexOf("@utility media-frame"),
    );
    // Aucune propriété de layout animée dans le menu.
    for (const forbidden of ["letter-spacing ", "padding", "margin", "height "]) {
      expect(focal, `${forbidden} ne doit pas être animé`).not.toContain(forbidden);
    }
    expect(focal).toContain("var(--dur-menu) var(--ease-glide)");
    expect(focal).not.toContain("transition: all");

    const row = css.slice(
      css.indexOf("@utility menu-row {"),
      css.indexOf("@utility menu-row-inline"),
    );
    // La capsule ne respire plus en padding : plus aucun reflow au contact.
    expect(row).not.toContain("padding-inline var(");
    expect(row).toContain("var(--dur-menu) var(--ease-glide)");
    // Aucun survol fantôme sur téléphone.
    expect(row).toContain("(hover: hover) and (pointer: fine)");
  });

  it("factorise la surface marine dans un composant unique", () => {
    const header = readFileSync("src/components/zelor/SiteHeader.tsx", "utf8");
    expect(header).toContain("NavySurface");
    expect(header).not.toContain("surface-search");
    expect(header).not.toContain("surface-navy");
  });
});

/**
 * Garde-fous permanents — voir QUALITY_GUARDRAILS.md.
 * Chaque assertion correspond à une régression réellement constatée.
 */
describe("garde-fous ZELOR", () => {
  it("le fondu de thème n'atteint jamais les entrées focales", () => {
    const fade = css.slice(css.indexOf("var(--theme-fade") - 1200, css.indexOf("var(--theme-fade"));
    expect(fade, "la règle de fondu doit exclure [data-focal]").toContain("[data-focal]");
    expect(fade).toContain(":not(");
  });

  it("menu et lumière partagent une seule famille de mouvement", () => {
    expect(css).toContain("--dur-menu:");
    expect(css).toContain("--ease-glide:");
    for (const utility of ["@utility menu-row {", "@utility focal-list"]) {
      const block = css.slice(css.indexOf(utility), css.indexOf(utility) + 1400);
      expect(block, `${utility} doit utiliser la durée partagée`).toContain("var(--dur-menu)");
      expect(block, `${utility} doit utiliser la courbe partagée`).toContain("var(--ease-glide)");
    }
  });

  it("le filet doré garde ses trois couches et n'est jamais tronqué", () => {
    expect(css).toContain("@utility progress-track-z");
    const bar = css.slice(
      css.indexOf("@utility progress-z"),
      css.indexOf("@keyframes zelor-progress-drift"),
    );
    // Piste, progression réelle, lumière voyageuse, tête d'éclat.
    expect(bar).toContain("&::before");
    expect(bar).toContain("&::after");
    expect(bar).toContain("overflow: visible");
    expect(bar).not.toMatch(/^\s*overflow: hidden/m);
    expect(bar).toContain("infinite alternate");
    // La progression réelle reste portée par la largeur, jamais par une animation.
    expect(bar).toContain("width var(--dur-3)");
    const reduced = css.slice(css.lastIndexOf("@media (prefers-reduced-motion: reduce)"));
    expect(css).toContain(".progress-z::before");
    expect(reduced.length).toBeGreaterThan(0);
  });
});
