/** ————— Formats internationaux —————
 * Dates, prix, devises et listes passent tous par Intl, jamais par une
 * concaténation maison : une seule logique, dix marchés possibles.
 */
import { DEFAULT_LOCALE, getLocale, type LocaleCode } from "./locales";

export function formatDate(
  value: Date | string | number,
  locale: LocaleCode = DEFAULT_LOCALE,
  options: Intl.DateTimeFormatOptions = { dateStyle: "long" },
): string {
  return new Intl.DateTimeFormat(locale, options).format(new Date(value));
}

/**
 * Prix à partir d'un montant en plus petite unité (centimes) — jamais un
 * flottant. La devise suit la locale si elle n'est pas imposée.
 */
export function formatPrice(
  amountMinor: number,
  locale: LocaleCode = DEFAULT_LOCALE,
  currency?: string,
): string {
  const definition = getLocale(locale);
  const code = currency ?? definition?.currency ?? "EUR";
  const zeroDecimal = ["JPY", "KRW"].includes(code);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
  }).format(zeroDecimal ? amountMinor : amountMinor / 100);
}

export function formatList(items: string[], locale: LocaleCode = DEFAULT_LOCALE): string {
  return new Intl.ListFormat(locale, {
    style: "long",
    type: "conjunction",
  }).format(items);
}

export function textDirection(locale: LocaleCode = DEFAULT_LOCALE) {
  return getLocale(locale)?.dir ?? "ltr";
}
