/** ————— Thème ZELOR —————
 * Une seule source de vérité pour tout le site : trois valeurs de choix
 * (`system`, `light`, `dark`), un seul stockage, un seul écouteur système.
 *
 * Règles de priorité, sans exception :
 *  1. tant que le choix est `system`, la préférence du système fait foi et
 *     le site suit ses changements en direct ;
 *  2. dès qu'un choix manuel est posé, il devient prioritaire, persiste entre
 *     les visites et n'est plus jamais écrasé par le système ;
 *  3. la classe est posée avant le premier rendu (script bloquant) : aucun
 *     flash, aucune bascule de couleur de barre navigateur au chargement.
 */
import { useSyncExternalStore } from "react";

/** Ce que l'utilisateur choisit. */
export type ThemeChoice = "system" | "light" | "dark";
/** Ce que la page applique réellement. */
export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "zelor-theme";

/** Couleurs de barre navigateur : mêmes valeurs que les fonds marins. */
export const THEME_COLORS: Record<Theme, string> = {
  light: "#151F31",
  dark: "#101927",
};

/* ————— Fonctions pures (testables sans DOM) ————— */

/** Normalise ce qui sort du stockage : tout le reste vaut « système ». */
export function parseChoice(raw: string | null | undefined): ThemeChoice {
  return raw === "light" || raw === "dark" || raw === "system"
    ? raw
    : "system";
}

/** Résout le thème appliqué à partir du choix et de la préférence système. */
export function resolveTheme(choice: ThemeChoice, systemDark: boolean): Theme {
  if (choice === "system") return systemDark ? "dark" : "light";
  return choice;
}

/** Script bloquant injecté dans <head> : évite tout flash de mauvais thème. */
export const THEME_INIT_SCRIPT = `(function(){try{var k=${JSON.stringify(
  THEME_STORAGE_KEY,
)};var c=localStorage.getItem(k);if(c!=="light"&&c!=="dark")c="system";var d=c==="system"?window.matchMedia("(prefers-color-scheme: dark)").matches:c==="dark";var r=document.documentElement;r.classList.toggle("dark",d);r.classList.toggle("light",!d);r.style.colorScheme=d?"dark":"light";r.dataset.themeChoice=c;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",d?${JSON.stringify(
  THEME_COLORS.dark,
)}:${JSON.stringify(THEME_COLORS.light)});}catch(e){}})();`;

/* ————— État partagé ————— */

const listeners = new Set<() => void>();
let choice: ThemeChoice | null = null;
let mediaBound = false;

function systemDark(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function readChoice(): ThemeChoice {
  if (choice) return choice;
  if (typeof document === "undefined") return "system";
  try {
    choice = parseChoice(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    choice = parseChoice(document.documentElement.dataset.themeChoice);
  }
  return choice;
}

/** Applique un thème résolu au document (classe, colorScheme, barre navigateur). */
export function applyTheme(theme: Theme, current: ThemeChoice) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.style.colorScheme = theme;
  root.dataset.themeChoice = current;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLORS[theme]);
}

function sync() {
  const current = readChoice();
  applyTheme(resolveTheme(current, systemDark()), current);
  listeners.forEach((l) => l());
}

/** Un seul écouteur système pour toute l'application. */
function bindMedia() {
  if (mediaBound || typeof window === "undefined" || !window.matchMedia) return;
  mediaBound = true;
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => {
    // Le système ne reprend jamais la main sur un choix manuel.
    if (readChoice() === "system") sync();
  };
  if (mq.addEventListener) mq.addEventListener("change", onChange);
  else mq.addListener?.(onChange);
}

/** Pose un choix : `system` rend la main à la préférence de l'appareil. */
export function setThemeChoice(next: ThemeChoice) {
  choice = next;
  try {
    if (next === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    /* le choix reste valable pour la session en cours. */
  }
  sync();
}

/** Bascule simple jour ↔ nuit à partir du thème réellement affiché. */
export function toggleTheme() {
  setThemeChoice(
    resolveTheme(readChoice(), systemDark()) === "dark" ? "light" : "dark",
  );
}

function subscribe(listener: () => void) {
  bindMedia();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function snapshot(): string {
  const current = readChoice();
  return `${current}:${resolveTheme(current, systemDark())}`;
}

export function useTheme() {
  const state = useSyncExternalStore(subscribe, snapshot, () => "system:light");
  const [current, theme] = state.split(":") as [ThemeChoice, Theme];
  return {
    choice: current,
    theme,
    isDark: theme === "dark",
    setChoice: setThemeChoice,
    toggle: toggleTheme,
  };
}

/** Réinitialisation d'état — réservée aux tests. */
export function __resetThemeStore() {
  choice = null;
  mediaBound = false;
  listeners.clear();
}
