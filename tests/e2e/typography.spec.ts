import { expect, test } from "@playwright/test";

import { openPage } from "./fixtures";

/**
 * Garde-fous typographiques.
 *
 * Trois titres de l'accueil se sont affichés « Legoûtdeschosesbienchoisies. »
 * pendant plusieurs versions sans qu'aucun test ne s'en aperçoive : la suite
 * existante lisait le `textContent`, qui contenait bien les espaces. Seul le
 * rendu était cassé. Ces tests comparent donc ce qui est **affiché** à ce qui
 * est **écrit**, et verrouillent en passant les quatre autres règles du
 * système : deux familles, pas de graisse lourde, un contraste réel, un axe
 * commun dans le pied de page.
 */

const ROUTES = [
  "/",
  "/univers",
  "/qualite",
  "/a-propos",
  "/journal",
  "/collection",
  "/aide",
  "/cgv",
  "/panier",
] as const;

const FAMILLES_AUTORISEES = ["Cormorant Garamond", "Manrope"] as const;

test.describe("garde-fous typographiques", () => {
  for (const route of ROUTES) {
    test(`aucun mot collé — ${route}`, async ({ page }) => {
      await openPage(page, route);
      const colles = await page.evaluate(() => {
        const INLINE = new Set([
          "SPAN",
          "EM",
          "STRONG",
          "A",
          "I",
          "B",
          "SMALL",
          "ABBR",
          "TIME",
          "SUP",
          "SUB",
          "BR",
        ]);
        // Seules les feuilles de texte sont comparables : sur un conteneur,
        // `textContent` colle bout à bout des blocs que le rendu sépare par
        // une rupture de ligne, et l'écart n'aurait rien d'un défaut.
        const feuille = (el: Element) =>
          Array.from(el.children).every(
            (c) => INLINE.has(c.tagName) && getComputedStyle(c).display.startsWith("inline"),
          );
        const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLocaleLowerCase("fr");
        const trouves: Array<{ affiche: string; ecrit: string }> = [];
        const cibles = "h1,h2,h3,h4,h5,h6,p,li,dt,dd,figcaption,button,a,label";
        for (const el of Array.from(document.querySelectorAll(cibles))) {
          if (!el.getClientRects().length || !feuille(el)) continue;
          const affiche = norm((el as HTMLElement).innerText ?? "");
          const ecrit = norm(el.textContent ?? "");
          if (!affiche) continue;
          // Mêmes caractères, blancs en moins : le rendu a mangé des espaces.
          if (affiche.replace(/\s/g, "") === ecrit.replace(/\s/g, "") && affiche !== ecrit) {
            trouves.push({ affiche: affiche.slice(0, 70), ecrit: ecrit.slice(0, 70) });
          }
        }
        return trouves;
      });
      expect(colles, `Mots collés à l'affichage sur ${route}`).toEqual([]);
    });

    test(`deux familles au maximum — ${route}`, async ({ page }) => {
      await openPage(page, route);
      const familles = await page.evaluate(() => {
        const vues = new Set<string>();
        const cibles = "h1,h2,h3,h4,h5,h6,p,li,dt,dd,figcaption,button,a,label,input,textarea";
        for (const el of Array.from(document.querySelectorAll(cibles))) {
          if (!el.getClientRects().length) continue;
          if (!(el.textContent ?? "").trim() && !(el instanceof HTMLInputElement)) continue;
          const premiere = getComputedStyle(el).fontFamily.split(",")[0] ?? "";
          vues.add(premiere.replace(/["']/g, "").trim());
        }
        return Array.from(vues).sort();
      });
      expect(familles.length, `Aucune famille détectée sur ${route}`).toBeGreaterThan(0);
      for (const famille of familles) {
        expect(FAMILLES_AUTORISEES, `Famille inattendue sur ${route}`).toContain(famille);
      }
    });

    test(`aucune graisse au-delà de 500 — ${route}`, async ({ page }) => {
      await openPage(page, route);
      const lourds = await page.evaluate(() => {
        const trouves: Array<{ graisse: string; texte: string }> = [];
        const cibles = "h1,h2,h3,h4,h5,h6,p,li,dt,dd,figcaption,button,a,label,summary,strong";
        for (const el of Array.from(document.querySelectorAll(cibles))) {
          if (!el.getClientRects().length) continue;
          const texte = (el.textContent ?? "").replace(/\s+/g, " ").trim();
          if (!texte) continue;
          const graisse = getComputedStyle(el).fontWeight;
          if (Number(graisse) >= 600) trouves.push({ graisse, texte: texte.slice(0, 50) });
        }
        return trouves;
      });
      expect(lourds, `Graisses ≥ 600 sur ${route}`).toEqual([]);
    });

    test(`contraste suffisant dans le contenu — ${route}`, async ({ page }) => {
      await openPage(page, route);
      const echecs = await page.evaluate(() => {
        const cv = document.createElement("canvas");
        cv.width = 1;
        cv.height = 1;
        const ctx = cv.getContext("2d", { willReadFrequently: true });
        if (!ctx) return [];
        // Le canvas convertit n'importe quelle notation CSS — oklch comprise —
        // en pixel réel. Lire les composantes de la chaîne donnerait des
        // valeurs fausses.
        const toRGBA = (col: string) => {
          ctx.clearRect(0, 0, 1, 1);
          ctx.fillStyle = "rgba(0,0,0,0)";
          ctx.fillStyle = col;
          ctx.fillRect(0, 0, 1, 1);
          const d = ctx.getImageData(0, 0, 1, 1).data;
          return { r: d[0] ?? 0, g: d[1] ?? 0, b: d[2] ?? 0, a: (d[3] ?? 0) / 255 };
        };
        // Remonte au premier fond opaque. Renvoie null si un dégradé, une
        // image ou un filtre d'arrière-plan intervient avant : la couleur
        // réellement peinte n'est alors pas déductible des styles calculés,
        // et le test se tait plutôt que d'inventer un chiffre.
        const fondDe = (el: Element) => {
          let n: Element | null = el;
          while (n) {
            const cs = getComputedStyle(n);
            if (cs.backgroundImage !== "none") return null;
            if (cs.backdropFilter && cs.backdropFilter !== "none") return null;
            const c = toRGBA(cs.backgroundColor);
            if (c.a > 0.95) return c;
            n = n.parentElement;
          }
          return null;
        };
        const lum = (c: { r: number; g: number; b: number }) => {
          const f = (v: number) => {
            const x = v / 255;
            return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
          };
          return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
        };
        const racine = document.querySelector("main");
        if (!racine) return [];
        const trouves: Array<{ rapport: number; taille: number; texte: string }> = [];
        const cibles = "p,a,h1,h2,h3,h4,li,button,figcaption,small,dt,dd,label";
        for (const el of Array.from(racine.querySelectorAll(cibles))) {
          if (!el.getClientRects().length || el.classList.contains("sr-only")) continue;
          const texte = (el.textContent ?? "").replace(/\s+/g, " ").trim();
          if (!texte) continue;
          const fond = fondDe(el);
          if (!fond) continue;
          const cs = getComputedStyle(el);
          const fg = toRGBA(cs.color);
          const mix = {
            r: fg.r * fg.a + fond.r * (1 - fg.a),
            g: fg.g * fg.a + fond.g * (1 - fg.a),
            b: fg.b * fg.a + fond.b * (1 - fg.a),
          };
          const l1 = lum(mix);
          const l2 = lum(fond);
          const rapport = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
          const taille = Math.round(parseFloat(cs.fontSize));
          const seuil = taille >= 24 ? 3 : 4.5;
          if (rapport < seuil) {
            trouves.push({
              rapport: Math.round(rapport * 100) / 100,
              taille,
              texte: texte.slice(0, 44),
            });
          }
        }
        return trouves;
      });
      expect(echecs, `Contrastes insuffisants sur ${route}`).toEqual([]);
    });
  }

  test("les liens du pied de page partagent l'axe de leur intitulé", async ({ page }) => {
    await openPage(page, "/");
    const ecarts = await page.evaluate(() => {
      const pied = document.querySelector("footer");
      if (!pied) return [{ colonne: "footer absent", ecart: -1 }];
      const bord = (el: Element) => {
        const r = el.getBoundingClientRect();
        return r.left + parseFloat(getComputedStyle(el).paddingLeft || "0");
      };
      const trouves: Array<{ colonne: string; ecart: number }> = [];
      for (const nav of Array.from(pied.querySelectorAll("nav"))) {
        const titre = nav.querySelector("h2");
        if (!titre) continue;
        const axeTitre = bord(titre);
        for (const lien of Array.from(nav.querySelectorAll("a"))) {
          const ecart = Math.round(bord(lien) - axeTitre);
          if (Math.abs(ecart) > 1) {
            trouves.push({ colonne: (titre.textContent ?? "").trim(), ecart });
          }
        }
      }
      return trouves;
    });
    expect(ecarts, "Liens décalés de leur intitulé de colonne").toEqual([]);
  });
});
