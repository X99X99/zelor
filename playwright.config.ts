import { defineConfig, devices } from "@playwright/test";

/**
 * Certains environnements CI fournissent leur propre Chromium (le binaire
 * téléchargé par Playwright peut manquer de bibliothèques système). On laisse
 * la main via `ZELOR_CHROMIUM_PATH` sans rien changer au reste de la suite.
 */
const chromiumPath = process.env["ZELOR_CHROMIUM_PATH"];
const launchOptions = chromiumPath ? { executablePath: chromiumPath } : {};

/**
 * Tests navigateur ZELOR : non-régression visuelle et parcours critiques.
 *
 * Déterminisme : animations figées par la feuille de style injectée dans
 * `tests/e2e/fixtures.ts`, polices attendues avant capture, viewports fixes,
 * thème imposé avant le premier rendu.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  snapshotPathTemplate: "{testDir}/baselines/{testFileName}/{arg}-{projectName}{ext}",
  fullyParallel: true,
  forbidOnly: !!process.env["CI"],
  retries: 0,
  reporter: process.env["CI"] ? "line" : "list",
  expect: {
    // Tolérance étroite : seules les différences de rendu inévitables passent.
    toHaveScreenshot: { maxDiffPixelRatio: 0.012, animations: "disabled" },
  },
  use: {
    baseURL: "http://localhost:8080",
    trace: "retain-on-failure",
    reducedMotion: "reduce",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 900 },
        launchOptions,
      },
    },
    { name: "mobile", use: { ...devices["Pixel 7"], launchOptions } },
  ],
  webServer: {
    command: "bun run dev",
    url: "http://localhost:8080",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
