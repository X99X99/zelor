import { Link, useRouter } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, User, X, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
        <p className="text-center text-[0.6875rem] tracking-[0.18em] text-navy-foreground/85 uppercase">
          {BRAND.announcement}
        </p>
        <button
          type="button"
          onClick={close}
          aria-label="Masquer le message d'information"
          className="utility-z utility-icon-z shrink-0 p-1.5 opacity-60 hover:opacity-100"
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
    function onClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen((v) => {
          if (v) close();
          return v;
        });
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open && !closing}
        aria-haspopup="listbox"
        className={`utility-z flex size-11 items-center justify-center rounded-full text-[0.6875rem] tracking-[0.14em] uppercase ${open ? "bg-navy-foreground/12 opacity-100 shadow-[0_0_0_1px_color-mix(in_oklab,currentColor_18%,transparent)]" : "opacity-90"} hover:opacity-100`}
      >
        FR
        <span className="sr-only"> — changer de langue</span>
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="Langues"
          className={`panel-navy ${closing ? "panel-out" : "panel-in"} absolute right-0 z-50 mt-2 w-52 overflow-hidden py-1`}
        >
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                role="option"
                aria-selected={lang.active}
                disabled={!lang.active}
                className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition-[background-color,padding] duration-[var(--dur-2)] ease-[var(--ease-lux)] hover:bg-navy-foreground/10 hover:px-5 disabled:cursor-not-allowed disabled:text-navy-foreground/45 disabled:hover:px-4"
              >
                <span>{lang.label}</span>
                {lang.active ? (
                  <Check className="size-3.5" aria-hidden="true" />
                ) : (
                  <span className="text-[0.65rem] tracking-wide uppercase opacity-70">
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

function SearchPanel({
  onClose,
  closing,
}: {
  onClose: () => void;
  closing: boolean;
}) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  return (
    <div
      className={`surface-search grain-z relative overflow-hidden ${closing ? "unfold-out-z" : "unfold-z"}`}
    >
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
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher une pièce, une ligne…"
            className="w-full bg-transparent text-base text-navy-foreground outline-none placeholder:text-navy-foreground/45"
          />
        </div>
        <button
          type="submit"
          className="btn-veil hidden shrink-0 sm:inline-flex"
        >
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
    </div>
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

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchClosing, setSearchClosing] = useState(false);
  const [bump, setBump] = useState(false);
  const { count, ready } = useCart();
  const { hidden, scrolled } = useHideOnScroll(menuOpen || searchOpen);

  // Fermeture aussi soignée que l'ouverture : le voile se retire, puis démonte.
  const closeMenu = () => {
    if (!menuOpen || menuClosing) return;
    setMenuClosing(true);
    window.setTimeout(() => {
      setMenuClosing(false);
      setMenuOpen(false);
    }, 380);
  };

  // La recherche se replie avec le même soin qu'elle se déploie.
  const closeSearch = () => {
    if (!searchOpen || searchClosing) return;
    setSearchClosing(true);
    window.setTimeout(() => {
      setSearchClosing(false);
      setSearchOpen(false);
    }, 420);
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
      <header
        data-hidden={hidden}
        className={`surface-navy grain-z sticky top-0 z-50 transition-[transform,opacity,box-shadow,backdrop-filter] duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
          hidden
            ? "pointer-events-none -translate-y-full opacity-0"
            : "translate-y-0 opacity-100"
        } ${scrolled ? "shadow-[var(--shadow-elegant)]" : "shadow-none"}`}
      >

        <AnnouncementBar />
        <div className="container-z flex items-center justify-between gap-4 py-4">
          <div className="flex flex-1 items-center gap-1 md:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={menuOpen}
              className="utility-z -ml-2 flex size-11 items-center justify-center opacity-90 hover:opacity-100"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>

          <nav
            aria-label="Navigation principale"
            className="hidden flex-1 items-center gap-7 md:flex"
          >
            {MAIN_NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="link-underline text-[0.8125rem] tracking-[0.08em] opacity-85 hover:opacity-100"
                activeProps={{ className: "opacity-100 font-semibold" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            to="/"
            onClick={closeMenu}
            className="wordmark-z font-display text-2xl tracking-[0.4em] md:text-[1.75rem]"
            aria-label="ZELOR — accueil"
          >
            {BRAND.name}
          </Link>

          <div className="flex flex-1 items-center justify-end gap-0.5">
            <button
              type="button"
              onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
              aria-expanded={searchOpen && !searchClosing}
              aria-label="Rechercher"
              className={`utility-z flex size-11 items-center justify-center ${searchOpen && !searchClosing ? "opacity-100" : "opacity-90"} hover:opacity-100`}
            >
              <Search
                className={`size-4.5 transition-transform duration-[var(--dur-3)] ease-[var(--ease-lux)] ${searchOpen && !searchClosing ? "rotate-90 scale-90" : ""}`}
                aria-hidden="true"
              />
            </button>
            <div className="hidden md:block">
              <LanguageMenu />
            </div>
            <Link
              to="/compte"
              aria-label="Compte client"
              className="utility-z hidden size-11 items-center justify-center opacity-90 hover:opacity-100 md:flex"
            >
              <User className="size-4.5" aria-hidden="true" />
            </Link>
            <Link
              to="/panier"
              className="utility-z relative flex size-11 items-center justify-center opacity-90 hover:opacity-100"
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
          <SearchPanel onClose={closeSearch} closing={searchClosing} />
        )}
        <ReadingProgress />
      </header>

      {menuOpen && (
        <div
          className={`fixed inset-0 z-70 bg-[color-mix(in_oklab,var(--navy-deep)_55%,transparent)] backdrop-blur-sm md:hidden ${menuClosing ? "overlay-out" : "overlay-in"}`}
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
          className={`overlay-navy grain-z sheet-z fixed inset-2 z-70 overflow-y-auto md:hidden ${menuClosing ? "overlay-out" : "overlay-in"}`}
        >
          <div className="container-z flex items-center justify-between py-4">
            <Link
              to="/"
              onClick={closeMenu}
              aria-label="ZELOR — accueil"
              className="wordmark-z font-display text-2xl tracking-[0.4em]"
            >
              {BRAND.name}
            </Link>
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Fermer le menu"
              className="utility-z -mr-2 flex size-11 items-center justify-center opacity-80 hover:opacity-100"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <nav
            aria-label="Navigation mobile"
            className="focal-list container-z flex flex-col pt-6 pb-16"
          >
            <p className="eyebrow mb-2 text-navy-foreground/50">Collection</p>
            {MAIN_NAV.map((item, index) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={closeMenu}
                data-focal=""
                style={{ animationDelay: menuClosing ? "0ms" : `${60 + index * 55}ms` }}
                className={`menu-row font-display text-3xl ${menuClosing ? "" : "slide-up-lux"}`}
              >
                <span>{item.label}</span>
              </Link>
            ))}
            <p className="eyebrow mt-10 mb-2 text-navy-foreground/50">Services</p>
            <Link
              to="/compte"
              onClick={closeMenu}
              className="menu-row text-sm tracking-[0.08em]"
            >
              Compte client
            </Link>
            <Link
              to="/aide"
              onClick={closeMenu}
              className="menu-row text-sm tracking-[0.08em]"
            >
              Aide et contact
            </Link>
            <div className="menu-row text-sm tracking-[0.08em]">
              <span>Langue</span>
              <LanguageMenu />
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
