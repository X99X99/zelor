import { Link, useRouter } from "@tanstack/react-router";
import { Search, ShoppingBag, User, X, Check } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { useFocusReturn } from "@/hooks/useFocusReturn";
import { BrandLink, NavLink } from "@/components/zelor/NavLink";
import { NavySurface, NAVY_SURFACE_EXIT_MS } from "@/components/zelor/NavySurface";
import { AppearanceControl } from "@/components/zelor/AppearanceControl";
import { BRAND, LANGUAGES, MAIN_NAV } from "@/lib/zelor/content";
import { useCart } from "@/lib/zelor/cart";

function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);

  const close = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(() => setVisible(false), 420);
  };

  if (!visible) return null;
  return (
    <div
      className={`veil-top seam-z relative text-navy-foreground ${closing ? "collapse-out-z" : ""}`}
    >
      <div className="container-z flex items-center justify-center gap-4 py-2.5">
        <p className="text-center text-[0.6875rem] tracking-[0.18em] text-navy-foreground/75 uppercase">
          {BRAND.announcement}
        </p>
        <button
          type="button"
          onClick={close}
          aria-label="Masquer le message d'information"
          className="utility-z utility-icon-z tap-target-z shrink-0 p-1.5 opacity-60 hover:opacity-100"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function LanguageMenu() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Le focus revient au bouton de langue à la fermeture, quelle qu'en soit la
  // cause : Échap, clic extérieur, ou choix d'une langue.
  useFocusReturn(open);

  // Fermeture animée : le panneau se retire, puis se démonte.
  const close = () => {
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      setOpen(false);
    }, 260);
  };

  const toggle = () => (open && !closing ? close() : setOpen(true));

  useEffect(() => {
    function closeIfOpen() {
      setOpen((v) => {
        if (v) close();
        return v;
      });
    }
    function onClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) closeIfOpen();
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") closeIfOpen();
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // À l'ouverture, le focus entre sur la langue active : le clavier arrive là
  // où l'utilisateur se trouve déjà, pas en tête de liste.
  useEffect(() => {
    if (!open || closing) return;
    const active = ref.current?.querySelector<HTMLElement>('[role="option"][aria-selected="true"]');
    active?.focus({ preventScroll: true });
  }, [open, closing]);

  return (
    <div
      className="relative"
      ref={ref}
      // On ne ferme que si le focus quitte réellement le conteneur : une cible
      // liée nulle signifie hors fenêtre ou zone non focalisable, et fermer
      // dans ce cas couperait une tabulation interne.
      onBlur={(event) => {
        const next = event.relatedTarget;
        if (next instanceof Node && !event.currentTarget.contains(next)) {
          setOpen((v) => {
            if (v) close();
            return v;
          });
        }
      }}
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open && !closing}
        aria-haspopup="listbox"
        // Posé seulement quand le panneau est monté : référencer un
        // identifiant absent serait une erreur d'accessibilité de plus.
        aria-controls={open ? "zelor-language-panel" : undefined}
        className={`utility-z flex size-11 items-center justify-center rounded-full text-[0.6875rem] tracking-[0.14em] uppercase ${open ? "bg-navy-foreground/12 opacity-100 shadow-[0_0_0_1px_color-mix(in_oklab,currentColor_18%,transparent)]" : "opacity-90"} hover:opacity-100`}
      >
        FR
        <span className="sr-only"> — changer de langue</span>
      </button>
      {open && (
        <ul
          id="zelor-language-panel"
          role="listbox"
          aria-label="Langues"
          className={`panel-navy ${closing ? "panel-out" : "panel-in"} absolute right-0 z-50 mt-1.5 w-52 overflow-hidden py-1`}
        >
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                role="option"
                aria-selected={lang.active}
                disabled={!lang.active}
                className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition-[background-color,padding] duration-[var(--dur-2)] ease-[var(--ease-lux)] hover:bg-navy-foreground/10 hover:px-5 disabled:cursor-not-allowed disabled:text-navy-foreground/60 disabled:hover:px-4"
              >
                <span>{lang.label}</span>
                {lang.active ? (
                  <Check className="size-3.5" aria-hidden="true" />
                ) : (
                  <span className="text-[0.65rem] tracking-wide uppercase opacity-55">
                    Prochainement
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SearchPanel({ onClose, closing }: { onClose: () => void; closing: boolean }) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // La prise de focus ne doit jamais déplacer la lecture : le panneau
  // s'ouvre sous un header collant, la page reste exactement où elle est.
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <NavySurface animate closing={closing} material={false} className="relative overflow-hidden">
      <form
        className="container-z flex items-center gap-3 py-5"
        onSubmit={(event) => {
          event.preventDefault();
          onClose();
          router.navigate({
            to: "/collection",
            search: query ? { q: query } : {},
          });
        }}
      >
        <label htmlFor="site-search" className="sr-only">
          Rechercher un produit
        </label>
        <div className="input-z flex min-h-12 flex-1 items-center gap-3 px-5 text-navy-foreground">
          <Search className="size-4 shrink-0 opacity-70" aria-hidden="true" />
          <input
            id="site-search"
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher une pièce, une ligne…"
            className="w-full bg-transparent text-base text-navy-foreground outline-none placeholder:text-navy-foreground/60"
          />
        </div>
        <button type="submit" className="btn-veil hidden shrink-0 sm:inline-flex">
          Rechercher
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la recherche"
          className="utility-z flex size-12 shrink-0 items-center justify-center opacity-70 hover:opacity-100"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </form>
    </NavySurface>
  );
}

/** Filet de progression de lecture : l'épaisseur d'un cheveu, sous le header. */
function ReadingProgress() {
  const [ratio, setRatio] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setRatio(max > 40 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <span
      aria-hidden="true"
      className="progress-track-z pointer-events-none absolute inset-x-0 bottom-0 block h-0.5 overflow-visible"
    >
      <span
        className="progress-z block h-full"
        style={{
          width: `${ratio * 100}%`,
          opacity: ratio > 0.004 ? 1 : 0,
        }}
      />
    </span>
  );
}

/** Masque le header au défilement vers le bas, le révèle au défilement vers le haut. */
function useHideOnScroll(locked: boolean) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    if (locked) {
      setHidden(false);
      return;
    }
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const delta = y - lastY.current;
        setScrolled(y > 8);
        if (y < 120) setHidden(false);
        else if (delta > 6) setHidden(true);
        else if (delta < -6) setHidden(false);
        lastY.current = y;
      });
    };
    lastY.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [locked]);

  return { hidden, scrolled };
}

/**
 * Ce qui peut recevoir le focus dans une fenêtre modale.
 *
 * On écarte tabindex="-1" : ces éléments sont focalisables par script, jamais
 * par tabulation, et les inclure dans la boucle ferait tourner le piège sur
 * des cibles que l'utilisateur ne peut pas atteindre autrement.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchClosing, setSearchClosing] = useState(false);
  const [bump, setBump] = useState(false);
  const { count, ready } = useCart();
  const { hidden, scrolled } = useHideOnScroll(menuOpen || searchOpen);
  const menuRef = useRef<HTMLDivElement>(null);

  // Le focus revient au bouton qui a ouvert le panneau, dans les deux cas et
  // quelle que soit la façon dont on ferme : Échap, bouton de fermeture, clic
  // sur le voile, ou navigation depuis un lien du menu.
  useFocusReturn(menuOpen);
  useFocusReturn(searchOpen);

  // Fermeture aussi soignée que l'ouverture : le voile se retire, puis démonte.
  const closeMenu = () => {
    if (!menuOpen || menuClosing) return;
    setMenuClosing(true);
    window.setTimeout(() => {
      setMenuClosing(false);
      setMenuOpen(false);
    }, 380);
  };

  // La recherche se replie exactement comme elle se déploie :
  // même durée (--dur-4), courbe miroir. L'aller et le retour se valent.
  const closeSearch = () => {
    if (!searchOpen || searchClosing) return;
    setSearchClosing(true);
    window.setTimeout(() => {
      setSearchClosing(false);
      setSearchOpen(false);
    }, NAVY_SURFACE_EXIT_MS);
  };

  // Le panier respire lorsqu'une pièce est ajoutée.
  const firstCount = useRef(true);
  useEffect(() => {
    if (firstCount.current) {
      firstCount.current = false;
      return;
    }
    setBump(true);
    const t = setTimeout(() => setBump(false), 620);
    return () => clearTimeout(t);
  }, [count]);

  // Blocage total du défilement de fond lorsque le menu est ouvert.
  useEffect(() => {
    if (!menuOpen) return;
    const { body } = document;
    const scrollY = window.scrollY;
    const previous = body.style.cssText;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    return () => {
      body.style.cssText = previous;
      // Restitution exacte, sans animation : la position ne doit pas « glisser ».
      // Un reflow forcé garantit que la hauteur du document est rétablie avant
      // le repositionnement, puis on confirme à la frame suivante (mobile).
      void body.offsetHeight;
      const restore = () =>
        window.scrollTo({
          top: scrollY,
          left: 0,
          behavior: "instant" as ScrollBehavior,
        });
      restore();
      window.requestAnimationFrame(restore);
    };
  }, [menuOpen]);

  // ————— Piège à focus du menu —————
  //
  // Le menu est la seule vraie fenêtre modale du site : il porte
  // aria-modal="true", donc le reste de la page est déclaré inerte et la
  // tabulation doit y tourner en boucle. Les trois autres panneaux ne piègent
  // rien : enfermer quelqu'un dans une liste de trois options serait un
  // anti-motif, on s'y contente d'Échap et du retour du focus.
  useEffect(() => {
    if (!menuOpen) return;
    const node = menuRef.current;
    if (!node) return;

    // Le focus entre par le bouton de fermeture : c'est la sortie, et c'est
    // ce qu'un visiteur au clavier cherche d'abord.
    const closeButton = node.querySelector<HTMLElement>("[data-menu-close]");
    (closeButton ?? node).focus({ preventScroll: true });

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      // On recalcule à chaque tabulation : le contenu du menu peut changer,
      // et un élément masqué ou désactivé ne doit jamais recevoir le focus.
      // getClientRects plutôt que offsetParent, qui vaut null sur tout
      // descendant d'un conteneur en position fixe — ce qu'est ce menu.
      const items = [...node.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => !el.hasAttribute("disabled") && el.getClientRects().length > 0,
      );

      const first = items[0];
      const last = items[items.length - 1];
      // Aucun élément focalisable : le focus reste sur le conteneur plutôt
      // que de repartir dans la page derrière.
      if (!first || !last) {
        event.preventDefault();
        node.focus({ preventScroll: true });
        return;
      }

      // Avec un seul élément, first et last sont le même : la boucle revient
      // sur lui, ce qui est le comportement attendu.
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    // Échap n'est jamais intercepté ici : il reste géré plus bas, au niveau du
    // document, et ferme le menu comme avant.
    node.addEventListener("keydown", onKey);
    return () => node.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Échap ferme le menu et la recherche.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        closeSearch();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  return (
    <>
      <NavySurface
        as="header"
        data-hidden={hidden}
        className={`header-motion-z sticky top-0 z-50 ${
          scrolled ? "shadow-[var(--shadow-elegant)]" : "shadow-none"
        }`}
      >
        <AnnouncementBar />
        <div className="container-z flex items-center justify-between gap-2 py-4 sm:gap-4">
          <div className="flex flex-1 items-center gap-1 lg:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-controls={menuOpen ? "zelor-menu-panel" : undefined}
              aria-label="Ouvrir le menu"
              aria-expanded={menuOpen}
              className="utility-z -ml-2 flex size-11 items-center justify-center opacity-90 hover:opacity-100"
            >
              {/* Deux barres, pas un pictogramme : elles pivotent en croix à
                  l'ouverture et se remettent à plat à la fermeture, sans
                  jamais disparaître. Le geste de la référence. */}
              <span className="burger-z" data-open="false" aria-hidden="true" />
            </button>
          </div>

          <nav
            aria-label="Navigation principale"
            className="-ml-3 hidden flex-1 items-center gap-1 lg:flex"
          >
            {MAIN_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="text-[0.8125rem] tracking-[0.08em] opacity-75 hover:opacity-100"
                activeClassName="opacity-100"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Sous 375px, hamburger + mot-symbole + 3 icônes ne tenaient plus
              dans les 280px de contenu disponibles (mesuré : 46,5px de trop) —
              l'icône panier débordait hors écran. Resserré ici uniquement ;
              taille et interlettrage repartent de leur valeur habituelle dès
              375px, aucune des trois cibles tactiles de 44px n'est réduite. */}
          <BrandLink
            onNavigate={closeMenu}
            className="wordmark-z max-[374px]:tracking-[0.28em] font-display text-2xl tracking-[0.4em] max-[374px]:text-xl lg:text-[1.75rem]"
          >
            {BRAND.name}
          </BrandLink>

          <div className="flex flex-1 items-center justify-end gap-0.5">
            <button
              type="button"
              onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
              aria-controls={searchOpen ? "zelor-search-panel" : undefined}
              aria-expanded={searchOpen && !searchClosing}
              aria-label="Rechercher"
              className={`utility-z utility-icon-z flex size-11 items-center justify-center ${searchOpen && !searchClosing ? "opacity-100" : "opacity-90"} hover:opacity-100`}
            >
              <Search
                className={`size-4.5 ${searchOpen && !searchClosing ? "rotate-90" : "rotate-0"}`}
                aria-hidden="true"
              />
            </button>
            <AppearanceControl />
            <div className="hidden lg:block">
              <LanguageMenu />
            </div>

            <Link
              to="/compte"
              aria-label="Compte client"
              className="utility-z utility-icon-z hidden size-11 items-center justify-center opacity-90 hover:opacity-100 lg:flex"
            >
              <User className="size-4.5" aria-hidden="true" />
            </Link>
            <Link
              to="/panier"
              className="utility-z utility-icon-z relative flex size-11 items-center justify-center opacity-90 hover:opacity-100"
              aria-label={`Panier${ready && count > 0 ? ` — ${count} article(s)` : " — vide"}`}
            >
              <ShoppingBag className="size-4.5" aria-hidden="true" />

              {ready && count > 0 && (
                <span
                  aria-hidden="true"
                  className={`absolute top-1.5 right-1 min-w-4 rounded-full bg-navy-foreground px-1 text-center text-[0.625rem] leading-4 text-navy transition-transform duration-[var(--dur-3)] ease-[var(--ease-lux)] ${bump ? "scale-125" : "scale-100"}`}
                >
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {searchOpen && (
          <div
            id="zelor-search-panel"
            className={`slot-z ${searchClosing ? "slot-out-z" : "slot-in-z"}`}
            // On ne ferme que si le focus quitte réellement le panneau : la
            // tabulation entre le champ, le bouton d'envoi et le bouton de
            // fermeture doit rester possible sans que tout se referme.
            onBlur={(event) => {
              const next = event.relatedTarget;
              if (next instanceof Node && !event.currentTarget.contains(next)) closeSearch();
            }}
          >
            <div>
              <SearchPanel onClose={closeSearch} closing={searchClosing} />
            </div>
          </div>
        )}

        <ReadingProgress />
      </NavySurface>

      {menuOpen && (
        <div
          className={`fixed inset-0 z-70 bg-[color-mix(in_oklab,var(--navy-deep)_55%,transparent)] backdrop-blur-sm lg:hidden ${menuClosing ? "overlay-out" : "overlay-in"}`}
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
      {menuOpen && (
        <div
          id="zelor-menu-panel"
          ref={menuRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
          className={`overlay-navy grain-z fixed inset-0 z-70 overflow-y-auto lg:hidden ${menuClosing ? "overlay-out" : "overlay-in"}`}
        >
          {/* La croix prend exactement la place du hamburger — même carré,
              même colonne, même hauteur de ligne. Sur la référence c'est le
              seul repère fixe entre les deux états : le bouton ne se déplace
              pas, il change de signe. */}
          <div className="container-z flex items-center justify-between py-4">
            <button
              type="button"
              onClick={closeMenu}
              data-menu-close="true"
              aria-label="Fermer le menu"
              className="utility-z -ml-2 flex size-11 items-center justify-center opacity-80 hover:opacity-100"
            >
              {/* Les mêmes deux barres, croisées : le bouton ne change pas
                  d'objet en changeant d'état. */}
              <span className="burger-z" data-open="true" aria-hidden="true" />
            </button>
            <BrandLink
              onNavigate={closeMenu}
              className="wordmark-z font-display text-2xl tracking-[0.4em]"
            >
              {BRAND.name}
            </BrandLink>
            {/* Contrepoids de la largeur du bouton : sans lui le mot-symbole
                n'est pas au centre de l'écran mais au centre de ce qu'il
                reste. */}
            <span aria-hidden="true" className="size-11 shrink-0" />
          </div>

          <nav
            aria-label="Navigation mobile"
            className="focal-list container-z flex flex-col pt-8 pb-16"
          >
            {/* Une seule liste, numérotée : six destinations, et le compteur
                le dit. Le découpage en deux rubriques faisait passer « Compte
                client » pour une autre espèce de lien alors que c'est une
                destination comme les cinq autres. */}
            <ol className="menu-index-list-z">
              {[...MAIN_NAV, { to: "/compte", label: "Compte" } as const].map((item, index) => (
                <li key={item.to} style={{ "--i": index } as CSSProperties}>
                  <NavLink
                    to={item.to}
                    variant="sheet"
                    onNavigate={closeMenu}
                    data-focal=""
                    className="menu-entry-z"
                  >
                    {/* Aucune animation d'entrée propre : chaque entrée réagit
                     * exactement comme « Langue », sans montée parasite ni
                     * écart de timing au retour. */}
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ol>

            {/* La référence pose ici ses coordonnées — téléphone et courriel.
                ZELOR n'en publie aucune, et on n'en invente pas ; un lien
                « Contact » ferait par ailleurs doublon avec « Aide », déjà
                cinquième entrée. Le pied du menu ne porte donc que le
                contrôle de langue, comme avant.

                Il doit rester le dernier `[data-focal]` du panneau : un
                garde-fou prend le dernier d'entre eux comme référence de
                signature de mouvement, et tout ce qu'on ajouterait après lui
                changerait ce à quoi les six entrées sont comparées. */}
            <div className="menu-foot-z text-navy-foreground/70">
              <div data-focal="" className="menu-row text-sm tracking-[0.08em]">
                <span>Langue</span>
                <LanguageMenu />
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
