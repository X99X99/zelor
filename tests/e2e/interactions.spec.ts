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
