# ZELOR — Passation technique

Document unique de reprise. Le site est finalisé : la direction visuelle, le motion
et les surfaces sont validés. Toute modification future doit être additive et
vérifiée contre les invariants listés en fin de document.

## 1. Stack et commandes

- TanStack Start v1 (React 19, SSR) + Vite 7, TypeScript, Tailwind CSS v4 (config
  entièrement dans `src/styles.css`, pas de `tailwind.config.js`), shadcn/ui
  disponible dans `src/components/ui`, lucide-react pour les icônes.
- Pas de backend : le catalogue est statique, le panier vit en `localStorage`.

```bash
bun install
bun run dev        # http://localhost:8080
bun run build      # build de production
bunx vitest run    # tests (garde-fous de design system)
bun run lint
```

## 2. Structure

- `src/routes/__root.tsx` — shell HTML, métadonnées globales, JSON-LD,
  script d'initialisation du thème, `SiteHeader` / `main#contenu` / `SiteFooter` /
  `CookieConsent`, transition de page (`page-in`).
- `src/routes/*.tsx` — une page par route : `index`, `collection`, `nouveautes`,
  `produit.$slug`, `panier`, `compte`, `univers`, `journal`, `a-propos`,
  `qualite`, `aide`, `contact`, `livraison`, `retours`, `paiements`,
  `suivi-commande`, `cgv`, `mentions-legales`, `confidentialite`, `cookies`.
  `src/routeTree.gen.ts` est généré : ne jamais l'éditer.
- `src/components/zelor/` — `SiteHeader`, `SiteFooter`, `NavySurface`,
  `ThemeToggle`, `ProductCard`, `HoverVideo`, `Reveal`, `Page`, `Breadcrumbs`,
  `Newsletter`, `CookieConsent`, `Placeholder`.
- `src/lib/zelor/` — `content.ts` (marque, navigation, catalogue, textes),
  `cart.tsx` (contexte panier persistant), `theme.ts` (thème clair/sombre),
  `motion.test.ts` (tests de non-régression du design system).

## 3. Tokens et design system — `src/styles.css`

Tout est centralisé dans ce fichier, dans cet ordre :

- `:root` — couleurs (oklch : ivoire, crème, minéral, marine `--navy`/`--navy-deep`,
  or discret), rayons (`--radius`, `--radius-panel`, `--radius-sheet`,
  `--radius-media`, `--radius-media-lg`), ombres (`--shadow-elegant`),
  gradients (`--gradient-navy`, `--gradient-header`, `--gradient-cta-glass`),
  surfaces partagées (`--surface-navy-bg`, `--surface-navy-veil`, `--surface-floor`).
- Durées et courbes : `--dur-1`…`--dur-5`, `--ease-lux`, `--ease-enter`,
  `--ease-enter-mirror`, `--ease-back` (boomerang), `--ease-breathe`.
  Aucune valeur `cubic-bezier` en dur ailleurs — un test l'interdit.
- `:root.dark` — nuit ZELOR : uniquement des niveaux de couleur, aucune primitive
  ni animation redéfinie.
- Typographies : Cormorant Garamond (`font-display`, titres) et Manrope (corps),
  chargées via `<link>` dans `__root.tsx` (jamais via `@import` distant).
- Primitives de motion et de matière (utilities Tailwind v4) :
  `surface-navy`, `grain-z`, `sheen-z`, `veil-top`, `seam-z`, `shoreline-z`,
  `unfold-z` / `unfold-out-z`, `slot-z` / `slot-in-z` / `slot-out-z`,
  `panel-navy` / `panel-in` / `panel-out`, `overlay-in` / `overlay-out`,
  `sheet-z`, `focal-list`, `menu-row`, `reveal-z`, `stagger-z`, `page-in`,
  `tactile-z`, `press-z`, `utility-z`, `utility-icon-z`, `wordmark-z`,
  `progress-z`, `discover-bar-z`, `btn-lux`, `btn-veil`, `chip-z`, `input-z`,
  `theme-toggle-z`.
- Un bloc `prefers-reduced-motion: reduce` en fin de fichier neutralise les
  mouvements décoratifs : toute nouvelle animation doit y être ajoutée.

## 4. Logique des blocs sensibles

- **Header** (`SiteHeader.tsx`) : `NavySurface as="header"` collant, masqué au
  défilement descendant / révélé au montant (`useHideOnScroll`), dissolution
  progressive via `header-motion-z`. **Motion validé : ne pas y toucher.**
- **Barre d'annonce** : à l'intérieur de la même surface marine (`veil-top`,
  `seam-z`), fermeture animée (`collapse-out-z`) avant démontage.
- **Recherche** : ouverte _dans_ le header via `slot-z` (animation de
  `grid-template-rows` 0fr → 1fr) et `NavySurface material={false}` — elle
  hérite de la matière du header et ne repeint jamais un second gradient.
  Fermeture symétrique, démontage après `NAVY_SURFACE_EXIT_MS`.
- **Menu mobile** : feuille flottante `sheet-z` + `overlay-navy`, blocage du
  défilement de fond (body `position: fixed`) avec restitution exacte de la
  position au retour, comportement focal (`focal-list` / `menu-row`).
- **CTA et bulles** : `btn-lux` / `btn-veil` (verre liquide, `backdrop-filter`),
  capsule flottante « Découvrir » (`discover-bar-z`) sur les cartes produit.
- **Pied de page** : `shoreline-z` assure la montée progressive du marine —
  la couleur finale du dégradé doit rester `--surface-floor`.
- **Thème** (`src/lib/zelor/theme.ts` + `AppearanceControl.tsx`) : voir ci-dessous.

## 5. Mode clair / sombre

- Source unique : la classe `light` / `dark` sur `<html>`, plus
  `style.colorScheme`. Les jetons de nuit vivent dans `:root.dark`.
- `THEME_INIT_SCRIPT` (exporté par `theme.ts`) est injecté en tête de document
  par `__root.tsx` : il lit `localStorage["zelor-theme"]`, sinon la préférence
  système, et pose la classe **avant le premier rendu** → aucun flash.
  `<html>` porte `suppressHydrationWarning` pour cette raison.
- `useTheme()` (`useSyncExternalStore`) fournit un état unique partagé. Le
  header ne porte **qu'un seul** contrôle visible d'apparence,
  `AppearanceControl` : soleil en clair, lune en sombre, icône centrée, cible
  44 px. Il ouvre une liste à trois états — « Lumière claire »,
  « Profondeur marine », « Suivre le système » — fermable au clic extérieur ou
  à Échap. Ne jamais ajouter un second bouton concurrent (ex. retour au mode
  système) : tout passe par ce composant.
- Le choix manuel est persistant et prioritaire ; la préférence système ne sert
  qu'au premier chargement.
- Les icônes soleil/lune sont pilotées en CSS (`theme-toggle-z`), jamais par un
  état JS, pour éviter tout décalage d'hydratation.
- La transition de thème est limitée aux couleurs et surfaces (`--theme-fade`),
  n'affecte aucune géométrie, ne rejoue pas les animations du header et est
  neutralisée sous `prefers-reduced-motion`.

## 6. Tests et non-régression

- `bunx vitest run` — `src/lib/zelor/motion.test.ts` verrouille : interdiction
  des `cubic-bezier` en dur hors tokens, continuité chromatique du système
  marine, existence des surfaces partagées, absence de `surface-search`,
  présence des jetons de nuit dans `:root.dark`, easings `--ease-back` /
  `--ease-breathe`.
- Après toute modification, vérifier : build OK, tests verts, scroll stable lors
  des changements de route, ouverture/fermeture de la recherche sans saut de
  layout, retour du menu mobile à la position de lecture exacte, absence de
  flash de thème au rechargement, navigation clavier et `focus-visible`.

## 7. Invariants visuels

1. Le motion du header (masquage, dissolution, seuils) est validé — intouchable.
2. Continuité marine annonce → header → recherche : une seule matière peinte,
   jamais de gradient superposé.
3. Rivage de bas de page continu (`shoreline-z`, `--surface-floor`).
4. Surfaces premium : flou, grain, halos et opacités réutilisent les jetons
   existants — jamais de valeur approchante redéfinie localement.
5. Motion doux, durées et courbes issues des tokens, sorties en miroir des
   entrées.
6. Responsive intégral (mobile → desktop) et accessibilité : cibles ≥ 44 px,
   `aria-label` sur les boutons-icônes, `prefers-reduced-motion` respecté.

## 8. Tests et non-régression

Deux suites, deux outils, aucune superposition :

- **Unitaires** — `bun run test` (Vitest, `src/**/*.test.ts`) : thème, i18n,
  intégrations, grammaire de motion.
- **Navigateur** — `bun run test:e2e` (Playwright, `tests/e2e/*.spec.ts`),
  projets `desktop` (1280×900) et `mobile` (Pixel 7) :
  - `visual.spec.ts` : non-régression visuelle du header (fermé / recherche
    ouverte), du footer et du menu mobile, en thème clair **et** sombre, plus
    une comparaison de parité structurelle clair / sombre.
  - `interactions.spec.ts` : lien de page active (remontée sans nouvelle
    entrée d'historique), navigation, recherche, persistance et réglage
    « Système » du thème, menu mobile et restitution du scroll, accès panier,
    absence d'erreur console, premier `Tab` sur le lien d'évitement.

Déterminisme des captures (`tests/e2e/fixtures.ts`) : animations et transitions
figées, `prefers-reduced-motion: reduce`, thème imposé avant le premier rendu,
consentement cookies pré-accordé, attente de l'hydratation et des polices,
année du pied de page neutralisée.

Baselines : `tests/e2e/baselines/`. Elles se mettent à jour **volontairement**
via `bun run test:visual:update`, après vérification visuelle du diff — jamais
pour faire taire un échec.

Parallélisme : `playwright.config.ts` fixe `workers: 2`. Au-delà, la contention
CPU altère le rendu du texte et rendait les captures de fin de page instables.

Rendu de référence verrouillé : `tests/e2e/browser-lock.json` fixe la version
de navigateur avec laquelle les baselines ont été produites, et
`tests/e2e/browser.ts` refuse de lancer la suite avec un autre moteur.
`ZELOR_CHROMIUM_PATH` peut désigner le chemin du binaire, mais sa version reste
vérifiée. Sont également verrouillés : viewport, captures en pixels CSS,
locale `fr-FR`, fuseau `Europe/Paris`, flags de rendu de texte, chargement
**vérifié** des polices, header masqué pendant les captures assemblées.

Garde-fous permanents (symptôme → cause → règle → test → commande) :
voir **[QUALITY_GUARDRAILS.md](./QUALITY_GUARDRAILS.md)**, ainsi que
`tests/e2e/guardrails.spec.ts` (thème et motion, menu mobile, soulignement,
capsules et libellés longs, contrôle d'apparence, filet de progression) et
`.github/workflows/quality.yml` (à activer manuellement dans GitHub).

Contrôle complet avant mise en ligne : `bun run preflight`
(lint → typecheck → tests unitaires → build → tests navigateur, captures et
garde-fous inclus).

## 8 bis. Traitement d'un problème visuel signalé

Un problème visuel signalé par le propriétaire du site est **un écart réel**,
même si tous les tests sont verts. Procédure obligatoire :

1. reproduire le problème dans le rendu réel (bon thème, bon viewport, bon état) ;
2. inspecter le DOM, les styles calculés, la cascade, les wrappers, les médias
   et les états interactifs ;
3. identifier la cause technique réelle ;
4. corriger au bon niveau — primitive ou token — jamais par un patch local ;
5. ajouter ou renforcer le test qui aurait dû détecter l'erreur, et l'inscrire
   dans QUALITY_GUARDRAILS.md ;
6. vérifier visuellement puis exécuter `bun run preflight`.

Ne jamais clore un sujet en concluant « le code est déjà conforme » tant que le
rendu observé par le propriétaire reste incorrect.

## 9. Contrats visuels et interactions protégées

Ces comportements sont **validés**. Toute modification qui les altère est une
régression, même si elle « paraît mieux ». Ils sont couverts par des tests :
un échec signifie qu'il faut corriger le code, pas le test.

1. **Header et son motion** (masquage au défilement, dissolution, seuils,
   `header-motion-z`) : validés, ne pas réinterpréter.
2. **Continuité marine annonce → header → recherche** : une seule matière
   peinte. La recherche hérite de `NavySurface` (`material={false}`) et ne doit
   jamais introduire un second gradient (test « continuité marine »).
3. **Menu mobile** : l'entrée « Langue » est l'étalon de mouvement. Une entrée-
   lien ne porte aucune géométrie propre : `nav-link-z` neutralise display,
   padding et transitions pour `data-variant="sheet"`, la ligne hérite
   intégralement de `menu-row`. Aucun rebond ni remontée parasite au retour.
4. **Soulignement mobile** : contenu dans la capsule (`inset-inline: 0.9rem`,
   `bottom: 0.55rem`), même épaisseur et même rythme sur toutes les entrées.
   Aucun `overflow: hidden` sur la ligne : le focus clavier doit rester visible.
5. **Liens actifs et logo** : une seule primitive, `useSameRouteTop` dans
   `src/components/zelor/NavLink.tsx`, utilisée par `NavLink` (header, feuille,
   footer) et par `BrandLink` (logos header et footer). Page déjà active →
   remontée douce, sans navigation, sans entrée d'historique, sans changement
   d'URL, `prefers-reduced-motion` respecté. Ne jamais créer une seconde
   implémentation ni un second lien « retour en haut ».
6. **Thèmes clair / sombre et préférence système** : tri-état persistant,
   script anti-flash, parité structurelle clair/sombre — protégés par tests.

Avant toute livraison : `bun run preflight`
(lint → typecheck → tests unitaires → build → tests navigateur).
Si Chromium système est requis : `ZELOR_CHROMIUM_PATH=$(readlink -f /bin/chromium)`.

Toute régression visuelle se corrige **avant** fusion. Une baseline ne se met à
jour que pour un changement visuel intentionnel, revu, et justifié en une phrase
dans le message de commit : jamais pour faire taire un échec.
