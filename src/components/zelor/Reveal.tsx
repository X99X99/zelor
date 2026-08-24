import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Apparition douce au défilement : jamais d'élément qui « pop ».
 *
 * Deux régimes, volontairement distincts :
 * — par défaut, l'apparition est définitive ; l'observateur se détache.
 * — `replay`, réservé aux séquences éditoriales majeures : la section se
 *   retire lorsqu'elle quitte largement le champ, puis se rejoue au retour.
 *   À n'utiliser que là où le rejeu ajoute du désir, jamais par réflexe.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  replay = false,
  className = "",
  ...rest
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  replay?: boolean;
  className?: string;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (!replay) observer.disconnect();
          } else if (replay) {
            // On ne retire la section que lorsqu'elle a franchement quitté
            // le champ : aucun clignotement en bordure d'écran.
            setVisible(false);
          }
        }
      },
      replay
        ? { rootMargin: "22% 0px 22% 0px", threshold: 0 }
        : { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [replay]);

  return (
    <Tag
      ref={ref}
      data-visible={visible}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal-z ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
