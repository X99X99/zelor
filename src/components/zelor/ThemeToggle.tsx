import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/lib/zelor/theme";

/** Capsule de bascule jour / nuit : même matière marine que les utilitaires. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { isDark, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      suppressHydrationWarning
      aria-label="Basculer entre le mode jour et le mode nuit"
      title="Jour / nuit"
      className={`utility-z utility-icon-z theme-toggle-z flex size-11 items-center justify-center opacity-90 hover:opacity-100 ${className}`.trim()}
    >
      {/* Les deux astres coexistent : l'affichage suit la classe de thème,
       * jamais un état JavaScript — aucun flash au chargement. */}
      <Sun className="theme-icon-z theme-icon-day-z size-4.5" aria-hidden="true" />
      <Moon
        className="theme-icon-z theme-icon-night-z size-4.5"
        aria-hidden="true"
      />
    </button>
  );
}
