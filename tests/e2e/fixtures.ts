import type { Page } from "@playwright/test";

import { THEME_STORAGE_KEY } from "../../src/lib/zelor/theme";

export type ThemeName = "light" | "dark";

/** Fige tout mouvement, curseur et média : la capture doit être reproductible. */
const FREEZE_CSS = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    caret-color: transparent !important;
    scroll-behavior: auto !important;
  }
  video { visibility: hidden !important; }
`;

/** Requête catalogue Shopify : c'est elle qui décide de ce que la page affiche. */
const STOREFRONT_REQUEST = /myshopify\.com\/api\/.*graphql\.json/;

/**
 * Routes qui interrogent le catalogue au montage.
 *
 * Tant que cette requête n'a pas abouti, la page a deux rendus possibles : les
 * pièces, ou l'état « catalogue à venir ». Sous charge, deux onglets ouverts en
 * parallèle n'en sont pas au même point, et une comparaison structurelle échoue
 * pour une raison qui n'a rien d'une régression.
 *
 * On attend donc la réponse, jamais un délai : un délai ne ferait que déplacer
 * la course. Et l'on attend la réponse, non l'apparition de pièces — le
 * catalogue peut légitimement être vide, et l'est aujourd'hui.
 */
const CATALOGUE_ROUTES = ["/collection", "/nouveautes", "/panier", "/produit/"];

function queriesCatalogue(path: string): boolean {
  const clean = path.split("?")[0] ?? path;
  return clean === "/" || CATALOGUE_ROUTES.some((route) => clean.startsWith(route));
}

/**
 * Ouvre une page dans un thème imposé, sans flash ni donnée dynamique :
 * le choix de thème est écrit avant le premier rendu, l'année du footer est
 * neutralisée, et l'on attend les polices avant toute capture.
 */
export async function openPage(page: Page, path: string, theme: ThemeName = "light") {
  await page.addInitScript(
    ([key, value]) => {
      try {
        // Le consentement est déjà donné : le bandeau ne doit pas décaler
        // la mise en page pendant les captures.
        localStorage.setItem("zelor.consent.v1", "all");
        // Amorce unique : le thème est imposé avant le premier rendu, mais un
        // rechargement doit lire ce que l'application a réellement mémorisé.
        if (sessionStorage.getItem("zelor-test-seeded")) return;
        sessionStorage.setItem("zelor-test-seeded", "1");
        localStorage.setItem(key as string, value as string);
      } catch {
        /* ignore */
      }
    },
    [THEME_STORAGE_KEY, theme] as const,
  );
  await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
  // L'écoute est posée avant la navigation : sur une page rapide, la réponse
  // arriverait avant qu'on ait eu le temps de l'attendre.
  const catalogueSettled = queriesCatalogue(path)
    ? page.waitForResponse(STOREFRONT_REQUEST, { timeout: 20_000 }).catch(() => null)
    : Promise.resolve(null);
  await page.goto(path, { waitUntil: "load" });
  await page.addStyleTag({ content: FREEZE_CSS });
  // L'hydratation doit être terminée avant toute interaction : sans cela, un
  // clic part dans le vide et le test échoue pour une raison qui n'existe pas.
  await page.locator('header button[aria-label="Rechercher"]').waitFor({ state: "visible" });
  await page.waitForFunction(() => {
    const btn = document.querySelector('header button[aria-label="Rechercher"]');
    return !!btn && Object.keys(btn).some((k) => k.startsWith("__react"));
  });
  // Les polices sont attendues **et vérifiées** : une capture prise avec la
  // police de repli produit un diff massif qui n'a rien d'une régression.
  const fonts = await page.evaluate(async () => {
    await document.fonts.ready;
    return {
      display: document.fonts.check('16px "Cormorant Garamond"'),
      body: document.fonts.check('16px "Manrope"'),
    };
  });
  if (!fonts.display || !fonts.body) {
    throw new Error(
      `Polices non chargées avant capture (Cormorant Garamond: ${fonts.display}, Manrope: ${fonts.body}). ` +
        "Le rendu n'est pas déterministe : réparer le chargement des polices avant de comparer des baselines.",
    );
  }
  // Le catalogue doit avoir répondu : c'est lui qui décide entre la grille de
  // pièces et l'état vide, et donc de la position de tout ce qui suit.
  await catalogueSettled;
  // Données dynamiques neutralisées : l'année courante ne doit pas dater une
  // baseline. La retouche intervient après l'hydratation complète, sinon React
  // compare son rendu à un DOM déjà modifié et signale un faux écart. Ce même
  // délai laisse à React le temps de peindre le résultat du catalogue.
  await page.waitForTimeout(250);
  await page.evaluate(() => {
    document.querySelectorAll("footer p").forEach((node) => {
      if (node.textContent?.includes("©")) node.textContent = "© 2000 ZELOR. Tous droits réservés.";
    });
  });
}

/**
 * Masque le header collant pendant une capture assemblée (élément plus haut
 * que le viewport). Playwright fait défiler la page pour assembler l'image :
 * le header pouvait alors se superposer au pied de page selon l'état du
 * masquage au défilement — source de diffs aléatoires. `visibility: hidden`
 * retire les pixels sans toucher à la géométrie.
 */
export async function hideStickyChrome(page: Page) {
  await page.addStyleTag({
    content: "header, [data-consent-panel] { visibility: hidden !important; }",
  });
}

/** Signature structurelle d'une page : hiérarchie, zones cliquables, états. */
export async function structuralSignature(page: Page) {
  return page.evaluate(() => {
    const round = (n: number) => Math.round(n);
    const nodes = Array.from(
      document.querySelectorAll(
        "header a, header button, footer a, footer button, main h1, main h2",
      ),
    );
    return nodes.map((el) => {
      const rect = el.getBoundingClientRect();
      return [
        el.tagName,
        el.getAttribute("aria-current") ?? "",
        (el.textContent ?? "").trim().slice(0, 40),
        round(rect.x),
        round(rect.y),
        round(rect.width),
        round(rect.height),
      ].join("|");
    });
  });
}
