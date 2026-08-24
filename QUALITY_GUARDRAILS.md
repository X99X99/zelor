# ZELOR — Garde-fous qualité

Chaque entrée provient d'une erreur **réellement constatée à l'écran**. Elle
décrit le symptôme, la cause technique, la règle préventive, le test qui la
protège et la commande qui le vérifie. Un échec ici signifie qu'une régression
connue est revenue : on corrige le code, jamais le test.

Chemin obligatoire avant livraison : `bun run preflight`
(lint → types → tests unitaires → build → tests navigateur, captures incluses).

---

## 1. Captures visuelles non déterministes

- **Symptôme** — des diffs de captures apparaissent sans changement de code
  (texte légèrement différent, pied de page décalé, header superposé au footer).
- **Cause réelle** — deux causes cumulées :
  1. la suite tournait tantôt sur le Chromium livré par Playwright, tantôt sur
     un Chromium système d'une autre version (rendu de texte différent) ;
  2. les captures assemblées du pied de page (élément plus haut que le viewport)
     incluaient le header collant, dont la position dépend du défilement
     effectué par Playwright pendant l'assemblage.
- **Couche** — environnement de test (`playwright.config.ts`, `tests/e2e/`).
- **Règle** — le rendu de référence est verrouillé : un seul moteur, une seule
  version, viewport, DPR, locale, fuseau, polices, animations et données fixés.
  Sans binaire conforme au verrou, la suite **échoue** au lieu de comparer.
- **Éléments verrouillés**
  - navigateur et version : `tests/e2e/browser-lock.json` + `tests/e2e/browser.ts`
    (`ZELOR_CHROMIUM_PATH` peut pointer un chemin, la version reste vérifiée) ;
  - flags de rendu : `--font-render-hinting=none`, `--disable-lcd-text`,
    `--force-color-profile=srgb` ;
  - viewport desktop 1280×900, profil mobile Pixel 7 ; captures en pixels CSS
    (`scale: "css"`) → indépendantes du DPR ;
  - locale `fr-FR`, fuseau `Europe/Paris` ;
  - polices : attendues **et vérifiées** (`document.fonts.check`) avant capture ;
  - animations, transitions et vidéos figées (`FREEZE_CSS`), `prefers-reduced-motion: reduce` ;
  - données dynamiques neutralisées (année du pied de page, consentement cookies) ;
  - header masqué (`visibility`) pour les captures assemblées ;
  - parallélisme borné à 2 workers.
- **Test** — toute la suite `tests/e2e/visual.spec.ts` + garde de verrou au
  démarrage de Playwright.
- **Commande** — `bun run test:visual` (deux exécutions consécutives doivent
  être identiques).
- **Baselines** — jamais régénérées pour faire taire un échec. Seulement via
  `bun run test:visual:update`, après revue du diff, avec justification écrite.

## 2. Fondu de thème écrasant le motion focal

- **Symptôme** — les entrées du menu téléphone paraissaient sèches et inégales,
  alors que la ligne « Langue » glissait correctement.
- **Cause réelle** — une règle globale de transition de thème (`--theme-fade`)
  s'appliquait aux `a`, `span`, `button`… et remplaçait la chorégraphie des
  entrées par une simple transition de couleur.
- **Couche** — `src/styles.css` (règle globale hors couche utilitaire).
- **Règle** — aucun style global ne peut atteindre `[data-focal]` ni ses
  descendants. Le fondu de thème est explicitement exclu par `:not(...)`.
- **Tests** — `src/lib/zelor/motion.test.ts` › « le fondu de thème n'atteint
  jamais les entrées focales » ; `tests/e2e/guardrails.spec.ts` › « le fondu de
  thème n'écrase pas la chorégraphie focale » (signature `opacity`/`scale`/
  `translate`, durée et courbe identiques avant et après bascule de thème).
- **Commandes** — `bun run test` et `bunx playwright test tests/e2e/guardrails.spec.ts`.

## 3. Menu mobile : entrées désolidarisées de la primitive

- **Symptôme** — rebond vertical, rythme différent entre une entrée-lien et
  « Langue ».
- **Cause réelle** — géométrie propre aux liens (padding, marges, transitions
  locales) et animation de propriétés de layout (`padding-inline`,
  `letter-spacing`) provoquant des reflows.
- **Couche** — `src/styles.css` (`menu-row`, `focal-list`, `nav-link-z`),
  `src/components/zelor/NavLink.tsx`.
- **Règle** — une seule primitive : `menu-row` porte la géométrie,
  `focal-list` la chorégraphie (`--dur-menu` / `--ease-glide`, uniquement
  `opacity`, `scale`, `translate`). Aucune correction individuelle par entrée.
- **Tests** — `motion.test.ts` › « menu et lumière partagent une seule famille
  de mouvement » et « le menu téléphone n'a qu'une seule chorégraphie » ;
  `guardrails.spec.ts` › « « Langue » et les entrées-liens partagent la même
  primitive » ; `interactions.spec.ts` › « aucun mouvement vertical parasite ».
- **Commande** — `bun run test && bun run test:e2e`.

## 4. Soulignement solidaire du texte

- **Symptôme** — le filet débordait de la capsule arrondie lors de l'activation.
- **Cause réelle** — le filet suivait la translation du libellé.
- **Couche** — `src/styles.css` (`nav-link-z::after`, `focal-list`).
- **Règle** — seul le libellé glisse. Le filet est ancré à la capsule et dérive
  de `--cap-pad` (largeur utile interne).
- **Test** — `guardrails.spec.ts` › « le soulignement reste ancré dans la
  capsule pendant le mouvement » ; `interactions.spec.ts` › « le soulignement
  reste contenu dans la capsule ».
- **Commande** — `bunx playwright test tests/e2e/guardrails.spec.ts`.

## 5. Capsules qui n'épousent pas leur contenu

- **Symptôme** — « L'univers ZELOR » cassé sur deux lignes, capsule
  disproportionnée sur petits écrans.
- **Cause réelle** — largeur imposée et absence de `white-space: nowrap`.
- **Couche** — `src/styles.css` (`menu-row`, `nav-link-z`), `NavLink.tsx`.
- **Règle** — la capsule = texte + deux `--cap-pad`, jamais davantage ; libellé
  toujours sur une ligne, jamais plus large que la feuille.
- **Test** — `guardrails.spec.ts` › « aucun libellé cassé à 320/360/412 px » ;
  `interactions.spec.ts` › « capsules desktop : largeur épousant le libellé ».
- **Commande** — `bunx playwright test tests/e2e/guardrails.spec.ts`.

## 6. Contrôle d'apparence : astre inversé, libellé ambigu

- **Symptôme** — lune affichée en thème clair, libellé « Apparence » visible.
- **Cause réelle** — opacités des icônes inversées dans `theme-toggle-z` et
  libellé texte rendu à côté du bouton.
- **Couche** — `src/styles.css`, `src/components/zelor/AppearanceControl.tsx`.
- **Règle** — clair (manuel ou système) → soleil ; sombre (manuel ou système) →
  lune ; un seul contrôle dans le header ; aucun libellé visible « Apparence »
  (l'état actif est nommé dans `aria-label`).
- **Tests** — `guardrails.spec.ts` › quatre états (manuel et système) + absence
  de contrôle concurrent ; `interactions.spec.ts` › astre manuel et centrage.
- **Commande** — `bunx playwright test tests/e2e/guardrails.spec.ts`.

## 7. Filet de progression doré

- **Symptôme** — tête lumineuse tronquée, position de lecture peu lisible.
- **Cause réelle** — `overflow: hidden` sur `progress-z` rognait le halo de
  l'extrémité.
- **Couche** — `src/styles.css` (`progress-track-z`, `progress-z`).
- **Règle** — trois couches distinctes : piste discrète, progression réelle
  (largeur pilotée par le scroll), lumière décorative en aller-retour continu
  (`infinite alternate`), plus une tête d'éclat ancrée à l'extrémité réelle.
  La décoration ne remplace jamais la mesure ; `prefers-reduced-motion` la
  neutralise.
- **Tests** — `motion.test.ts` › « le filet doré garde ses trois couches » ;
  `guardrails.spec.ts` › « la progression suit le scroll, la tête d'éclat le
  marque ».
- **Commande** — `bun run test && bunx playwright test tests/e2e/guardrails.spec.ts`.

---

## Intégration continue (activation manuelle côté GitHub)

`.github/workflows/quality.yml` reproduit le chemin obligatoire : build, types,
lint, tests unitaires, tests navigateur et visuels, revue des dépendances.

À activer manuellement dans GitHub (aucune action automatique n'est faite ici) :

1. Settings → Actions → autoriser les workflows du dépôt.
2. Settings → Branches → règle de protection sur `main` : exiger les checks
   `quality` et `dependency-review`, exiger une revue, interdire le push direct.
3. Settings → Code security → activer Dependabot (alertes + mises à jour) ;
   `dependency-review-action` n'agit que sur les dépôts où il est autorisé.
4. Conserver `workers: 2` sur le runner : au-delà, le rendu de texte devient
   instable et les captures produisent de faux positifs.
