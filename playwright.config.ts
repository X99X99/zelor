import { defineConfig, devices } from "@playwright/test";

import { LOCK_MESSAGE, resolveFallbackChromium, resolveLockedChromium } from "./tests/e2e/browser";

/**
 * Tests navigateur ZELOR : non-régression visuelle et parcours critiques.
 *
 * Déterminisme verrouillé (voir QUALITY_GUARDRAILS.md § « Captures visuelles ») :
 * moteur de rendu unique et vérifié, viewport et DPR fixes, locale et fuseau
 * imposés, animations figées, polices attendues et vérifiées avant capture,
 * données dynamiques neutralisées, parallélisme borné.
 */
/**
 * Deux familles de tests, deux exigences différentes.
 *
 * Les captures visuelles comparent des pixels : elles n'ont de sens que sur le
 * moteur exact qui a produit les images de référence. Le verrou reste donc
 * entier pour elles.
 *
 * Les parcours — panier, navigation, filets de progression — vérifient un
 * comportement, pas un rendu de texte. Les bloquer parce qu'un Chromium n'a pas
 * la bonne version revient à ne plus rien vérifier du tout, y compris le tunnel
 * d'achat. Ils tournent donc sur le navigateur disponible.
 *
 * Sans le moteur verrouillé, la suite visuelle est écartée et le dit. Elle
 * n'échoue pas en silence, et elle ne fait plus tomber le reste avec elle.
 */
const locked = resolveLockedChromium();
if (!locked) {
  console.warn(LOCK_MESSAGE);
  console.warn("→ Suite visuelle écartée. Les parcours, eux, restent vérifiés.");
}

// Rendu de texte identique d'une machine à l'autre.
const RENDER_ARGS = [
  "--font-render-hinting=none",
  "--disable-lcd-text",
  "--force-color-profile=srgb",
];

// Sans verrou, les parcours tournent sur le navigateur que l'environnement
// fournit — encore faut-il qu'il existe là où Playwright le cherche.
const fallback = locked ? null : resolveFallbackChromium();
const launchOptions = locked
  ? { executablePath: locked.executablePath, args: RENDER_ARGS }
  : fallback
    ? { executablePath: fallback, args: RENDER_ARGS }
    : { args: RENDER_ARGS };

/** Les comparaisons de pixels n'ont lieu que sur le moteur de référence. */
const testIgnore = locked ? [] : ["**/visual.spec.ts"];

export default defineConfig({
  testDir: "./tests/e2e",
  testIgnore,
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
  // Le serveur de développement écoute sur `::`. Un environnement sans IPv6 —
  // les sessions Claude Code sur le web, par exemple — le refuse
  // (`EAFNOSUPPORT`) et emporte toute la suite avec lui. Ces deux variables
  // laissent un tel environnement fournir la commande IPv4 équivalente, sans
  // rien changer pour qui n'en a pas besoin.
  webServer: {
    command: process.env["ZELOR_DEV_COMMAND"] ?? "bun run dev",
    url: process.env["ZELOR_DEV_URL"] ?? "http://localhost:8080",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
