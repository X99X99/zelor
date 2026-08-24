import { defineConfig, devices } from "@playwright/test";

import { LOCK_MESSAGE, resolveLockedChromium } from "./tests/e2e/browser";

/**
 * Tests navigateur ZELOR : non-régression visuelle et parcours critiques.
 *
 * Déterminisme verrouillé (voir QUALITY_GUARDRAILS.md § « Captures visuelles ») :
 * moteur de rendu unique et vérifié, viewport et DPR fixes, locale et fuseau
 * imposés, animations figées, polices attendues et vérifiées avant capture,
 * données dynamiques neutralisées, parallélisme borné.
 */
const locked = resolveLockedChromium();
if (!locked) throw new Error(LOCK_MESSAGE);
const launchOptions = {
  executablePath: locked.executablePath,
  // Rendu de texte identique d'une machine à l'autre.
  args: ["--font-render-hinting=none", "--disable-lcd-text", "--force-color-profile=srgb"],
};

export default defineConfig({
  testDir: "./tests/e2e",
  snapshotPathTemplate: "{testDir}/baselines/{testFileName}/{arg}-{projectName}{ext}",
  fullyParallel: true,
  // Deux workers : au-delà, la contention CPU altère le rendu du texte et
  // rendait les captures de fin de page instables (faux positifs visuels).
  workers: 2,
  forbidOnly: !!process.env["CI"],
  retries: 0,
  reporter: process.env["CI"] ? "line" : "list",

  expect: {
    // Tolérance étroite : seules les différences de rendu inévitables passent.
    // `scale: "css"` : la capture est exprimée en pixels CSS, donc indépendante
    // du DPR de l'appareil émulé — un DPR différent ne peut plus décaler une
    // baseline.
    toHaveScreenshot: { maxDiffPixelRatio: 0.012, animations: "disabled", scale: "css" },
  },
  use: {
    baseURL: "http://localhost:8080",
    trace: "retain-on-failure",
    reducedMotion: "reduce",
    locale: "fr-FR",
    timezoneId: "Europe/Paris",
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
    {
      name: "mobile",
      use: { ...devices["Pixel 7"], launchOptions },
    },
  ],
  webServer: {
    command: "bun run dev",
    url: "http://localhost:8080",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
