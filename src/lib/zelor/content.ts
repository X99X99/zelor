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
