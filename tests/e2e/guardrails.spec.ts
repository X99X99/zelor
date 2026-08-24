import { expect, test } from "@playwright/test";

import { openPage } from "./fixtures";

/**
 * Garde-fous permanents — voir QUALITY_GUARDRAILS.md.
 *
 * Chaque test ci-dessous correspond à une erreur réellement constatée à
 * l'écran. Un échec ici signifie qu'une régression connue est revenue :
 * on corrige le code, jamais le test.
 */

const MOTION_PROPS = ["opacity", "scale", "translate"];

/** Signature de mouvement d'une ligne du menu : propriétés, durée, courbe. */
async function motionSignature(page: import("@playwright/test").Page, selector: string) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel)!;
    const s = getComputedStyle(el);
    return {
      properties: s.transitionProperty.split(",").map((p) => p.trim()),
      duration: s.transitionDuration,
      easing: s.transitionTimingFunction,
    };
  }, selector);
}

test.describe("garde-fou thème et motion", () => {
  test("le fondu de thème n'écrase pas la chorégraphie focale", async ({ page, isMobile }) => {
    test.skip(!isMobile, "menu plein écran réservé au mobile");
    await openPage(page, "/", "light");
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    const rowSelector = '[role="dialog"] [data-focal]';
    const before = await motionSignature(page, rowSelector);

    for (const prop of MOTION_PROPS) {
      expect(before.properties, `${prop} doit rester animé`).toContain(prop);
    }
    // Le fondu global (couleur uniquement) ne doit pas s'y substituer.
    expect(before.properties.length).toBeGreaterThan(3);

    // Bascule de thème pendant que le menu est ouvert : la signature de
    // mouvement des entrées doit être strictement identique après coup.
    await page.evaluate(() => {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    });
    await page.waitForTimeout(120);
    expect(await motionSignature(page, rowSelector)).toEqual(before);
  });
});

test.describe("garde-fou menu mobile", () => {
  test("« Langue » et les entrées-liens partagent la même primitive", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "menu plein écran réservé au mobile");
    await openPage(page, "/");
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    const signatures = await page.evaluate(() =>
      [...document.querySelectorAll('[role="dialog"] [data-focal]')].map((el) => {
        const s = getComputedStyle(el);
        return {
          text: (el.textContent ?? "").trim().slice(0, 24),
          duration: s.transitionDuration,
          easing: s.transitionTimingFunction,
          properties: s.transitionProperty,
        };
      }),
    );
    expect(signatures.length).toBeGreaterThanOrEqual(6);
    const reference = signatures[signatures.length - 1]!;
    for (const s of signatures) {
      expect(s.duration, s.text).toBe(reference.duration);
      expect(s.easing, s.text).toBe(reference.easing);
      expect(s.properties, s.text).toBe(reference.properties);
    }
  });

  test("le soulignement reste ancré dans la capsule pendant le mouvement", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "menu plein écran réservé au mobile");
    await openPage(page, "/");
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    const link = page.getByRole("dialog").locator("a.nav-link-z").first();
    const read = () =>
      link.evaluate((el) => {
        const after = getComputedStyle(el, "::after");
        const pad = parseFloat(getComputedStyle(el).paddingLeft);
        return {
          left: parseFloat(after.left || "0"),
          right: parseFloat(after.right || "0"),
          translate: after.translate,
          pad,
        };
      });
    const rest = await read();
    await link.focus();
    await page.waitForTimeout(300);
    const active = await read();
    // Le filet ne suit pas le texte : mêmes inserts, aucun déplacement propre.
    expect(active.left).toBeCloseTo(rest.left, 1);
    expect(active.right).toBeCloseTo(rest.right, 1);
    expect(rest.left).toBeGreaterThan(4);
    // Il dérive du padding interne de la capsule.
    expect(Math.abs(rest.left - rest.pad)).toBeLessThan(1.2);
  });
});

test.describe("garde-fou capsules : libellés longs", () => {
  for (const width of [320, 360, 412]) {
    test(`aucun libellé cassé à ${width}px`, async ({ page, isMobile }) => {
      test.skip(!isMobile, "viewports téléphone");
      await page.setViewportSize({ width, height: 760 });
      await openPage(page, "/");
      await page.getByRole("button", { name: "Ouvrir le menu" }).click();
      const rows = await page.getByRole("dialog").evaluate((d) =>
        [...d.querySelectorAll("a.nav-link-z")].map((a) => {
          const span = (a.querySelector("span") ?? a) as HTMLElement;
          const lh = parseFloat(getComputedStyle(span).lineHeight);
          const r = a.getBoundingClientRect();
          return {
            text: (a.textContent ?? "").trim(),
            lines: Math.round(span.getBoundingClientRect().height / lh),
            overflows: Math.round(r.right) > window.innerWidth + 1,
            width: r.width,
            vw: window.innerWidth,
          };
        }),
      );
      const univers = rows.find((r) => r.text.includes("univers ZELOR"));
      expect(univers, "« L'univers ZELOR » doit être présent").toBeTruthy();
      for (const row of rows) {
        expect(row.lines, row.text).toBe(1);
        expect(row.overflows, row.text).toBe(false);
        // Capsule proportionnée : jamais plus large que la feuille.
        expect(row.width, row.text).toBeLessThanOrEqual(row.vw);
      }
    });
  }
});

test.describe("garde-fou apparence : astre correct dans les quatre états", () => {
  for (const mode of ["light", "dark"] as const) {
    test(`préférence système ${mode} → astre attendu`, async ({ page }) => {
      // Aucun choix mémorisé : l'appareil décide.
      await page.emulateMedia({ colorScheme: mode, reducedMotion: "reduce" });
      await page.addInitScript(() => {
        try {
          localStorage.setItem("zelor.consent.v1", "all");
          localStorage.removeItem("zelor-theme");
        } catch {
          /* ignore */
        }
      });
      await page.goto("/", { waitUntil: "load" });
      const button = page.locator('header button[aria-label^="Apparence"]');
      await expect(button).toHaveCount(1);
      // Hydratation terminée : avant elle, le libellé est encore générique.
      await expect(button).toHaveAttribute("aria-label", /Apparence : /);
      const state = await button.evaluate((el) => ({
        dark: document.documentElement.classList.contains("dark"),
        sun: getComputedStyle(el.querySelector(".theme-icon-day-z")!).opacity,
        moon: getComputedStyle(el.querySelector(".theme-icon-night-z")!).opacity,
        label: el.getAttribute("aria-label") ?? "",
      }));
      expect(state.dark).toBe(mode === "dark");
      expect(state.sun).toBe(mode === "dark" ? "0" : "1");
      expect(state.moon).toBe(mode === "dark" ? "1" : "0");
      expect(state.label).not.toBe("Apparence");
    });
  }

  test("aucun contrôle concurrent ni libellé « Apparence » visible", async ({ page }) => {
    await openPage(page, "/");
    await expect(page.locator('header button[aria-label^="Apparence"]')).toHaveCount(1);
    await expect(page.locator("header")).not.toContainText("Apparence");
    const visibleLabels = await page.evaluate(
      () =>
        [...document.querySelectorAll("header *")].filter(
          (el) =>
            el.children.length === 0 &&
            (el.textContent ?? "").trim().toLowerCase() === "apparence" &&
            getComputedStyle(el).visibility !== "hidden",
        ).length,
    );
    expect(visibleLabels).toBe(0);
  });
});

test.describe("garde-fou filet de progression", () => {
  test("la progression suit le scroll, la tête d'éclat le marque", async ({ page }) => {
    await openPage(page, "/collection");
    const bar = page.locator(".progress-z");
    const read = () =>
      bar.evaluate((el) => {
        const track = el.parentElement!.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        const after = getComputedStyle(el, "::after");
        return {
          ratio: r.width / track.width,
          scrolled: window.scrollY / (document.documentElement.scrollHeight - window.innerHeight),
          headRight: after.right,
          clipped: getComputedStyle(el).overflow,
        };
      });
    await page.evaluate(() =>
      window.scrollTo(0, (document.documentElement.scrollHeight - window.innerHeight) * 0.5),
    );
    await page.waitForTimeout(600);
    const mid = await read();
    expect(Math.abs(mid.ratio - mid.scrolled)).toBeLessThan(0.05);
    // La tête d'éclat est ancrée à l'extrémité et n'est jamais tronquée.
    expect(mid.headRight).toBe("0px");
    expect(mid.clipped).toBe("visible");

    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight - window.innerHeight),
    );
    await page.waitForTimeout(600);
    const end = await read();
    expect(end.ratio).toBeGreaterThan(mid.ratio);
    expect(end.ratio).toBeGreaterThan(0.95);
  });
});

/**
 * Passe « lumière » : l'ombre dorée diffuse a été supprimée, le marqueur de
 * lecture conservé ; les logos partagent une signature unique sans animation
 * au repos ; les liens juridiques restent hors de la famille des capsules.
 */
test.describe("garde-fous — lumière et cohérence interactive", () => {
  test("le filet doré n'a aucune ombre diffuse mais garde sa tête de lecture", async ({ page }) => {
    await openPage(page, "/");
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(400);
    const state = await page
      .locator(".progress-z")
      .first()
      .evaluate((el) => {
        const s = getComputedStyle(el);
        const after = getComputedStyle(el, "::after");
        return {
          shadow: s.boxShadow,
          headShadow: after.boxShadow,
          headContent: after.content,
          headWidth: parseFloat(after.width),
        };
      });
    expect(state.shadow).toBe("none");
    expect(state.headShadow).toBe("none");
    // Le point de lecture existe toujours, resserré et net.
    expect(state.headContent).not.toBe("none");
    expect(state.headWidth).toBeGreaterThan(0);
    expect(state.headWidth).toBeLessThanOrEqual(18);
  });

  test("les logos ZELOR partagent la même signature, éteinte au repos", async ({ page }) => {
    await openPage(page, "/");
    const marks = page.locator("a.wordmark-z");
    const count = await marks.count();
    expect(count).toBeGreaterThanOrEqual(1);
    const states = await marks.evaluateAll((els) =>
      els.map((el) => {
        const s = getComputedStyle(el);
        const after = getComputedStyle(el, "::after");
        return {
          animation: s.animationName,
          haloAnimation: after.animationName,
          haloOpacity: after.opacity,
          transition: s.transitionDuration,
          haloTransition: after.transitionDuration,
        };
      }),
    );
    const ref = states[0]!;
    for (const s of states) {
      // Aucune animation automatique au repos.
      expect(s.animation).toBe("none");
      expect(s.haloAnimation).toBe("none");
      expect(s.haloOpacity).toBe("0");
      // Montée et retrait strictement identiques d'un logo à l'autre.
      expect(s.transition).toBe(ref.transition);
      expect(s.haloTransition).toBe(ref.haloTransition);
    }
  });

  test("tous les liens visibles appartiennent à la famille des capsules", async ({ page }) => {
    for (const path of ["/", "/cgv", "/confidentialite", "/mentions-legales", "/aide"]) {
      await openPage(page, path);
      const nu = await page.evaluate(() => {
        const visible = (el: Element) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden";
        };
        return [...document.querySelectorAll("a")]
          .filter(
            (a) =>
              visible(a) &&
              // Lien d'évitement : outil d'accessibilité, hors interface.
              (a.getAttribute("href") ?? "").startsWith("/") &&
              // Cartes et vignettes : ce ne sont pas des liens textuels.
              !a.querySelector("img, svg, picture, video, h1, h2, h3, figure") &&
              (a.textContent ?? "").trim().length > 0 &&
              !a.classList.contains("wordmark-z"),
          )
          .filter(
            (a) =>
              !a.classList.contains("nav-link-z") &&
              !a.classList.contains("link-underline") &&
              !a.className.includes("btn-"),
          )
          .map((a) => `${(a.textContent ?? "").trim().slice(0, 40)} @ ${a.getAttribute("href")}`);
      });
      expect(nu, `liens hors capsule sur ${path}`).toEqual([]);
    }
  });

  test("les liens juridiques du footer portent bien la capsule", async ({ page }) => {
    await openPage(page, "/");
    const legal = page.locator('footer nav[aria-label="Informations"] a.nav-link-z');
    expect(await legal.count()).toBeGreaterThan(2);
    for (const attr of await legal.evaluateAll((els) =>
      els.map((el) => el.hasAttribute("data-capsule")),
    )) {
      expect(attr).toBe(true);
    }
    const nav = page.locator('footer nav[aria-label="Boutique"] a.nav-link-z');
    for (const attr of await nav.evaluateAll((els) =>
      els.map((el) => el.hasAttribute("data-capsule")),
    )) {
      expect(attr).toBe(true);
    }
  });

  test("un lien de paragraphe porte la même capsule que la navigation", async ({ page }) => {
    await openPage(page, "/cgv");
    const prose = page.locator("main a.link-underline").first();
    await expect(prose).toBeVisible();
    const geo = await prose.evaluate((el) => {
      const s = getComputedStyle(el);
      const after = getComputedStyle(el, "::after");
      return {
        radius: s.borderRadius,
        pad: s.paddingLeft,
        display: s.display,
        afterLeft: after.left,
      };
    });
    const ref = await page
      .locator("footer a.nav-link-z[data-capsule]")
      .first()
      .evaluate((el) => {
        const s = getComputedStyle(el);
        const after = getComputedStyle(el, "::after");
        return {
          radius: s.borderRadius,
          pad: s.paddingLeft,
          display: s.display,
          afterLeft: after.left,
        };
      });
    expect(geo).toEqual(ref);
  });
});
