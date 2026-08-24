/** ZELOR — contenu éditorial de la maison. */

export const BRAND = {
  name: "ZELOR",
  pronunciation: "ZÉ-LOR",
  tagline: "Defined by Detail.",
  taglineFr: "L'élégance dans chaque détail.",
  heroSubtitle:
    "Une sélection resserrée de pièces choisies pour leur allure, leur justesse et leur tenue dans le temps.",
  announcement: "Livraison en France et dans l'Union européenne.",
} as const;

/** Formulations d'attente élégantes, en place des données commerciales réelles. */
export const PRICING = {
  label: "Prix communiqué à l'ouverture",
  short: "À l'ouverture",
  currencyNote: "Devises disponibles annoncées à l'ouverture",
} as const;

export const SERVICE = {
  emailLabel: "Formulaire de contact",
  responseTime: "Nous répondons à chaque message dans l'ordre d'arrivée.",
  legalName: "ZELOR",
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

export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    slug: "etui-riviera",
    name: "Étui Riviera",
    line: "Ligne Signature",
    intro:
      "Un étui à la ligne nette, pensé pour disparaître dans la main et se retrouver d'un geste. Le rabat tombe droit, la couture reste discrète, la silhouette ne se déforme pas à l'usage.",
    benefits: [
      "Une silhouette qui reste tendue au fil des jours",
      "Une ouverture d'une seule main, sans effort",
      "Un format étudié pour la poche intérieure d'une veste",
    ],
    variants: ["Marine", "Sable"],
    tone: "sand",
    isNew: true,
    available: "shopify",
  },
  {
    slug: "carnet-ligure",
    name: "Carnet Ligure",
    line: "Ligne Signature",
    intro:
      "Un carnet sobre, à la reliure souple, conçu pour s'ouvrir à plat et se glisser partout. Le papier accueille l'encre sans la traverser ; la couverture prend une patine calme.",
    benefits: [
      "Une reliure qui s'ouvre à plat, page après page",
      "Un papier choisi pour l'écriture à l'encre",
      "Une couverture qui se patine sans se marquer",
    ],
    variants: ["Marine", "Ivoire", "Pierre"],
    tone: "stone",
    isNew: true,
    available: "shopify",
  },
  {
    slug: "plateau-colonne",
    name: "Plateau Colonne",
    line: "Ligne Atelier",
    intro:
      "Un plateau bas, aux arêtes adoucies, qui rassemble les objets du quotidien en un seul geste. Posé sur une console ou une table de nuit, il crée un point de calme.",
    benefits: [
      "Des arêtes adoucies, agréables à la main",
      "Une base stable, silencieuse à la pose",
      "Une hauteur pensée pour l'entrée comme pour le bureau",
    ],
    variants: ["Pièce unique"],
    tone: "forest",
    available: "shopify",
  },
  {
    slug: "miroir-cap",
    name: "Miroir Cap",
    line: "Ligne Atelier",
    intro:
      "Un miroir de table à l'inclinaison réglable, dessiné comme un objet et non comme un accessoire. Le cadre est fin, l'aplomb franc, le reflet net jusqu'au bord.",
    benefits: [
      "Une inclinaison qui tient la position choisie",
      "Un cadre fin, sans surépaisseur visible",
      "Un aplomb stable sur toute surface plane",
    ],
    variants: ["Marine", "Pierre"],
    tone: "ink",
    available: "shopify",
  },
  {
    slug: "pochette-escale",
    name: "Pochette Escale",
    line: "Ligne Voyage",
    intro:
      "Une pochette de voyage à la fermeture nette, pensée pour tenir dans un bagage cabine sans se déformer. Tout reste à sa place, rien ne dépasse.",
    benefits: [
      "Une fermeture régulière, jusqu'aux extrémités",
      "Un volume qui se tient, plein ou vide",
      "Un format compatible avec un bagage cabine",
    ],
    variants: ["Marine"],
    tone: "sand",
    available: "shopify",
  },
  {
    slug: "trousse-cabine",
    name: "Trousse Cabine",
    line: "Ligne Voyage",
    intro:
      "Une trousse au dessin sobre, à l'intérieur clair, qui s'ouvre largement pour tout voir d'un regard. Une pièce faite pour partir souvent et durer longtemps.",
    benefits: [
      "Une ouverture large, contenu visible d'un regard",
      "Un intérieur clair, facile à entretenir",
      "Une base plate qui tient debout seule",
    ],
    variants: ["Marine", "Sable"],
    tone: "stone",
    available: "shopify",
  },
];

export function getProduct(slug: string) {
  return DEMO_PRODUCTS.find((p) => p.slug === slug);
}

export const PROMISES = [
  {
    title: "Une sélection resserrée.",
    body: "Peu de pièces, longuement regardées. Une référence n'entre au catalogue que si sa forme, son usage et sa tenue nous convainquent.",
  },
  {
    title: "Une expérience sans friction.",
    body: "De la première page à la réception du colis, un parcours court, lisible et calme, sur mobile comme sur grand écran.",
  },
  {
    title: "Un service attentif.",
    body: "Des réponses précises, en français et en anglais, écrites par des personnes qui connaissent les pièces.",
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

/** Note interne : rubriques ouvertes au fil de l'élargissement du catalogue. */
export const FUTURE_NAV = [
  "Accessoires",
  "Maison",
  "Éditions limitées",
  "Cadeaux",
  "Collections saisonnières",
];
