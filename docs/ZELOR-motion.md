# ZELOR — Système de mouvement & contrôle anti-régression

## 1. Principes

- **Tokens uniques** : durées `--dur-1…5`, courbes `--ease-lux`, `--ease-enter`,
  `--ease-exit`, `--ease-enter-mirror`. Aucun `cubic-bezier` ni `duration-[Xms]`
  écrit en dur dans un composant.
- **Propriétés indépendantes** : les micro-réponses utilisent `translate`,
  `scale`, `rotate` — jamais `transform`. Ainsi une rotation d'état (loupe
  ouverte) et un survol ne s'écrasent plus mutuellement.
- **Boomerang** : toute entrée a une sortie de la même famille, même durée,
  courbe miroir (`unfold-z` / `unfold-out-z`, `panel-in` / `panel-out`,
  `overlay-in` / `overlay-out`).
- **Primitive « bulle »** : `discover-bar-z` est la référence canonique
  (glissement doux depuis le bord, retrait par le même chemin). Les surfaces
  flottantes en héritent.

## 2. Primitives centralisées (`src/styles.css`)

| Utilitaire | Rôle |
| --- | --- |
| `tactile-z` / `tactile-lift-z` | physique premium (élévation, tassement, focus) |
| `press-z` | réponse d'appui simple |
| `utility-z` / `utility-icon-z` | utilitaires du header (fond + icône) |
| `unfold-z` / `unfold-out-z` | déploiement / repli d'une surface (recherche) |
| `panel-in` / `panel-out` | panneaux flottants (langue) |
| `overlay-in` / `overlay-out` | menu mobile, voiles |
| `collapse-out-z` | repli d'une bande (barre d'annonce) |
| `discover-bar-z` | bulle « Découvrir » |
| `focal-list` + `data-focal` | lecture focale d'une liste |
| `seam-z` | césure lumineuse entre couches marine |
| `progress-track-z` / `progress-z` | filet de progression joaillier |
| `reveal-z` | apparition au défilement (`Reveal`, option `replay`) |

## 3. Continuité chromatique

Header, barre d'annonce et recherche partagent `--gradient-header`,
`blur(var(--blur-veil)) saturate(135%)` et les mêmes mélanges
`--navy-deep` / `--navy` / `--navy-soft`. Aucune couleur locale.

## 4. Checklist anti-régression

À rejouer avant toute livraison (`bunx vitest run` couvre les points marqués ✅) :

- ✅ Aucun `cubic-bezier(` en dur dans `src/components` et `src/routes`.
- ✅ Aucune micro-interaction basée sur `transform:` dans les primitives tactiles.
- ✅ Chaque animation d'entrée a sa sortie déclarée.
- ✅ `discover-bar-z`, `seam-z`, `focal-list`, `progress-z` présents.
- Header : la loupe pivote de façon continue (ouverture ET survol simultanés).
- Recherche : ouverture et fermeture de durée identique, sans saut de scroll.
- Menu mobile : tous les items (Collection, Compte, Aide, Langue) portent
  `data-focal` et réagissent identiquement.
- Panier : le compteur respire à l'ajout, l'icône répond au survol.
- Médias : lecture au survol sur desktop, à la visibilité sur tactile.
- `prefers-reduced-motion` : plus aucun déplacement, contenu visible.
