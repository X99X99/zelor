import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

/**
 * Verrouillage du moteur de rendu.
 *
 * Cause historique des faux échecs visuels : la suite tournait tantôt sur le
 * Chromium livré par Playwright, tantôt sur un Chromium système d'une autre
 * version. Deux moteurs = deux rendus de texte = des diffs qui n'ont rien à
 * voir avec le code. On résout donc un binaire **unique et vérifié**, et on
 * échoue bruyamment si aucun ne correspond au verrou.
 */
type Lock = { browserVersionPrefix: string; candidates: string[] };

const lock = JSON.parse(readFileSync(new URL("./browser-lock.json", import.meta.url), "utf8")) as Lock;

function versionOf(path: string): string | null {
  try {
    return execFileSync(path, ["--version"], { encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

export type ResolvedBrowser = { executablePath: string; version: string };

/** Résout le binaire verrouillé, ou `null` si aucun n'est disponible. */
export function resolveLockedChromium(): ResolvedBrowser | null {
  const override = process.env["ZELOR_CHROMIUM_PATH"];
  const candidates = [override, ...lock.candidates].filter(Boolean) as string[];
  for (const path of candidates) {
    if (!existsSync(path)) continue;
    const version = versionOf(path);
    if (!version) continue;
    const build = version.replace(/^\D+/, "");
    if (build.startsWith(lock.browserVersionPrefix)) return { executablePath: path, version };
  }
  return null;
}

export const LOCK_MESSAGE = `Aucun Chromium conforme au verrou (${lock.browserVersionPrefix}x) n'a été trouvé.
Candidats testés : ${lock.candidates.join(", ")}.
Renseigner ZELOR_CHROMIUM_PATH vers ce build exact, ou mettre à jour
tests/e2e/browser-lock.json **et** régénérer les baselines volontairement
(bun run test:visual:update) — jamais l'un sans l'autre.`;

export const BROWSER_LOCK = lock;
