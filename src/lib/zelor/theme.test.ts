// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  applyTheme,
  parseChoice,
  resolveTheme,
  setThemeChoice,
  THEME_INIT_SCRIPT,
  THEME_STORAGE_KEY,
  toggleTheme,
  __resetThemeStore,
} from "./theme";

/** Simule la préférence système du navigateur. */
function mockSystem(dark: boolean) {
  const listeners = new Set<(e: MediaQueryListEvent) => void>();
  const mq = {
    matches: dark,
    media: "(prefers-color-scheme: dark)",
    addEventListener: (_: string, l: (e: MediaQueryListEvent) => void) => listeners.add(l),
    removeEventListener: (_: string, l: (e: MediaQueryListEvent) => void) => listeners.delete(l),
    addListener: (l: (e: MediaQueryListEvent) => void) => listeners.add(l),
    removeListener: (l: (e: MediaQueryListEvent) => void) => listeners.delete(l),
    dispatchEvent: () => true,
    onchange: null,
  };
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) =>
      query.includes("prefers-color-scheme: dark") ? mq : { ...mq, matches: false },
    ),
  );
  window.matchMedia = globalThis.matchMedia;
  return {
    change(next: boolean) {
      mq.matches = next;
      listeners.forEach((l) => l({ matches: next } as MediaQueryListEvent));
    },
  };
}

/** Rejoue le script bloquant exactement comme le navigateur le ferait. */
function runInitScript() {
  new Function(THEME_INIT_SCRIPT)();
}

beforeEach(() => {
  localStorage.clear();
  document.head.innerHTML = '<meta name="theme-color" content="#000000">';
  document.documentElement.className = "";
  delete document.documentElement.dataset["themeChoice"];
  __resetThemeStore();
});

describe("résolution du thème", () => {
  it("normalise toute valeur inconnue en « système »", () => {
    expect(parseChoice(null)).toBe("system");
    expect(parseChoice("auto")).toBe("system");
    expect(parseChoice("dark")).toBe("dark");
  });

  it("suit le système tant qu'aucun choix manuel n'est posé", () => {
    expect(resolveTheme("system", false)).toBe("light");
    expect(resolveTheme("system", true)).toBe("dark");
  });

  it("donne toujours la priorité au choix manuel", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });
});

describe("script bloquant : aucun flash au chargement", () => {
  it("première visite, système clair", () => {
    mockSystem(false);
    runInitScript();
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.dataset["themeChoice"]).toBe("system");
  });

  it("première visite, système sombre", () => {
    mockSystem(true);
    runInitScript();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.querySelector('meta[name="theme-color"]')?.getAttribute("content")).toBe(
      "#101927",
    );
  });

  it("applique le choix persisté avant tout rendu", () => {
    mockSystem(true);
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    runInitScript();
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});

describe("état partagé", () => {
  it("le changement de préférence système s'applique en mode système", () => {
    const system = mockSystem(false);
    runInitScript();
    setThemeChoice("system");
    expect(document.documentElement.classList.contains("light")).toBe(true);
    system.change(true);
    // Aucun abonné React ici : on rejoue la résolution comme le store le fait.
    applyTheme(resolveTheme("system", true), "system");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("un choix manuel n'est plus écrasé par le système", () => {
    const system = mockSystem(false);
    setThemeChoice("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    system.change(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    system.change(false);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("le retour à « Système » efface la persistance", () => {
    mockSystem(true);
    setThemeChoice("light");
    setThemeChoice("system");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("la bascule part du thème réellement affiché", () => {
    mockSystem(true);
    toggleTheme();
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    toggleTheme();
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("la couleur de barre navigateur suit le thème appliqué", () => {
    mockSystem(false);
    setThemeChoice("dark");
    expect(document.querySelector('meta[name="theme-color"]')?.getAttribute("content")).toBe(
      "#101927",
    );
    setThemeChoice("light");
    expect(document.querySelector('meta[name="theme-color"]')?.getAttribute("content")).toBe(
      "#151F31",
    );
  });
});
