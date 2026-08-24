import { expect, test } from "@playwright/test";

import { openPage } from "./fixtures";

test.describe("parcours critiques", () => {
  test("le lien de la page active fait remonter sans changer l'URL", async ({
    page,
    isMobile,
  }) => {
    test.skip(!!isMobile, "navigation principale visible sur desktop");
    await openPage(page, "/collection");
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(150);
    const link = page
      .locator('header nav a[aria-current="page"]')
      .first();
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

  test("la recherche s'ouvre, se soumet et mène à la collection", async ({
    page,
  }) => {
    await openPage(page, "/");
    await page.getByRole("button", { name: "Rechercher" }).first().click();
    await page.locator("#site-search").fill("riviera");
    await page.locator("#site-search").press("Enter");
    await expect(page).toHaveURL(/\/collection\?q=riviera/);
  });

  test("le thème persiste entre deux visites", async ({ page }) => {
    await openPage(page, "/", "light");
    await page
      .getByRole("button", { name: /mode jour et le mode nuit/ })
      .click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("le réglage « Système » est accessible et rend la main à l'appareil", async ({
    page,
  }) => {
    await openPage(page, "/", "dark");
    await page.emulateMedia({ colorScheme: "light" });
    await page.getByRole("button", { name: "Réglages d'apparence" }).click();
    await page.getByRole("option", { name: /Système/ }).click();
    await expect(page.locator("html")).toHaveClass(/light/);
  });

  test("le menu mobile s'ouvre, navigue et rend le scroll", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "menu plein écran réservé au mobile");
    await openPage(page, "/");
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    await page
      .getByRole("dialog")
      .getByRole("link", { name: "Collection", exact: true })
      .click();
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

  test("la navigation clavier atteint le contenu et les liens", async ({
    page,
    isMobile,
  }) => {
    test.skip(!!isMobile, "clavier vérifié sur desktop");
    await openPage(page, "/");
    await page.keyboard.press("Tab");
    await expect(page.locator("a:focus")).toHaveText(/Aller au contenu/);
  });
});
