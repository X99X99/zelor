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
        type Couleur = { r: number; g: number; b: number; a: number };
        const toRGBA = (col: string): Couleur => {
          ctx.clearRect(0, 0, 1, 1);
          ctx.fillStyle = "rgba(0,0,0,0)";
          ctx.fillStyle = col;
          ctx.fillRect(0, 0, 1, 1);
          const d = ctx.getImageData(0, 0, 1, 1).data;
          return { r: d[0] ?? 0, g: d[1] ?? 0, b: d[2] ?? 0, a: (d[3] ?? 0) / 255 };
        };
        const sur = (f: Couleur, b: Couleur): Couleur => ({
          r: f.r * f.a + b.r * (1 - f.a),
          g: f.g * f.a + b.g * (1 - f.a),
          b: f.b * f.a + b.b * (1 - f.a),
          a: 1,
        });
        // Couches peintes par un élément : sa couleur de fond, puis chaque
        // arrêt de son dégradé. Un arrêt translucide n'est pas un fond opaque :
        // le lire comme tel donnait des rapports de 1 : 1 impossibles.
        const couchesDe = (el: Element): Couleur[][] => {
          const cs = getComputedStyle(el);
          const couches: Couleur[][] = [];
          const fond = toRGBA(cs.backgroundColor);
          if (fond.a > 0.001) couches.push([fond]);
          const image = cs.backgroundImage;
          if (image && image !== "none") {
            const motif = /(oklab|oklch|rgba?|hsla?)\([^()]*\)|#[0-9a-f]{3,8}/gi;
            const arrets = (image.match(motif) ?? []).map(toRGBA).filter((c) => c.a > 0.001);
            if (arrets.length) couches.push(arrets);
          }
          return couches;
        };
        // Compose de la racine vers l'élément. Un dégradé donne une fourchette :
        // on conserve le fond le plus sombre et le plus clair, et l'on retient
        // ensuite le pire des deux rapports.
        const fondsDe = (el: Element): Couleur[] => {
          const chaine: Element[] = [];
          let n: Element | null = el;
          while (n) {
            chaine.unshift(n);
            n = n.parentElement;
          }
          let fonds: Couleur[] = [{ r: 255, g: 255, b: 255, a: 1 }];
          for (const noeud of chaine) {
            for (const couche of couchesDe(noeud)) {
              const suivants: Couleur[] = [];
              for (const base of fonds) for (const arret of couche) suivants.push(sur(arret, base));
              suivants.sort((x, y) => lum(x) - lum(y));
              const premier = suivants[0];
              const dernier = suivants[suivants.length - 1];
              if (premier && dernier) fonds = [premier, dernier];
            }
          }
          return fonds;
        };
        const lum = (c: { r: number; g: number; b: number }) => {
          const f = (v: number) => {
            const x = v / 255;
            return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
          };
          return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
        };
        // `main` et `footer` seulement. L'en-tête est exclu : il porte un
        // `backdrop-filter` au-dessus du contenu défilé, donc son fond réel
        // dépend de ce qui passe dessous et n'est pas déductible des styles.
        const racines = [document.querySelector("main"), document.querySelector("footer")];
        const trouves: Array<{ rapport: number; taille: number; texte: string }> = [];
        const cibles = "p,a,h1,h2,h3,h4,li,button,figcaption,small,dt,dd,label";
        for (const racine of racines) {
          if (!racine) continue;
          for (const el of Array.from(racine.querySelectorAll(cibles))) {
            if (!el.getClientRects().length || el.classList.contains("sr-only")) continue;
            const texte = (el.textContent ?? "").replace(/\s+/g, " ").trim();
            if (!texte) continue;
            const cs = getComputedStyle(el);
            const fg = toRGBA(cs.color);
            const taille = Math.round(parseFloat(cs.fontSize));
            const seuil = taille >= 24 ? 3 : 4.5;
            let pire = Number.POSITIVE_INFINITY;
            for (const fond of fondsDe(el)) {
              const l1 = lum(sur(fg, fond));
              const l2 = lum(fond);
              pire = Math.min(pire, (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05));
            }
            if (pire < seuil) {
              trouves.push({
                rapport: Math.round(pire * 100) / 100,
                taille,
                texte: texte.slice(0, 44),
              });
            }
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
