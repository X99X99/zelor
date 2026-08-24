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
      // Le défilement doit être posé **en butée** : sous charge, une capture
      // prise avant la fin du calcul de hauteur décalait tout le pied de page.
      await page.waitForFunction(
        () => {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          if (Math.abs(window.scrollY - max) > 1) {
            window.scrollTo(0, max);
            return false;
          }
          const w = window as unknown as { __h?: number };
          const settled = w.__h === document.documentElement.scrollHeight;
          w.__h = document.documentElement.scrollHeight;
          return settled;
        },
        undefined,
        { polling: 150 },
      );
      await page.waitForTimeout(400);

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

for (const theme of themes) {
  test.describe(`menu mobile — états critiques (${theme})`, () => {
    test("entrée focus clavier", async ({ page, isMobile }) => {
      test.skip(!isMobile, "menu plein écran réservé au mobile");
      await openPage(page, "/", theme);
      await page.getByRole("button", { name: "Ouvrir le menu" }).click();
      const dialog = page.getByRole("dialog");
      await dialog.locator("a.nav-link-z").first().focus();
      await page.waitForTimeout(200);
      await expect(dialog).toHaveScreenshot(`menu-mobile-focus-${theme}.png`);
    });

    test("entrée active (page consultée)", async ({ page, isMobile }) => {
      test.skip(!isMobile, "menu plein écran réservé au mobile");
      await openPage(page, "/collection", theme);
      await page.getByRole("button", { name: "Ouvrir le menu" }).click();
      const dialog = page.getByRole("dialog");
      await expect(dialog.locator('a[aria-current="page"]')).toHaveCount(1);
      await expect(dialog).toHaveScreenshot(`menu-mobile-active-${theme}.png`);
    });
  });
}

test("continuité marine annonce → header → recherche", async ({ page }) => {
  await openPage(page, "/", "light");
  const signature = () =>
    page.evaluate(() => {
      const header = document.querySelector("header")!;
      return Array.from(header.querySelectorAll<HTMLElement>("*"))
        .map((el) => getComputedStyle(el).backgroundImage)
        .filter((v) => v.includes("gradient"))
        .sort();
    });
  const closed = await signature();
  await page.getByRole("button", { name: "Rechercher" }).first().click();
  await expect(page.locator("#site-search")).toBeFocused();
  const open = await signature();
  // La recherche hérite de la matière du header : elle ne peint jamais
  // un second gradient concurrent.
  expect(open).toEqual(closed);
});
