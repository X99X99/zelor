import { expect, test } from "@playwright/test";

import { openPage } from "./fixtures";

test.describe("parcours critiques", () => {
  test("le lien de la page active fait remonter sans changer l'URL", async ({ page, isMobile }) => {
    test.skip(!!isMobile, "navigation principale visible sur desktop");
    await openPage(page, "/collection");
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(150);
    const link = page.locator('header nav a[aria-current="page"]').first();
    await expect(link).toBeVisible();
    const historyBefore = await page.evaluate(() => history.length);
    await link.click();
    await page.waitForTimeout(400);
    expect(await page.evaluate(() => window.scrollY)).toBeLessThan(40);
    expect(page.url()).toContain("/collection");
    expect(await page.evaluate(() => history.length)).toBe(historyBefore);
  });

  test("un lien vers une autre page navigue normalement", async ({ page }) => {
    await openPage(page, "/collection");
    await page.locator('footer a[href="/aide"]').first().click();
    await expect(page).toHaveURL(/\/aide$/);
  });

  test("la recherche s'ouvre, se soumet et mène à la collection", async ({ page }) => {
    await openPage(page, "/");
    await page.getByRole("button", { name: "Rechercher" }).first().click();
    await page.locator("#site-search").fill("riviera");
    await page.locator("#site-search").press("Enter");
    await expect(page).toHaveURL(/\/collection\?q=riviera/);
  });

  test("le thème persiste entre deux visites", async ({ page }) => {
    await openPage(page, "/", "light");
    await page.getByRole("button", { name: "Apparence" }).click();
    await page.getByRole("option", { name: "Profondeur marine" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("le réglage « Système » est accessible et rend la main à l'appareil", async ({ page }) => {
    await openPage(page, "/", "dark");
    await page.emulateMedia({ colorScheme: "light" });
    await page.getByRole("button", { name: "Apparence" }).click();
    await page.getByRole("option", { name: "Suivre le système" }).click();
    await expect(page.locator("html")).toHaveClass(/light/);
  });

  test("le menu mobile s'ouvre, navigue et rend le scroll", async ({ page, isMobile }) => {
    test.skip(!isMobile, "menu plein écran réservé au mobile");
    await openPage(page, "/");
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    await page.getByRole("dialog").getByRole("link", { name: "Collection", exact: true }).click();
    await expect(page).toHaveURL(/\/collection$/);
    await expect(page.locator("body")).not.toHaveCSS("position", "fixed");
  });

  test("le panier et le compte restent atteignables", async ({ page }) => {
    await openPage(page, "/");
    await page.locator('header a[href="/panier"]').first().click();
    await expect(page).toHaveURL(/\/panier$/);
  });

  test("aucune erreur de console sur les pages clés", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));
    for (const path of ["/", "/collection", "/panier", "/aide"]) {
      await openPage(page, path);
    }
    expect(errors).toEqual([]);
  });

  test("la navigation clavier atteint le contenu et les liens", async ({ page, isMobile }) => {
    test.skip(!!isMobile, "clavier vérifié sur desktop");
    await openPage(page, "/");
    await page.keyboard.press("Tab");
    await expect(page.locator("a:focus")).toHaveText(/Aller au contenu/);
  });
});

test.describe("retour en haut partagé (logo et liens actifs)", () => {
  test("le logo sur la homepage active remonte sans changer l'URL", async ({ page }) => {
    await openPage(page, "/");
    await page.evaluate(() => window.scrollTo(0, 1400));
    await page.waitForTimeout(150);
    const historyBefore = await page.evaluate(() => history.length);
    await page.locator('header a[aria-label="ZELOR — accueil"]').first().click();
    await page.waitForTimeout(400);
    expect(await page.evaluate(() => window.scrollY)).toBeLessThan(40);
    expect(new URL(page.url()).pathname).toBe("/");
    expect(await page.evaluate(() => history.length)).toBe(historyBefore);
  });

  test("le logo depuis une autre page navigue vers l'accueil", async ({ page }) => {
    await openPage(page, "/collection");
    await page.locator('header a[aria-label="ZELOR — accueil"]').first().click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("le logo du footer suit la même logique", async ({ page }) => {
    await openPage(page, "/");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(200);
    const historyBefore = await page.evaluate(() => history.length);
    await page.locator('footer a[aria-label="ZELOR — accueil"]').first().click();
    await page.waitForTimeout(400);
    expect(await page.evaluate(() => window.scrollY)).toBeLessThan(40);
    expect(await page.evaluate(() => history.length)).toBe(historyBefore);
  });

  test("un lien actif du footer remonte sans nouvelle entrée d'historique", async ({ page }) => {
    await openPage(page, "/aide");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(200);
    const historyBefore = await page.evaluate(() => history.length);
    const link = page.locator('footer a[aria-current="page"]').first();
    await expect(link).toBeVisible();
    await link.click();
    await page.waitForTimeout(400);
    expect(await page.evaluate(() => window.scrollY)).toBeLessThan(40);
    expect(new URL(page.url()).pathname).toBe("/aide");
    expect(await page.evaluate(() => history.length)).toBe(historyBefore);
  });
});

test.describe("menu mobile — contrat de motion", () => {
  test("les entrées-liens partagent la géométrie de « Langue »", async ({ page, isMobile }) => {
    test.skip(!isMobile, "menu plein écran réservé au mobile");
    await openPage(page, "/");
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    const dialog = page.getByRole("dialog");
    const rows = dialog.locator(".menu-row");
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(8);
    const styles = await rows.evaluateAll((els) =>
      els.map((el) => {
        const s = getComputedStyle(el);
        return { display: s.display, transition: s.transitionProperty };
      }),
    );
    const reference = styles[styles.length - 1];
    for (const s of styles) {
      expect(s.display).toBe(reference!.display);
      expect(s.transition).toBe(reference!.transition);
    }
  });

  test("le soulignement reste contenu dans la capsule", async ({ page, isMobile }) => {
    test.skip(!isMobile, "menu plein écran réservé au mobile");
    await openPage(page, "/");
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    const link = page.getByRole("dialog").locator("a.nav-link-z").first();
    const box = await link.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const after = getComputedStyle(el, "::after");
      return {
        width: rect.width,
        left: parseFloat(after.left || "0"),
        right: parseFloat(after.right || "0"),
        bottom: parseFloat(after.bottom || "0"),
        height: parseFloat(after.height || "0"),
      };
    });
    expect(box.left).toBeGreaterThan(4);
    expect(box.right).toBeGreaterThan(4);
    expect(box.bottom).toBeGreaterThan(0);
    expect(box.height).toBeLessThanOrEqual(2);
  });

  test("aucun mouvement vertical parasite au retour de l'état actif", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "menu plein écran réservé au mobile");
    await openPage(page, "/");
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    const link = page.getByRole("dialog").locator("a.nav-link-z").first();
    const before = (await link.boundingBox())!;
    await link.focus();
    await page.waitForTimeout(250);
    await page.getByRole("dialog").locator("a.nav-link-z").nth(1).focus();
    const samples: number[] = [];
    for (let i = 0; i < 8; i++) {
      samples.push((await link.boundingBox())!.y);
      await page.waitForTimeout(60);
    }
    // Retour monotone vers le repos : aucun dépassement de la position finale.
    for (const y of samples) {
      expect(Math.abs(y - before.y)).toBeLessThan(2);
    }
  });
});

/**
 * Contrats de la passe « capsules + thème ».
 * Ces vérifications protègent des régressions constatées à l'écran :
 * astre erroné, libellé ambigu, capsule qui ne suit pas son texte.
 */
test.describe("apparence : soleil en clair, lune en sombre", () => {
  for (const theme of ["light", "dark"] as const) {
    test(`astre correct — choix manuel ${theme}`, async ({ page }) => {
      await openPage(page, "/", theme);
      const button = page.locator('header button[aria-label^="Apparence"]');
      const state = await button.evaluate((el) => {
        const o = (s: string) => getComputedStyle(el.querySelector(s)!).opacity;
        return {
          dark: document.documentElement.classList.contains("dark"),
          sun: o(".theme-icon-day-z"),
          moon: o(".theme-icon-night-z"),
          label: el.getAttribute("aria-label") ?? "",
        };
      });
      expect(state.dark).toBe(theme === "dark");
      expect(state.sun).toBe(theme === "dark" ? "0" : "1");
      expect(state.moon).toBe(theme === "dark" ? "1" : "0");
      // Plus de libellé générique isolé : l'état actif est nommé.
      expect(state.label).not.toBe("Apparence");
      expect(state.label).toContain(theme === "dark" ? "Profondeur marine" : "Lumière claire");
    });
  }

  test("un seul contrôle d'apparence dans le header", async ({ page }) => {
    await openPage(page, "/");
    await expect(page.locator('header button[aria-label^="Apparence"]')).toHaveCount(1);
    await expect(page.locator("header")).not.toContainText("Apparence");
  });

  test("icône parfaitement centrée dans sa cible tactile", async ({ page }) => {
    await openPage(page, "/");
    const offsets = await page.locator('header button[aria-label^="Apparence"]').evaluate((el) => {
      const b = el.getBoundingClientRect();
      return [".theme-icon-day-z", ".theme-icon-night-z"].map((s) => {
        const r = el.querySelector(s)!.getBoundingClientRect();
        return [r.x + r.width / 2 - (b.x + b.width / 2), r.y + r.height / 2 - (b.y + b.height / 2)];
      });
    });
    for (const [dx, dy] of offsets) {
      expect(Math.abs(dx)).toBeLessThanOrEqual(0.6);
      expect(Math.abs(dy)).toBeLessThanOrEqual(0.6);
    }
  });
});

test.describe("capsules de navigation : géométrie issue du contenu", () => {
  test("« L'univers ZELOR » tient sur une seule ligne (menu mobile)", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "menu plein écran réservé au mobile");
    await openPage(page, "/");
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    const rows = await page.getByRole("dialog").evaluate((d) =>
      [...d.querySelectorAll("a.nav-link-z")].map((a) => {
        const span = (a.querySelector("span") ?? a) as HTMLElement;
        const lh = parseFloat(getComputedStyle(span).lineHeight);
        return {
          text: (a.textContent ?? "").trim(),
          lines: Math.round(span.getBoundingClientRect().height / lh),
          overflows: Math.round(a.getBoundingClientRect().right) > window.innerWidth,
        };
      }),
    );
    expect(rows.length).toBeGreaterThan(4);
    for (const row of rows) {
      expect(row.lines, row.text).toBe(1);
      expect(row.overflows, row.text).toBe(false);
    }
  });

  test("le CTA hero ne casse jamais « L'univers ZELOR »", async ({ page }) => {
    await openPage(page, "/");
    const cta = page
      .locator('main a[href="/univers"]')
      .filter({ hasText: "L'univers ZELOR" })
      .first();
    const info = await cta.evaluate((el) => {
      const style = getComputedStyle(el);
      const range = document.createRange();
      range.selectNodeContents(el);
      const rects = range.getClientRects();
      return {
        // Le libellé s'inscrit sur une seule ligne de texte.
        lines: rects.length,
        nowrap: style.whiteSpace,
        right: el.getBoundingClientRect().right,
        vw: document.documentElement.clientWidth,
      };
    });
    expect(info.lines).toBe(1);
    expect(info.nowrap).toBe("nowrap");
    expect(info.right).toBeLessThanOrEqual(info.vw);
  });


  test("capsules desktop : même famille, largeur épousant le libellé", async ({
    page,
    isMobile,
  }) => {
    test.skip(!!isMobile, "navigation horizontale réservée au desktop");
    await openPage(page, "/");
    const caps = await page.evaluate(() =>
      [...document.querySelectorAll("header nav a.nav-link-z")].map((a) => {
        const s = getComputedStyle(a);
        const after = getComputedStyle(a, "::after");
        const r = a.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(a);
        return {
          text: (a.textContent ?? "").trim(),
          width: r.width,
          textWidth: range.getBoundingClientRect().width,
          pad: parseFloat(s.paddingLeft),
          radius: s.borderRadius,
          nowrap: s.whiteSpace,
          capsule: a.hasAttribute("data-capsule"),
          afterLeft: parseFloat(after.left || "0"),
          afterBottom: parseFloat(after.bottom || "0"),
        };
      }),
    );
    expect(caps.length).toBeGreaterThan(3);
    const radii = new Set(caps.map((c) => c.radius));
    expect(radii.size).toBe(1);
    for (const c of caps) {
      expect(c.capsule, c.text).toBe(true);
      expect(c.nowrap, c.text).toBe("nowrap");
      // La bulle épouse son texte : deux paddings, pas davantage.
      expect(Math.abs(c.width - (c.textWidth + c.pad * 2)), c.text).toBeLessThan(2);
      // Le filet dérive du padding interne et reste au-dessus de la courbure.
      expect(Math.abs(c.afterLeft - c.pad), c.text).toBeLessThan(0.6);
      expect(c.afterBottom, c.text).toBeGreaterThan(2);
    }
  });
});
