import { Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useFocusReturn } from "@/hooks/useFocusReturn";
import { useTheme, type ThemeChoice } from "@/lib/zelor/theme";

/**
 * Contrôle d'apparence ZELOR — **unique** commande visible du header.
 *
 * Un seul bouton : soleil en lumière claire, lune en profondeur marine,
 * icône centrée, même matière que les autres utilitaires. Il ouvre une
 * liste sobre à trois états (clair, sombre, suivre le système) : le retour
 * au réglage système passe par ce même composant, jamais par un second
 * bouton concurrent. L'affichage de l'astre est piloté en CSS (classe de
 * thème), donc aucun flash ni décalage d'hydratation.
 */
const OPTIONS: { value: ThemeChoice; label: string }[] = [
  { value: "light", label: "Lumière claire" },
  { value: "dark", label: "Profondeur marine" },
  { value: "system", label: "Suivre le système" },
];

export function AppearanceControl({ className = "" }: { className?: string }) {
  const { choice, setChoice } = useTheme();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Le focus revient au bouton d'apparence à la fermeture, quelle qu'en soit
  // la cause : Échap, clic extérieur, ou choix d'une option.
  useFocusReturn(open);

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
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
    // `close` ne dépend que de ces deux états : se réabonner à chaque rendu,
    // comme avant, ajoutait un retrait et un ajout d'écouteur pour rien.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, closing]);

  // À l'ouverture, le focus va sur l'option active : le clavier entre dans la
  // liste là où l'utilisateur se trouve déjà, pas au début.
  useEffect(() => {
    if (!open || closing) return;
    const active = ref.current?.querySelector<HTMLElement>('[role="option"][aria-selected="true"]');
    active?.focus({ preventScroll: true });
  }, [open, closing]);

  // Le libellé dépend d'une donnée client (choix mémorisé) : on ne l'écrit
  // qu'après l'hydratation, sinon l'attribut rendu par le serveur reste figé.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const activeLabel = OPTIONS.find((o) => o.value === choice)?.label ?? "Suivre le système";
  const buttonLabel = mounted ? `Apparence : ${activeLabel}` : "Apparence";

  return (
    <div
      className={`relative ${className}`.trim()}
      ref={ref}
      // Le panneau se ferme quand le focus quitte *réellement* le conteneur.
      // Une cible liée nulle signifie que le focus part hors de la fenêtre ou
      // vers une zone non focalisable : on ne ferme pas, sinon une tabulation
      // interne ou un clic ailleurs dans la page fermerait deux fois.
      onBlur={(event) => {
        const next = event.relatedTarget;
        if (next instanceof Node && !event.currentTarget.contains(next)) close();
      }}
    >
      <button
        type="button"
        onClick={() => (open && !closing ? close() : setOpen(true))}
        aria-expanded={open && !closing}
        aria-haspopup="listbox"
        // Posé seulement quand le panneau existe : le référencer alors qu'il
        // n'est pas monté serait une référence morte, donc une erreur
        // d'accessibilité introduite en croyant en corriger une.
        aria-controls={open ? "zelor-appearance-panel" : undefined}
        aria-label={buttonLabel}
        title={mounted ? activeLabel : undefined}
        suppressHydrationWarning
        className={`utility-z utility-icon-z theme-toggle-z size-11 ${open && !closing ? "bg-navy-foreground/12 opacity-100 shadow-[0_0_0_1px_color-mix(in_oklab,currentColor_18%,transparent)]" : "opacity-90"} hover:opacity-100`}
      >
        {/* Les deux astres coexistent : seul le CSS décide lequel se montre. */}
        <Sun className="theme-icon-z theme-icon-day-z size-4.5" aria-hidden="true" />
        <Moon className="theme-icon-z theme-icon-night-z size-4.5" aria-hidden="true" />
      </button>

      {open && (
        <ul
          id="zelor-appearance-panel"
          role="listbox"
          aria-label="Apparence"
          className={`panel-navy ${closing ? "panel-out" : "panel-in"} absolute right-0 z-50 mt-1.5 w-56 overflow-hidden py-1`}
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
                className="flex min-h-11 w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-[background-color,padding] duration-[var(--dur-2)] ease-[var(--ease-lux)] hover:bg-navy-foreground/10 hover:px-5"
              >
                <span>{option.label}</span>
                {choice === option.value && (
                  <span className="text-[0.65rem] tracking-wide uppercase opacity-80">Actif</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
