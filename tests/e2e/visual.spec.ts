import { expect, test } from "@playwright/test";

import { openPage, structuralSignature, type ThemeName } from "./fixtures";

/**
 * Non-régression visuelle des zones critiques ZELOR.
 * Une baseline ne se met à jour que volontairement (voir HANDOFF.md §
 * « Tests visuels ») — jamais pour faire disparaître un échec.
 */
const themes: ThemeName[] = ["light", "dark"];

for (const theme of themes) {
  test.describe(`thème ${theme}`, () => {
    test("annonce + header + fermeture de la recherche", async ({ page }) => {
      await openPage(page, "/", theme);
      await expect(page.locator("header")).toHaveScreenshot(`header-closed-${theme}.png`);
    });

    test("recherche ouverte et focus", async ({ page }) => {
      await openPage(page, "/", theme);
      await page.getByRole("button", { name: "Rechercher" }).first().click();
      await expect(page.locator("#site-search")).toBeFocused();
      await expect(page.locator("header")).toHaveScreenshot(`header-search-open-${theme}.png`);
    });

    test("navigation active dans le header", async ({ page, isMobile }) => {
      test.skip(!!isMobile, "navigation principale visible sur desktop");
      await openPage(page, "/collection", theme);
      const active = page.locator('header nav a[aria-current="page"]');
      await expect(active).toHaveCount(1);
      await expect(active).toHaveText("Collection");
    });

    test("footer et fin de page", async ({ page }) => {
      await openPage(page, "/", theme);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(200);
      await expect(page.locator("footer")).toHaveScreenshot(`footer-${theme}.png`);
    });

    test("menu mobile", async ({ page, isMobile }) => {
      test.skip(!isMobile, "menu plein écran réservé au mobile");
      await openPage(page, "/", theme);
      await page.getByRole("button", { name: "Ouvrir le menu" }).click();
      await expect(page.getByRole("dialog")).toHaveScreenshot(`menu-mobile-${theme}.png`);
    });
  });
}

test("parité structurelle clair / sombre", async ({ browser }) => {
  const contexts = await Promise.all([browser.newContext(), browser.newContext()]);
  const [lightPage, darkPage] = await Promise.all(contexts.map((c) => c.newPage()));
  await openPage(lightPage, "/collection", "light");
  await openPage(darkPage, "/collection", "dark");
  expect(await structuralSignature(darkPage)).toEqual(await structuralSignature(lightPage));
  await Promise.all(contexts.map((c) => c.close()));
});
