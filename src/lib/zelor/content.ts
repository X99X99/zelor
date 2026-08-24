/**
 * ZELOR — contenu de marque et données de démonstration.
 *
 * IMPORTANT : aucun produit, prix, stock, matière, origine ou avis réel
 * n'est présent ici. Tout est marqué comme exemple à remplacer par les
 * données Shopify réelles avant publication.
 */

export const BRAND = {
  name: "ZELOR",
  pronunciation: "ZÉ-LOR",
  tagline: "Defined by Detail.",
  taglineFr: "L'élégance dans chaque détail.",
  heroSubtitle:
    "Des pièces soigneusement choisies pour celles et ceux qui recherchent une présence plus raffinée au quotidien.",
  announcement: "Livraison disponible en France et dans l'Union européenne.",
} as const;

export const PLACEHOLDER = {
  price: "[PRIX À RENSEIGNER]",
  currency: "[DEVISE À RENSEIGNER]",
  category: "[CATÉGORIE À DÉFINIR]",
  email: "[EMAIL PROFESSIONNEL À RENSEIGNER]",
  company: "[STATUT JURIDIQUE À RENSEIGNER]",
  address: "[ADRESSE DE RETOUR À RENSEIGNER]",
  delay: "[DÉLAI À RENSEIGNER]",
  shippingCost: "[FRAIS DE PORT À RENSEIGNER]",
  freeShipping: "[SEUIL DE LIVRAISON OFFERTE À DÉFINIR]",
} as const;

export type DemoProduct = {
  slug: string;
  name: string;
  line: string;
  intro: string;
  benefits: string[];
  variants: string[];
  tone: "sand" | "stone" | "forest" | "ink";
  isNew?: boolean;
  available: "shopify";
};

/** Produits de DÉMONSTRATION. Aucun n'est en vente. */
export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    slug: "objet-demonstration-01",
    name: "Pièce de démonstration 01",
    line: "Ligne Signature",
    intro:
      "Emplacement de fiche produit. Le nom, la description et les visuels réels seront importés depuis Shopify.",
    benefits: [
      "[BÉNÉFICE CONCRET 1 À CONFIRMER]",
      "[BÉNÉFICE CONCRET 2 À CONFIRMER]",
      "[BÉNÉFICE CONCRET 3 À CONFIRMER]",
    ],
    variants: ["[VARIANTE A]", "[VARIANTE B]"],
    tone: "sand",
    isNew: true,
    available: "shopify",
  },
  {
    slug: "objet-demonstration-02",
    name: "Pièce de démonstration 02",
    line: "Ligne Signature",
    intro:
      "Emplacement de fiche produit. Structure prête pour variantes, quantité et checkout Shopify.",
    benefits: [
      "[BÉNÉFICE CONCRET 1 À CONFIRMER]",
      "[BÉNÉFICE CONCRET 2 À CONFIRMER]",
      "[BÉNÉFICE CONCRET 3 À CONFIRMER]",
    ],
    variants: ["[VARIANTE A]", "[VARIANTE B]", "[VARIANTE C]"],
    tone: "stone",
    isNew: true,
    available: "shopify",
  },
  {
    slug: "objet-demonstration-03",
    name: "Pièce de démonstration 03",
    line: "Ligne Atelier",
    intro:
      "Emplacement de fiche produit. Les caractéristiques techniques seront renseignées par la marque.",
    benefits: [
      "[BÉNÉFICE CONCRET 1 À CONFIRMER]",
      "[BÉNÉFICE CONCRET 2 À CONFIRMER]",
      "[BÉNÉFICE CONCRET 3 À CONFIRMER]",
    ],
    variants: ["[VARIANTE UNIQUE]"],
    tone: "forest",
    available: "shopify",
  },
  {
    slug: "objet-demonstration-04",
    name: "Pièce de démonstration 04",
    line: "Ligne Atelier",
    intro:
      "Emplacement de fiche produit. Disponibilité et stock proviendront de l'inventaire Shopify.",
    benefits: [
      "[BÉNÉFICE CONCRET 1 À CONFIRMER]",
      "[BÉNÉFICE CONCRET 2 À CONFIRMER]",
      "[BÉNÉFICE CONCRET 3 À CONFIRMER]",
    ],
    variants: ["[VARIANTE A]", "[VARIANTE B]"],
    tone: "ink",
    available: "shopify",
  },
  {
    slug: "objet-demonstration-05",
    name: "Pièce de démonstration 05",
    line: "Ligne Voyage",
    intro: "Emplacement de fiche produit. À remplacer par un produit réel.",
    benefits: [
      "[BÉNÉFICE CONCRET 1 À CONFIRMER]",
      "[BÉNÉFICE CONCRET 2 À CONFIRMER]",
      "[BÉNÉFICE CONCRET 3 À CONFIRMER]",
    ],
    variants: ["[VARIANTE A]"],
    tone: "sand",
    available: "shopify",
  },
  {
    slug: "objet-demonstration-06",
    name: "Pièce de démonstration 06",
    line: "Ligne Voyage",
    intro: "Emplacement de fiche produit. À remplacer par un produit réel.",
    benefits: [
      "[BÉNÉFICE CONCRET 1 À CONFIRMER]",
      "[BÉNÉFICE CONCRET 2 À CONFIRMER]",
      "[BÉNÉFICE CONCRET 3 À CONFIRMER]",
    ],
    variants: ["[VARIANTE A]", "[VARIANTE B]"],
    tone: "stone",
    available: "shopify",
  },
];

export function getProduct(slug: string) {
  return DEMO_PRODUCTS.find((p) => p.slug === slug);
}

export const PROMISES = [
  {
    title: "Des choix soigneusement sélectionnés.",
    body: "Chaque référence est étudiée avant d'entrer au catalogue : forme, fonction, usage réel.",
  },
  {
    title: "Une expérience pensée dans les moindres détails.",
    body: "De la navigation à la réception du colis, un parcours court, clair et sans friction.",
  },
  {
    title: "Un service clair, attentif et international.",
    body: "Des réponses précises, en français et en anglais, dans un délai annoncé.",
  },
];

export const LANGUAGES = [
  { code: "fr", label: "Français", active: true },
  { code: "en", label: "English", active: false },
  { code: "ru", label: "Русский", active: false },
  { code: "it", label: "Italiano", active: false },
  { code: "es", label: "Español", active: false },
  { code: "de", label: "Deutsch", active: false },
  { code: "ja", label: "日本語", active: false },
  { code: "ar", label: "العربية", active: false },
];

export const MAIN_NAV = [
  { to: "/nouveautes", label: "Nouveautés" },
  { to: "/collection", label: "Collection" },
  { to: "/univers", label: "L'univers ZELOR" },
  { to: "/journal", label: "Journal" },
  { to: "/aide", label: "Aide" },
] as const;

/** Rubriques prévues, activables quand le catalogue réel existera. */
export const FUTURE_NAV = [
  "Beauté",
  "Accessoires",
  "Maison",
  "Éditions limitées",
  "Cadeaux",
  "Collections saisonnières",
  "Best-sellers (dès que des données de ventes réelles existent)",
];
