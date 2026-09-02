# Mission — rapprocher zelor de verostudio.com

Tu reprends un site marchand déjà en production. Le propriétaire veut qu'il ressemble
le plus possible à **https://www.verostudio.com/**, dont il admire la composition.

Trois commits ont déjà engagé ce rapprochement (`82cb1cd`, `bb17f00`, `c2e7e0b`).
Ce document contient les **relevés réels** de verostudio.com, mesurés au navigateur à
1440 × 900, l'état exact du dépôt, et ce qui reste à faire. Ne re-mesure pas ce qui est
déjà noté ici ; va vérifier au navigateur ce qui ne l'est pas.

---

## 1. Le dépôt

- **GitHub** : `X99X99/zelor`, branche `main`, dépôt **privé**. Commit de départ : `c2e7e0b`.
- **Pile** : TanStack Start v1 (React 19, SSR), Vite 8, Tailwind CSS **v4**, TypeScript, bun.
- **Déploiement** : Lovable republie depuis GitHub. Un build cassé casse le site en ligne.

### Où sont les choses

| Fichier | Rôle |
| --- | --- |
| `src/styles.css` | **Toute** la configuration Tailwind (`@theme inline`, `@utility`). Il n'y a pas de `tailwind.config.js` — n'en crée pas. |
| `src/routes/index.tsx` | Page d'accueil |
| `src/components/zelor/Page.tsx` | `PageShell` + `Section` — gabarit des 14 pages éditoriales |
| `src/components/zelor/Reveal.tsx` | Apparition au défilement (IntersectionObserver, pose `data-visible`) |
| `src/components/zelor/SplitReveal.tsx` | Titre révélé mot à mot, accent italique noté `*ainsi*` |
| `src/components/zelor/HeroScroll.tsx` | Ouverture épinglée, pilotée par la variable CSS `--p` |
| `src/components/zelor/HeroFrame.tsx` | L'image logée entre les deux lignes du titre. Sert la photographie `zelor-hero`, et sait recevoir une séquence en trois temps. |

**Les images de l'ouverture.** `HeroMedia.tsx` et les vidéos `public/hero/hero.webm`
et `public/hero/hero.mp4` ont été supprimés au commit `b902b81` : plus rien ne les
rendait depuis `c2e7e0b`. La page d'accueil sert désormais l'unique photographie
`zelor-hero`, déclinée en quatre largeurs et trois formats (AVIF, WebP, JPEG).

`HeroFrame` est préparé pour une séquence en trois temps — **matière, détail,
pièce** — dont les fichiers n'existent pas encore. `STAGE_ASSETS` les déclare à
`null`, et le composant se replie sur la photographie actuelle tant qu'ils
manquent : une seule `<picture>`, aucune requête supplémentaire.

**Aucune 3D n'est utilisée : ni WebGL, ni Three.js, ni modèle.** Les assets à venir
devront être **originaux, fournis par ZELOR et légalement exploitables**. Ne rien
télécharger, ne rien reprendre d'un autre site.

---

## 2. Contraintes dures — les lire avant d'écrire une ligne

Ce sont des choses qui ont déjà coûté des heures sur ce projet. Elles ne sont pas
négociables.

1. **Le formatage est une erreur bloquante.** ESLint tourne avec
   `eslint-plugin-prettier/recommended` : tout écart Prettier fait échouer `lint`.
   Réglages : `printWidth: 100`, guillemets doubles, points-virgules, virgules finales.
   **Lance `bun run lint` avant chaque commit** — ne te fie pas à ton jugement sur le
   formatage JSX, il est piégeux (Prettier casse une balise dont le contenu est mixte
   texte + élément, mais garde ce contenu sur une seule ligne de remplissage).

2. **TypeScript est en mode strict avancé** : `exactOptionalPropertyTypes`,
   `noUncheckedIndexedAccess`, `noPropertyAccessFromIndexSignature`. Un accès indexé
   renvoie `T | undefined` — il faut le garder.

3. **N'ouvre jamais `src/integrations/**` ni `src/routes/lovable/**`.** Ces fichiers sont
   régénérés par Lovable et sont exclus d'ESLint et de Prettier exprès. Les modifier
   déclenche une boucle de conflits.

4. **`--dur-panel-out: 260ms`** (dans `src/styles.css`) est couplé au délai de démontage
   d'un composant React. Le changer désynchronise l'animation et le démontage.
   Ne le touche pas.

5. **Tests qui doivent rester verts** :
   - `tests/e2e/guardrails.spec.ts` — accessibilité, signature de mouvement, liens.
   - `tests/e2e/interactions.spec.ts` — notamment le test ligne 274 : la page d'accueil
     doit contenir `main a[href="/univers"]` dont le texte est « L'univers ZELOR »,
     **rendu sur une seule ligne**.
   - `tests/e2e/visual.spec.ts` est ignoré sauf si le verrou Chromium
     (`tests/e2e/browser-lock.json`) est satisfait. Ne compte pas dessus en CI.

6. **Chaîne d'intégration** (`.github/workflows/quality.yml`) :
   `lint → typecheck → test → build → test:e2e`. Fais tourner l'équivalent en local :

   ```bash
   bun run lint && bun run typecheck && bun run test && bun run build
   ```

---

## 3. Relevés de verostudio.com

Mesurés au navigateur, page d'accueil, 1440 × 900. Ce sont des faits, pas des
impressions.

### 3.1 Caractères

| Rôle | Fonte | Graisses relevées |
| --- | --- | --- |
| Tout le display + le corps de texte | **Louize Display** (serif) | 400 romain, 400 italique |
| Paragraphe d'accroche uniquement | **Beausite Classic** (grotesque) | 400, 500 |

**Les deux sont des licences commerciales.** Elles ne peuvent pas être livrées sans
achat. Le dépôt utilise aujourd'hui **Cormorant Garamond** (display) et **Manrope**
(sans), servis par Google Fonts depuis `src/routes/__root.tsx`.

Si le propriétaire achète les licences, la substitution se fait dans
`src/styles.css` (`--font-display`, `--font-sans`) et `__root.tsx`. **N'héberge pas
ces fontes sans licence.**

### 3.2 Échelle typographique

L'interlignage vaut **1,00 partout**, du titre géant au libellé de 15 px. L'approche
**croît quand le corps décroît** — c'est une échelle optique, et c'est le point que la
plupart des imitations ratent.

| Corps | Interlignage | Approche | Casse | Rôle |
| --- | --- | --- | --- | --- |
| 168 px | 1,00 | normale | CAPITALES | titre d'ouverture |
| 120 px | 1,00 | normale | CAPITALES | titre de section majeur (variantes romaine et italique) |
| 93,6 px | 1,00 | −0,01 em | CAPITALES | liens du menu plein écran |
| 67,7 px | 1,00 | normale | CAPITALES | palier intermédiaire |
| 30 px | 1,06 | −0,02 em | bas-de-casse | **accroche, en Beausite 500** — seule chose non composée en serif |
| 21 px | 1,00 | normale | CAPITALES | intertitres |
| 18 px | 1,50 | +0,02 em | bas-de-casse | corps de texte courant, et navigation |
| 16 px | 1,10 | +0,04 em | CAPITALES | libellés de rubrique |
| 15 px | 1,00 | +0,06 em | CAPITALES | libellés fins |

**La construction de tous leurs titres** : une ligne de capitales romaines qu'un seul
mot en bas-de-casse italique vient contredire. L'exception fait l'accent — deux mots
penchés et il n'y a plus d'accent.

### 3.3 Couleur

- Papier : `#F3F0ED` (blanc chaud et gris)
- Encre : `#181615` (noir chaud, jamais pur)
- **Aucune couleur d'accent dans l'interface.** L'accent vient uniquement des images
  (terre cuite, dans leur cas).

### 3.4 Structure et densité

| Mesure | Valeur |
| --- | --- |
| Hauteur du document | 15 031 px, soit **16,7 écrans** |
| `<main>` | 14 178 px sur 9 blocs : 900 / 2700 / 3840 / 290 / 2410 / 290 / 1268 / 1374 / 230 |
| Pied de page | 852 px — **presque un écran entier**, fond transparent, même encre, padding `30px 0 16px`, aucune image |
| En-tête | `position: fixed`, 75 px, `padding: 30px 0 0`, fond **transparent**, `z-index: 299` |
| Écran de chargement | un bloc de 900 px avant l'en-tête, `position: fixed`, `z-index: 9999` |
| Images | **35** dans `main`, 0 vidéo, 1 canvas WebGL |
| Colonne de contenu | **450 px** de large, contre un média plein cadre |

À comparer : la page d'accueil de zelor a 8 sections, **5 images**, et plus de mots par
section (43 contre 31). Le rapport est inversé — c'est le déséquilibre principal.

### 3.5 Mouvement

- **Aucune librairie.** Pas de Lenis, pas de GSAP exposé en global,
  `scroll-behavior: auto`, `cursor: auto`, **zéro curseur sur mesure**. Tout l'effet
  vient de la composition. Ne va pas installer une librairie de défilement.
- **Dix-neuf courbes déclarées**, sous les noms canoniques de Penner
  (`ease-out-quart`, `ease-out-expo`…). Ce n'est pas leur nombre qui compte, c'est que
  ce sont des noms partagés. Brunello Cucinelli en déclare six, sous les mêmes noms.
- Durées réellement employées : **300 ms** au survol, **600–650 ms** pour les
  transformations, **1200–1400 ms** pour les révélations longues, **1600 ms** pour
  l'ouverture des images.
- Décalage entre éléments d'une cascade : **100 ms**, sans délai initial.

**Le masque par ligne** — leur geste le plus systématique. Chaque bloc de texte est un
`span` en `overflow: hidden` contenant un `span` translaté de **exactement sa propre
hauteur de ligne** : `translateY(31,8px)` pour un interlignage de 32, `translateY(27px)`
pour 27, `translateY(21px)` pour le libellé d'un bouton. Le dépôt fait aujourd'hui ce
masque **par mot** (`SplitReveal`) ; eux le font **par ligne**.

### 3.6 L'ouverture — leur geste signature

Le titre n'est pas posé sur une image : **il l'entoure**.

```
section  hauteur 2700 px  (3 écrans)
└── div  position: fixed, hauteur 100vh, overflow: clip
    ├── canvas WebGL 1440 × 900
    ├── span "première ligne"   position: absolute, top 450 px, translateY(−120 px)
    └── span "seconde ligne"    position: absolute, top 604 px
```

Le défilement ne fait pas descendre la page : il fait **grandir l'image** jusqu'à ce
qu'elle passe derrière les mots.

Chez eux la scène est rendue en WebGL. Le dépôt la reproduit en CSS
(`HeroScroll.tsx` + `.hero-scroll-z` dans `styles.css`) : section de **320 vh** dont
**220 vh de course utile**, un contenu collant de **100 svh**, et une seule variable
`--p` de 0 à 1 écrite par un écouteur de défilement throttlé en
`requestAnimationFrame`. **Garde cette approche** — elle donne le même
résultat sans Three.js ni seconde de chargement.

---

## 4. Ce qui est déjà fait

### `82cb1cd` — le serif pour lire, le sans pour agir
Italique chargée, `display-hero-z`, `prose-z` (corps de texte en serif), graisse 300.

### `bb17f00` — le mouvement
Gamme canonique d'accélérations (`--ease-out-quad/cubic/quart/quint/expo`,
`--ease-in-out-quart/expo`), durées `--dur-touch: 300ms` / `--dur-move: 650ms` /
`--dur-reveal: 1200ms`, `--stagger-step: 100ms`. `SplitReveal` (masque par mot).
`clip-reveal-z` (ouverture d'image par rognage, 1600 ms). Les anciennes courbes
(`--ease-lux`, etc.) restent définies : le menu et les panneaux gardent une
chorégraphie déjà validée.

### `c2e7e0b` — la composition
Titres en **capitales** avec interlignage 1,00 (`h1, h2, h3` dans la couche de base),
exception `h1 em, h2 em, h3 em, .accent-z` pour le mot penché. Six paliers en
utilitaires : `display-hero-z`, `display-1-z`, `display-2-z`, `subhead-z`, `lead-z`,
`label-z`. `eyebrow` repassé de 11 px / 0,18 em à 15 px / 0,06 em en serif.
Papier à `#F3F0ED`. Ouverture épinglée (`HeroScroll` + `HeroFrame`).
**L'encre reste marine** — c'est la couleur de la maison, pas celle de Vero, et le
propriétaire ne l'a jamais remise en cause.

**Rien de tout cela n'a été compilé ni vu en ligne.** L'environnement de travail
n'avait ni Node ni bun. **Ta première tâche est de faire tourner la chaîne complète et
de réparer ce qui casse.**

---

## 5. Ce qui reste, par ordre de rendement

### Priorité 1 — vérifier l'existant
Lancer `lint`, `typecheck`, `test`, `build`, `test:e2e`. Corriger. En particulier :
- le formatage JSX des composants créés à la main (`HeroScroll`, `HeroFrame`,
  `SplitReveal`, `Page`) ;
- l'ouverture épinglée sur mobile, où l'image monte à 34 vw au repos ;
- les capitales sur les pages juridiques (CGV, mentions légales), où un intertitre de
  21 px en capitales peut devenir lourd sur des titres longs.

### Priorité 2 — la densité d'images
**35 images chez eux, 5 ici.** C'est l'écart structurel le plus visible, et aucun
réglage typographique ne le compense. Cinq des huit sections de la page d'accueil n'ont
aucune image. Propose une trame éditoriale image/texte plutôt que d'ajouter des images
au hasard.

### Priorité 3 — le masque par ligne
Remplacer le masque par mot de `SplitReveal` par un masque par ligne, translaté de la
hauteur de ligne exacte. Conserver l'accent italique noté `*ainsi*` et le respect de
`prefers-reduced-motion`. Le texte doit rester dans le DOM au rendu serveur et se lire
d'un trait pour un lecteur d'écran.

### Priorité 4 — le menu plein écran
Liens à 93,6 px en capitales serif, approche −0,01 em, ouverture en cascade de 100 ms.
Un en-tête fixe de 75 px, fond transparent, `padding: 30px 0 0`.

### Priorité 5 — le pied de page d'un écran
852 px chez eux, contre un pied de page ordinaire ici. C'est une page de fin, pas une
barre de liens.

### Priorité 6 — l'écran de chargement
Un bloc plein écran avant l'en-tête. **Attention** : un écran de chargement dégrade le
LCP et peut coûter en référencement et en conversion. À ne faire qu'avec l'accord
explicite du propriétaire, et à ne jamais bloquer plus de ce que le chargement réel
exige.

---

## 6. Ce qu'il ne faut pas faire

- **Ne copie ni leurs images, ni leurs textes, ni leurs fontes.** Ce qui se transporte
  est le système de composition : l'échelle, les capitales, les masques, la structure.
  Le reste appartient à leur maison.
- N'installe pas de librairie de défilement : ils n'en ont pas.
- Ne crée pas de `tailwind.config.js`.
- Ne pousse pas de secret. Le dépôt est privé, mais `.env` n'y a sa place que pour des
  clés publiables préfixées `VITE_`.
- Ne force jamais un `git push`. En cas de rejet, `git pull --rebase`.

---

## 7. Points ouverts côté propriétaire — ne pas essayer de les résoudre en code

- Le site en ligne (`zelor.lovable.app`) est resté au commit `82cb1cd` : les deux
  derniers envois n'ont pas été republiés. À vérifier dans Lovable avant de juger
  quoi que ce soit à l'œil.
- Aucun produit n'est publié sur le canal de vente qui alimente le site.
- Aucun domaine acheté ; `SITE_ORIGIN` dans `src/lib/zelor/site.ts` et
  `public/robots.txt` devront être mis à jour le jour venu.
- Les formulaires de contact et d'inscription n'envoient rien.
