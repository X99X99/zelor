/** ————— Textes d'interface —————
 * Uniquement les libellés d'interface (actions, états, accessibilité).
 * Les contenus éditoriaux, produits et légaux vivent ailleurs :
 *  - éditorial / produits : `src/lib/zelor/content.ts` (fr-FR de référence) ;
 *  - légal : pages `src/routes/*` dédiées ;
 *  - SEO : `head()` de chaque route.
 * Cette séparation évite qu'une traduction d'interface touche à un contenu
 * de marque relu par un humain.
 */
import { DEFAULT_LOCALE, type LocaleCode } from "./locales";

export type UiKey =
  | "nav.search"
  | "nav.account"
  | "nav.cart"
  | "nav.menu.open"
  | "nav.menu.close"
  | "nav.top"
  | "theme.toggle"
  | "theme.settings"
  | "state.loading"
  | "state.empty"
  | "state.error"
  | "state.offline"
  | "action.retry"
  | "action.search";

type Dictionary = Record<UiKey, string>;

const fr: Dictionary = {
  "nav.search": "Rechercher",
  "nav.account": "Compte client",
  "nav.cart": "Panier",
  "nav.menu.open": "Ouvrir le menu",
  "nav.menu.close": "Fermer le menu",
  "nav.top": "Haut de page",
  "theme.toggle": "Basculer entre le mode jour et le mode nuit",
  "theme.settings": "Réglages d'apparence",
  "state.loading": "Chargement en cours",
  "state.empty": "Rien à afficher pour le moment",
  "state.error": "Cette page ne s'est pas chargée",
  "state.offline": "Connexion indisponible",
  "action.retry": "Réessayer",
  "action.search": "Rechercher",
};

const en: Dictionary = {
  "nav.search": "Search",
  "nav.account": "Account",
  "nav.cart": "Cart",
  "nav.menu.open": "Open menu",
  "nav.menu.close": "Close menu",
  "nav.top": "Back to top",
  "theme.toggle": "Switch between light and dark mode",
  "theme.settings": "Appearance settings",
  "state.loading": "Loading",
  "state.empty": "Nothing to show yet",
  "state.error": "This page failed to load",
  "state.offline": "You appear to be offline",
  "action.retry": "Try again",
  "action.search": "Search",
};

/** Seules les locales relues sont branchées ; les autres retombent sur fr-FR. */
export const UI_DICTIONARIES: Partial<Record<LocaleCode, Dictionary>> = {
  "fr-FR": fr,
  en,
};

export function t(key: UiKey, locale: LocaleCode = DEFAULT_LOCALE): string {
  const dict = UI_DICTIONARIES[locale] ?? UI_DICTIONARIES[DEFAULT_LOCALE]!;
  return dict[key] ?? UI_DICTIONARIES[DEFAULT_LOCALE]![key];
}
