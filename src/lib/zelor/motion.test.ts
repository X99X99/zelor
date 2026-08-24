import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync("src/styles.css", "utf8");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory()
      ? walk(full)
      : /\.tsx?$/.test(full)
        ? [full]
        : [];
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
    const block = css.slice(
      css.indexOf("@utility tactile-z"),
      css.indexOf("@utility seam-z"),
    );
    expect(block).not.toMatch(/\btransform:/);
  });

  it("n'écrit aucune courbe ni durée en dur dans les composants", () => {
    const offenders = sourceFiles.filter((file) => {
      const src = readFileSync(file, "utf8");
      return /cubic-bezier\(/.test(src) || /duration-\[\d+m?s\]/.test(src);
    });
    expect(offenders).toEqual([]);
  });

  it("garde la continuité chromatique du header et de la recherche", () => {
    const search = css.slice(css.indexOf("@utility surface-search"));
    expect(search.slice(0, 1200)).toContain("var(--gradient-header)");
    expect(search.slice(0, 1200)).toContain("saturate(135%)");
  });
});
