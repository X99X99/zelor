/** ————— Registre des locales ZELOR —————
 * Une seule source de vérité pour les langues, leur état d'avancement, leur
 * direction d'écriture, leur devise et leur format par défaut.
 *
 * Règle produit : une locale n'est exposée au public que lorsque son statut
 * passe à `ready`, c'est-à-dire lorsque contenu, SEO, service client,
 * paiement, livraison, retours et textes légaux sont prêts pour le marché.
 * Aucune traduction automatique ne peut faire passer une locale à `ready`.
 *
 * Chaque locale porte aussi ce que Shopify attend : sans ces deux champs, le
 * catalogue reviendrait toujours dans la langue d'origine de la boutique.
 */

export type LocaleStatus = "ready" | "draft";
export type TextDirection = "ltr" | "rtl";

export type LocaleDefinition = {
  /** Étiquette BCP-47 utilisée par Intl, `lang` et `hreflang`. */
  code: string;
  /** Nom affiché dans sa propre langue. */
  label: string;
  status: LocaleStatus;
  dir: TextDirection;
  currency: string;
  /** Énumération Shopify : décide de la langue du catalogue renvoyé. */
  shopifyLanguage: string;
  /** Pays Shopify : décide de la devise et des prix renvoyés. */
  shopifyCountry: string;
  /** Marché principal desservi (livraison, retours, mentions légales). */
  region: string;
};

export const LOCALES = [
  {
    code: "fr-FR",
    label: "Français",
    status: "ready",
    dir: "ltr",
    currency: "EUR",
    shopifyLanguage: "FR",
    shopifyCountry: "FR",
    region: "FR",
  },
  {
    code: "en",
    label: "English",
    status: "ready",
    dir: "ltr",
    currency: "EUR",
    shopifyLanguage: "EN",
    // L'Irlande plutôt que le Royaume-Uni : anglophone et en euros, donc les
    // prix restent cohérents avec la devise déclarée pour cette locale.
    shopifyCountry: "IE",
    region: "EU",
  },
  {
    code: "de-DE",
    label: "Deutsch",
    status: "draft",
    dir: "ltr",
    currency: "EUR",
    shopifyLanguage: "DE",
    shopifyCountry: "DE",
    region: "DE",
  },
  {
    code: "it-IT",
    label: "Italiano",
    status: "draft",
    dir: "ltr",
    currency: "EUR",
    shopifyLanguage: "IT",
    shopifyCountry: "IT",
    region: "IT",
  },
  {
    code: "es-ES",
    label: "Español",
    status: "draft",
    dir: "ltr",
    currency: "EUR",
    shopifyLanguage: "ES",
    shopifyCountry: "ES",
    region: "ES",
  },
  {
    code: "ja-JP",
    label: "日本語",
    status: "draft",
    dir: "ltr",
    currency: "JPY",
    shopifyLanguage: "JA",
    shopifyCountry: "JP",
    region: "JP",
  },
  {
    code: "ko-KR",
    label: "한국어",
    status: "draft",
    dir: "ltr",
    currency: "KRW",
    shopifyLanguage: "KO",
    shopifyCountry: "KR",
    region: "KR",
  },
  {
    code: "ar",
    label: "العربية",
    status: "draft",
    dir: "rtl",
    currency: "AED",
    shopifyLanguage: "AR",
    shopifyCountry: "AE",
    region: "AE",
  },
  {
    code: "zh-Hans",
    label: "简体中文",
    status: "draft",
    dir: "ltr",
    currency: "CNY",
    shopifyLanguage: "ZH_CN",
    shopifyCountry: "CN",
    region: "CN",
  },
  {
    code: "zh-Hant",
    label: "繁體中文",
    status: "draft",
    dir: "ltr",
    currency: "TWD",
    shopifyLanguage: "ZH_TW",
    shopifyCountry: "TW",
    region: "TW",
  },
] as const satisfies readonly LocaleDefinition[];

export type LocaleCode = (typeof LOCALES)[number]["code"];

export const DEFAULT_LOCALE: LocaleCode = "fr-FR";

/** Clé de persistance du choix manuel de langue (jamais écrasé par la géo). */
export const LOCALE_STORAGE_KEY = "zelor-locale";

export function getLocale(code: string): LocaleDefinition | undefined {
  return LOCALES.find((l) => l.code === code);
}

/** Locales réellement publiables aujourd'hui. */
export function publicLocales(): readonly LocaleDefinition[] {
  return LOCALES.filter((l) => l.status === "ready");
}

export function isPublicLocale(code: string): boolean {
  return getLocale(code)?.status === "ready";
}

/**
 * Résout la locale à servir : le choix manuel prime toujours, la langue du
 * navigateur n'est qu'une suggestion, et jamais une redirection forcée.
 */
export function resolveLocale(
  stored: string | null | undefined,
  accepted: readonly string[] = [],
): LocaleCode {
  if (stored && isPublicLocale(stored)) return stored as LocaleCode;
  for (const candidate of accepted) {
    const exact = publicLocales().find((l) => l.code.toLowerCase() === candidate.toLowerCase());
    if (exact) return exact.code as LocaleCode;
    const base = candidate.split("-")[0]?.toLowerCase();
    const loose = publicLocales().find((l) => l.code.toLowerCase().startsWith(`${base}`));
    if (loose) return loose.code as LocaleCode;
  }
  return DEFAULT_LOCALE;
}

/** Ce que Shopify doit recevoir pour cette locale. */
export function shopifyContext(code: string): { language: string; country: string } {
  const definition = getLocale(code) ?? getLocale(DEFAULT_LOCALE)!;
  return { language: definition.shopifyLanguage, country: definition.shopifyCountry };
}
