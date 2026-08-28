# ZELOR — base de boutique : à remplacer avant publication

Rien ne doit être publié tant que les points ci-dessous ne sont pas validés par un humain.

## 1. Contenus provisoires (repérables dans l'interface)

Tous les blocs beiges « À valider / Placeholder / Démonstration / Brouillon » et tous les
marqueurs `[... À RENSEIGNER]` sont provisoires.

| Emplacement                                                                   | À remplacer                                       |
| ----------------------------------------------------------------------------- | ------------------------------------------------- |
| `src/lib/zelor/content.ts` → `DEMO_PRODUCTS`                                  | catalogue réel (Shopify)                          |
| `PLACEHOLDER` (prix, devise, délais, frais, adresse, email, statut juridique) | données réelles                                   |
| Accueil — hero, storytelling, éditorial                                       | textes validés + photos officielles               |
| Accueil — section Qualité                                                     | détails de qualité, matière, conception confirmés |
| Fiche produit — caractéristiques, FAQ, bénéfices                              | informations fournisseur vérifiées                |
| Journal                                                                       | articles rédigés                                  |
| Mentions légales, CGV, Confidentialité, Cookies, Retours                      | rédaction et validation juridiques                |
| Visuels `src/assets/*`                                                        | photographies de marque (WebP/AVIF)               |

## 2. Informations à collecter

Catégorie exacte · produits · prix · fournisseurs · pays d'expédition · délais · frais de port ·
adresse de retour · composition/matériaux · origine · garanties · photos · email professionnel ·
statut juridique · conditions de remboursement · politique de confidentialité · langues publiées ·
trois arguments différenciants · client cible définitif · ton de marque définitif.

## 3. Branchements Shopify restants

- Produits, variantes, prix, stocks, collections via Storefront API (remplace `DEMO_PRODUCTS`).
- Panier et **checkout Shopify** (le bouton « Passer commande » est volontairement désactivé ;
  aucun paiement n'est simulé, aucune donnée bancaire n'est collectée).
- Comptes clients Shopify sur `/compte`.
- Shopify Forms / Email pour newsletter et contact ; Shopify Inbox pour le chat.
- Search & Discovery pour la recherche et les filtres ; Flow pour les scénarios email
  (bienvenue, panier abandonné, confirmation, expédition, demande d'avis, liste d'attente).
- Bannière de consentement (Customer Privacy API) reliée à `/cookies`.
- Données structurées Produit générées par Shopify une fois les prix réels en place.

## 4. Multilingue

Français publié. `LANGUAGES` prévoit en · ru · it · es · de · ja · ar, désactivés tant que la
traduction n'est pas faite par un locuteur compétent. Une seule langue par page.
Prévoir `hreflang` au moment de l'activation.

## 5. Checklist de publication

- [ ] Aucun `[... À RENSEIGNER]` visible en production
- [ ] Aucun produit de démonstration en ligne
- [ ] Prix, stocks et taxes configurés dans Shopify
- [ ] Pages légales rédigées et vérifiées
- [ ] Emails transactionnels testés
- [ ] Photos définitives compressées (WebP/AVIF) + textes ALT
- [ ] Titres/méta uniques sur chaque page, une seule H1
- [ ] Test 390 / 768 / 1440 px : menu, recherche, langue, galerie, variantes, panier vide et
      rempli, formulaire invalide, 404, produit indisponible
- [ ] Navigation clavier, focus visible, contrastes vérifiés
- [ ] `noindex` retiré des fiches produits une fois les vrais produits en ligne
- [ ] Aucune promesse non vérifiée (origine, certification, garantie, délai, gratuité)

## 6. Points d'attention signalés

- Les fiches produits et le panier sont en `noindex` tant que le catalogue est fictif.
- La barre d'annonce ne promet aucune livraison gratuite.
- Aucun avis client n'est inventé : le bloc affiche un message d'attente.
- Aucun compte à rebours, faux stock ou badge artificiel n'a été créé.
- Aucun élément (logo, monogramme, mise en page, slogan) n'est repris d'une marque existante ;
  le logotype est un mot-type provisoire « ZELOR » en Cormorant Garamond.
