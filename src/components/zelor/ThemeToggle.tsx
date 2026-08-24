import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useTheme, type ThemeChoice } from "@/lib/zelor/theme";

const OPTIONS: { value: ThemeChoice; label: string; hint: string }[] = [
  { value: "light", label: "Jour", hint: "Lumière claire" },
  { value: "dark", label: "Nuit", hint: "Profondeur marine" },
  { value: "system", label: "Système", hint: "Suit l'appareil" },
];

/**
 * Capsule de bascule jour / nuit : même matière marine que les utilitaires.
 * Un clic bascule jour ↔ nuit ; le menu, discret, permet aussi de revenir
 * au réglage « Système ». Un seul état partagé (`@/lib/zelor/theme`).
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { isDark, choice, toggle, setChoice } = useTheme();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const close = () => {
    if (!open || closing) return;
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      setOpen(false);
    }, 260);
  };

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) close();
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  });

  return (
    <div className={`relative ${className}`.trim()} ref={ref}>
      <button
        type="button"
        onClick={toggle}
        onContextMenu={(event) => {
          event.preventDefault();
          setOpen(true);
        }}
        aria-pressed={isDark}
        suppressHydrationWarning
        aria-label="Basculer entre le mode jour et le mode nuit"
        title="Jour / nuit"
        className="utility-z utility-icon-z theme-toggle-z flex size-11 items-center justify-center opacity-90 hover:opacity-100"
      >
        {/* Les deux astres coexistent : l'affichage suit la classe de thème,
         * jamais un état JavaScript — aucun flash au chargement. */}
        <Sun className="theme-icon-z theme-icon-day-z size-4.5" aria-hidden="true" />
        <Moon className="theme-icon-z theme-icon-night-z size-4.5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={() => (open && !closing ? close() : setOpen(true))}
        aria-expanded={open && !closing}
        aria-haspopup="listbox"
        aria-label="Réglages d'apparence"
        className="utility-z absolute -right-0.5 -bottom-0.5 flex size-5 items-center justify-center rounded-full opacity-55 hover:opacity-100"
      >
        <Monitor className="size-3" aria-hidden="true" />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Apparence"
          className={`panel-navy ${closing ? "panel-out" : "panel-in"} absolute right-0 z-50 mt-2 w-52 overflow-hidden py-1`}
        >
          {OPTIONS.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={choice === option.value}
                onClick={() => {
                  setChoice(option.value);
                  close();
                }}
                className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition-[background-color,padding] duration-[var(--dur-2)] ease-[var(--ease-lux)] hover:bg-navy-foreground/10 hover:px-5"
              >
                <span>{option.label}</span>
                <span
                  className={`text-[0.65rem] tracking-wide uppercase ${choice === option.value ? "opacity-90" : "opacity-55"}`}
                >
                  {choice === option.value ? "Actif" : option.hint}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
