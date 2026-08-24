import { describe, expect, it } from "vitest";

import { formatDate, formatPrice, textDirection } from "./format";
import { DEFAULT_LOCALE, LOCALES, isPublicLocale, publicLocales, resolveLocale } from "./locales";
import { t, UI_DICTIONARIES } from "./ui";

describe("architecture d'internationalisation", () => {
  it("prépare les dix locales attendues", () => {
    expect(LOCALES.map((l) => l.code)).toEqual([
      "fr-FR",
      "en",
      "de-DE",
      "it-IT",
      "es-ES",
      "ja-JP",
      "ko-KR",
      "ar",
      "zh-Hans",
      "zh-Hant",
    ]);
  });

  it("n'expose que le français et l'anglais tant que le reste n'est pas relu", () => {
    expect(publicLocales().map((l) => l.code)).toEqual(["fr-FR", "en"]);
    expect(isPublicLocale("de-DE")).toBe(false);
  });

  it("déclare l'arabe en écriture droite-à-gauche", () => {
    expect(textDirection("ar")).toBe("rtl");
    expect(textDirection("fr-FR")).toBe("ltr");
  });

  it("préserve le choix manuel et ne force aucune redirection", () => {
    expect(resolveLocale("en", ["fr-FR"])).toBe("en");
    expect(resolveLocale(null, ["de-DE"])).toBe(DEFAULT_LOCALE);
    expect(resolveLocale(null, ["en-GB"])).toBe("en");
  });

  it("chaque dictionnaire publié couvre toutes les clés d'interface", () => {
    const reference = Object.keys(UI_DICTIONARIES["fr-FR"]!);
    for (const locale of publicLocales()) {
      const dict = UI_DICTIONARIES[locale.code as "en"];
      expect(dict && Object.keys(dict), locale.code).toEqual(reference);
    }
    expect(t("nav.cart", "en")).toBe("Cart");
  });

  it("formate prix et dates via Intl", () => {
    expect(formatPrice(24000, "en")).toMatch(/240/);
    expect(formatPrice(24000, "ja-JP", "JPY")).toMatch(/24,000/);
    expect(formatDate("2026-03-04T00:00:00Z", "fr-FR")).toMatch(/2026/);
  });
});
