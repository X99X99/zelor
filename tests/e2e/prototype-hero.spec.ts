import { expect, test } from "@playwright/test";

import { openPage } from "./fixtures";

/**
 * Prototype d'ouverture et de séquence.
 *
 * Ces vérifications passent par Playwright et non par une inspection dans un
 * volet intégré : un onglet masqué gèle `requestAnimationFrame` **et** les
 * rappels d'`IntersectionObserver`, si bien que toute mécanique pilotée par le
 * défilement y paraît morte alors qu'elle fonctionne. Constaté, puis contourné.
 */

const ROUTE = "/prototype-hero";

/** Fait défiler jusqu'à une fraction de la piste de séquence. */
async function scrollToTrack(page: import("@playwright/test").Page, fraction: number) {
  await page.evaluate((f) => {
    const track = document.querySelector<HTMLElement>(".stage-track-z");
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const span = track.getBoundingClientRect().height - window.innerHeight;
    window.scrollTo(0, Math.round(top + f * span));
  }, fraction);
}

test.describe("prototype — ouverture et séquence", () => {
  test("l'ouverture occupe un écran, la séquence en occupe trois", async ({ page }) => {
    await openPage(page, ROUTE);
    const mesures = await page.evaluate(() => {
      const open = document.querySelector<HTMLElement>(".open-track-z");
      const track = document.querySelector<HTMLElement>(".stage-track-z");
      const scene = document.querySelector<HTMLElement>(".stage-scene-z");
      return {
        ouverture: open ? open.getBoundingClientRect().height / window.innerHeight : 0,
        sequence: track ? track.getBoundingClientRect().height / window.innerHeight : 0,
        scenePosition: scene ? getComputedStyle(scene).position : "",
        sceneHauteur: scene ? Math.round(scene.getBoundingClientRect().height) : 0,
        viewport: window.innerHeight,
      };
    });
    expect(mesures.ouverture).toBeGreaterThan(0.95);
    expect(mesures.ouverture).toBeLessThan(1.05);
    // 4,25 écrans : c'est la section longue de la page, celle qui porte
    // l'amplitude du rythme. Sans elle, l'alternance des hauteurs s'aplatit.
    expect(mesures.sequence).toBeGreaterThan(4.15);
    expect(mesures.sequence).toBeLessThan(4.35);
    expect(mesures.scenePosition).toBe("sticky");
    expect(mesures.sceneHauteur).toBe(mesures.viewport);
  });

  test("les trois temps se succèdent et le bouton n'arrive qu'au dernier", async ({ page }) => {
    await openPage(page, ROUTE);

    const etape = async () =>
      page
        .locator(".stage-scene-z")
        .getAttribute("data-step")
        .then((v) => Number(v));
    const ctaVisible = async () =>
      page
        .locator(".stage-cta-z")
        .getAttribute("data-visible")
        .then((v) => v === "true");

    await scrollToTrack(page, 0.05);
    await expect.poll(etape).toBe(0);
    expect(await ctaVisible()).toBe(false);

    await scrollToTrack(page, 0.5);
    await expect.poll(etape).toBe(1);
    expect(await ctaVisible()).toBe(false);

    await scrollToTrack(page, 0.95);
    await expect.poll(etape).toBe(2);
    await expect.poll(ctaVisible).toBe(true);

    // Le titre persistant suit le temps courant, un seul libellé à la fois.
    const actifs = await page.locator('.stage-title-line-z[data-active="true"]').count();
    expect(actifs).toBe(1);
  });

  test("le bouton du dernier temps est atteignable au clavier", async ({ page }) => {
    await openPage(page, ROUTE);
    await scrollToTrack(page, 0.95);
    await expect.poll(() => page.locator(".stage-cta-z").getAttribute("data-visible")).toBe("true");
    const lien = page.locator(".stage-cta-z a");
    await expect(lien).toBeVisible();
    await lien.focus();
    await expect(lien).toBeFocused();
  });

  test("aucun débordement horizontal sur toute la piste", async ({ page }) => {
    await openPage(page, ROUTE);
    for (const fraction of [0, 0.35, 0.7, 1]) {
      await scrollToTrack(page, fraction);
      const etat = await page.evaluate(() => {
        const de = document.documentElement;
        return {
          defile: de.scrollWidth > de.clientWidth,
          debordants: Array.from(document.querySelectorAll("body *")).filter(
            (el) => el.getBoundingClientRect().right > de.clientWidth + 1,
          ).length,
        };
      });
      expect(etat.defile, `défilement horizontal à ${fraction}`).toBe(false);
      expect(etat.debordants, `éléments débordants à ${fraction}`).toBe(0);
    }
  });

  test("sans mouvement, la parallaxe ne démarre pas et la séquence reste lisible", async ({
    page,
  }) => {
    // `openPage` impose déjà `reducedMotion: "reduce"`.
    await openPage(page, ROUTE);
    await scrollToTrack(page, 0.5);
    const sp = await page.evaluate(() =>
      document.querySelector<HTMLElement>(".stage-track-z")?.style.getPropertyValue("--sp"),
    );
    expect(sp ?? "").toBe("");
    // Les libellés restent lisibles et complets.
    const libelles = await page.locator(".stage-title-word-z").allInnerTexts();
    expect(libelles).toEqual(["La matière", "Le détail", "La pièce"]);
  });

  test("avec mouvement, la parallaxe écrit une progression continue", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "no-preference" });
    const page = await context.newPage();
    await page.goto(ROUTE, { waitUntil: "load" });
    await page.locator(".stage-track-z").waitFor();
    // La parallaxe est posée par un effet : sans attendre l'hydratation, on
    // lirait une variable jamais écrite et l'on conclurait à tort à une panne.
    await page.waitForFunction(() => {
      const btn = document.querySelector('header button[aria-label="Rechercher"]');
      return !!btn && Object.keys(btn).some((k) => k.startsWith("__react"));
    });
    // Le défilement est réémis à chaque tour : le routeur restaure la position
    // après l'hydratation, ce qui remettrait la piste à zéro entre le scroll et
    // la lecture. Constaté en parallèle, invisible en isolation.
    await expect
      .poll(
        async () => {
          await scrollToTrack(page, 0.6);
          const sp = await page.evaluate(
            () =>
              document
                .querySelector<HTMLElement>(".stage-track-z")
                ?.style.getPropertyValue("--sp") ?? "",
          );
          return Number(sp);
        },
        { timeout: 15_000 },
      )
      .toBeGreaterThan(0.3);
    await context.close();
  });

  test("sans JavaScript, la piste se déplie et tout reste visible", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(ROUTE, { waitUntil: "load" });

    // Les trois panneaux se suivent en flux normal, sans épinglage.
    const etat = await page.evaluate(() => {
      const scene = document.querySelector<HTMLElement>(".stage-scene-z");
      const panneaux = Array.from(document.querySelectorAll<HTMLElement>(".stage-panel-z"));
      const cta = document.querySelector<HTMLElement>(".stage-cta-z");
      return {
        scenePosition: scene ? getComputedStyle(scene).position : "",
        panneauxRognes: panneaux.filter((p) => getComputedStyle(p).clipPath !== "none").length,
        panneauxEmpiles: panneaux.filter((p) => getComputedStyle(p).position === "relative").length,
        ctaVisible: cta ? getComputedStyle(cta).visibility : "",
        titres: Array.from(document.querySelectorAll(".stage-title-word-z")).map((t) =>
          (t.textContent ?? "").trim(),
        ),
      };
    });

    expect(etat.scenePosition).toBe("static");
    expect(etat.panneauxRognes).toBe(0);
    expect(etat.panneauxEmpiles).toBe(3);
    expect(etat.ctaVisible).toBe("visible");
    expect(etat.titres).toEqual(["La matière", "Le détail", "La pièce"]);
    await context.close();
  });

  test("aucun mot collé dans les libellés de la séquence", async ({ page }) => {
    await openPage(page, ROUTE);
    const colles = await page.evaluate(() => {
      const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLocaleLowerCase("fr");
      const trouves: string[] = [];
      for (const el of Array.from(document.querySelectorAll("h1,h2,p,.stage-title-word-z"))) {
        if (!el.getClientRects().length) continue;
        const affiche = norm((el as HTMLElement).innerText ?? "");
        const ecrit = norm(el.textContent ?? "");
        if (!affiche) continue;
        if (affiche.replace(/\s/g, "") === ecrit.replace(/\s/g, "") && affiche !== ecrit) {
          trouves.push(ecrit.slice(0, 60));
        }
      }
      return trouves;
    });
    expect(colles).toEqual([]);
  });
});
