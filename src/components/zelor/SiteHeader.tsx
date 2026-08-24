import { Link, useRouter } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, User, X, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { BRAND, LANGUAGES, MAIN_NAV } from "@/lib/zelor/content";
import { useCart } from "@/lib/zelor/cart";

function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="border-b border-navy-foreground/10 bg-navy-deep text-navy-foreground">
      <div className="container-z flex items-center justify-center gap-4 py-2">
        <p className="text-center text-[0.6875rem] tracking-[0.18em] uppercase">
          {BRAND.announcement}
        </p>
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Masquer le message d'information"
          className="shrink-0 rounded-sm p-1 opacity-70 transition-opacity duration-500 hover:opacity-100"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function LanguageMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="px-2 py-2 text-xs tracking-[0.16em] uppercase opacity-80 transition-opacity duration-500 hover:opacity-100"
      >
        FR
        <span className="sr-only"> — changer de langue</span>
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="Langues"
          className="veil-in absolute right-0 z-50 mt-2 w-52 overflow-hidden border border-navy-foreground/12 bg-navy-deep/95 py-1 text-navy-foreground shadow-[var(--shadow-float)] backdrop-blur-xl"
        >
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                role="option"
                aria-selected={lang.active}
                disabled={!lang.active}
                className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition-colors duration-400 hover:bg-navy-foreground/10 disabled:cursor-not-allowed disabled:text-navy-foreground/45"
              >
                <span>{lang.label}</span>
                {lang.active ? (
                  <Check className="size-3.5" aria-hidden="true" />
                ) : (
                  <span className="text-[0.65rem] tracking-wide uppercase opacity-70">
                    à activer
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

function SearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  return (
    <div className="veil-in border-t border-navy-foreground/10 bg-navy-deep/92 text-navy-foreground backdrop-blur-xl">
      <form
        className="container-z flex items-center gap-3 py-4"
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
        <Search className="size-4 opacity-70" aria-hidden="true" />
        <input
          id="site-search"
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher une pièce, une ligne…"
          className="min-h-11 w-full bg-transparent text-base outline-none placeholder:text-navy-foreground/45"
        />
        <button
          type="submit"
          className="min-h-11 px-3 text-xs tracking-[0.16em] uppercase underline underline-offset-4 transition-opacity duration-500 hover:opacity-75"
        >
          Rechercher
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la recherche"
          className="min-h-11 px-2 opacity-70 transition-opacity duration-500 hover:opacity-100"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </form>
    </div>
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
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, ready } = useCart();
  const { hidden, scrolled } = useHideOnScroll(menuOpen || searchOpen);

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
      window.scrollTo({ top: scrollY });
    };
  }, [menuOpen]);

  // Échap ferme le menu et la recherche.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        data-hidden={hidden}
        className={`surface-navy sticky top-0 z-50 transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
          hidden ? "-translate-y-full" : "translate-y-0"
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
              className="-ml-2 flex size-11 items-center justify-center opacity-90 transition-opacity duration-500 hover:opacity-100"
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
                className="link-underline text-[0.8125rem] tracking-[0.08em] opacity-85 transition-opacity duration-500 hover:opacity-100"
                activeProps={{ className: "opacity-100 font-semibold" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="font-display text-2xl tracking-[0.4em] transition-opacity duration-500 hover:opacity-80 md:text-[1.75rem]"
            aria-label="ZELOR — accueil"
          >
            {BRAND.name}
          </Link>

          <div className="flex flex-1 items-center justify-end gap-0.5">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-expanded={searchOpen}
              aria-label="Rechercher"
              className="flex size-11 items-center justify-center opacity-90 transition-opacity duration-500 hover:opacity-100"
            >
              <Search className="size-4.5" aria-hidden="true" />
            </button>
            <div className="hidden md:block">
              <LanguageMenu />
            </div>
            <Link
              to="/compte"
              aria-label="Compte client"
              className="hidden size-11 items-center justify-center opacity-90 transition-opacity duration-500 hover:opacity-100 md:flex"
            >
              <User className="size-4.5" aria-hidden="true" />
            </Link>
            <Link
              to="/panier"
              className="relative flex size-11 items-center justify-center opacity-90 transition-opacity duration-500 hover:opacity-100"
              aria-label={`Panier${ready && count > 0 ? ` — ${count} article(s)` : " — vide"}`}
            >
              <ShoppingBag className="size-4.5" aria-hidden="true" />
              {ready && count > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 right-1 min-w-4 rounded-full bg-navy-foreground px-1 text-center text-[0.625rem] leading-4 text-navy"
                >
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} />}
      </header>

      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
          className="veil-in overlay-navy fixed inset-0 z-60 overflow-y-auto md:hidden"
        >
          <div className="container-z flex items-center justify-between py-4">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              aria-label="ZELOR — accueil"
              className="font-display text-2xl tracking-[0.4em] transition-opacity duration-500 hover:opacity-80"
            >
              {BRAND.name}
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Fermer le menu"
              className="-mr-2 flex size-11 items-center justify-center opacity-80 transition-opacity duration-500 hover:opacity-100"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Navigation mobile" className="container-z flex flex-col pt-6 pb-16">
            <p className="eyebrow mb-2 text-navy-foreground/50">Collection</p>
            {MAIN_NAV.map((item, index) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                style={{ animationDelay: `${60 + index * 55}ms` }}
                className="menu-row slide-up-lux font-display text-3xl"
              >
                <span>{item.label}</span>
                <span aria-hidden="true" className="text-xs tracking-[0.2em] opacity-40">
                  0{index + 1}
                </span>
              </Link>
            ))}
            <p className="eyebrow mt-10 mb-2 text-navy-foreground/50">Services</p>
            <Link
              to="/compte"
              onClick={() => setMenuOpen(false)}
              className="menu-row text-sm tracking-[0.08em]"
            >
              Compte client
            </Link>
            <Link
              to="/aide"
              onClick={() => setMenuOpen(false)}
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
