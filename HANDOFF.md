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
- **Recherche** : ouverte *dans* le header via `slot-z` (animation de
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
- **Thème** (`src/lib/zelor/theme.ts` + `ThemeToggle.tsx`) : voir ci-dessous.

## 5. Mode clair / sombre

- Source unique : la classe `light` / `dark` sur `<html>`, plus
  `style.colorScheme`. Les jetons de nuit vivent dans `:root.dark`.
- `THEME_INIT_SCRIPT` (exporté par `theme.ts`) est injecté en tête de document
  par `__root.tsx` : il lit `localStorage["zelor-theme"]`, sinon la préférence
  système, et pose la classe **avant le premier rendu** → aucun flash.
  `<html>` porte `suppressHydrationWarning` pour cette raison.
- `useTheme()` (`useSyncExternalStore`) fournit un état unique partagé : un seul
  bouton dans le header, identique sur desktop, tablette et mobile — aucune
  variante à synchroniser.
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
