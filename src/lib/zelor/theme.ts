/** ————— Thème ZELOR —————
 * Un seul état partagé pour toute l'application : le bouton du header, quel
 * que soit son point d'affichage, lit et écrit la même source. La préférence
 * système n'intervient qu'au tout premier chargement ; ensuite, le choix
 * manuel prime et se conserve entre les visites.
 */
import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "zelor-theme";

/** Script bloquant injecté dans <head> : évite tout flash de mauvais thème. */
export const THEME_INIT_SCRIPT = `(function(){try{var k=${JSON.stringify(
  THEME_STORAGE_KEY,
)};var s=localStorage.getItem(k);var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;var r=document.documentElement;r.classList.toggle("dark",d);r.classList.toggle("light",!d);r.style.colorScheme=d?"dark":"light";}catch(e){}})();`;

const listeners = new Set<() => void>();
let current: Theme | null = null;

function systemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function read(): Theme {
  if (current) return current;
  if (typeof document === "undefined") return "light";
  if (document.documentElement.classList.contains("dark")) {
    current = "dark";
    return current;
  }
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark" || stored === "light") {
      current = stored;
      return current;
    }
  } catch {
    /* stockage indisponible : la préférence système fait foi. */
  }
  current = systemTheme();
  return current;
}

function apply(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.style.colorScheme = theme;
}

export function setTheme(theme: Theme) {
  current = theme;
  apply(theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* le choix reste valable pour la session en cours. */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => "light" as Theme);
  return {
    theme,
    isDark: theme === "dark",
    toggle: () => setTheme(read() === "dark" ? "light" : "dark"),
    setTheme,
  };
}
