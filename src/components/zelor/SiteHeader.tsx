import { Link, useRouter } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, User, X, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { BRAND, LANGUAGES, MAIN_NAV } from "@/lib/zelor/content";
import { useCart } from "@/lib/zelor/cart";

function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="bg-forest text-forest-foreground">
      <div className="container-z flex items-center justify-center gap-4 py-2">
        <p className="text-center text-xs tracking-wide">{BRAND.announcement}</p>
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Masquer le message d'information"
          className="shrink-0 rounded-sm p-1 transition-opacity hover:opacity-70"
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
        className="px-2 py-2 text-xs tracking-[0.16em] uppercase transition-opacity hover:opacity-60"
      >
        FR
        <span className="sr-only"> — changer de langue</span>
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="Langues"
          className="absolute right-0 z-50 mt-1 w-48 border border-border bg-card py-1 shadow-sm"
        >
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                role="option"
                aria-selected={lang.active}
                disabled={!lang.active}
                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-accent disabled:cursor-not-allowed disabled:text-muted-foreground"
              >
                <span>{lang.label}</span>
                {lang.active ? (
                  <Check className="size-3.5" aria-hidden="true" />
                ) : (
                  <span className="text-[0.65rem] tracking-wide uppercase">
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
    <div className="rule-z bg-card">
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
        <Search className="size-4 text-muted-foreground" aria-hidden="true" />
        <input
          id="site-search"
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher"
          className="min-h-11 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="min-h-11 px-3 text-sm tracking-wide underline underline-offset-4"
        >
          Rechercher
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la recherche"
          className="min-h-11 px-2"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, ready } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm">
      <AnnouncementBar />
      <div className="container-z flex items-center justify-between gap-4 py-4">
        <div className="flex flex-1 items-center gap-1 md:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
            className="-ml-2 flex size-11 items-center justify-center"
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
              className="link-underline text-sm"
              activeProps={{ className: "font-semibold" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/"
          className="font-display text-2xl tracking-[0.4em] md:text-[1.75rem]"
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
            className="flex size-11 items-center justify-center"
          >
            <Search className="size-4.5" aria-hidden="true" />
          </button>
          <div className="hidden md:block">
            <LanguageMenu />
          </div>
          <Link
            to="/compte"
            aria-label="Compte client"
            className="hidden size-11 items-center justify-center md:flex"
          >
            <User className="size-4.5" aria-hidden="true" />
          </Link>
          <Link
            to="/panier"
            className="relative flex size-11 items-center justify-center"
            aria-label={`Panier${ready && count > 0 ? ` — ${count} article(s)` : " — vide"}`}
          >
            <ShoppingBag className="size-4.5" aria-hidden="true" />
            {ready && count > 0 && (
              <span
                aria-hidden="true"
                className="absolute top-1.5 right-1 min-w-4 rounded-full bg-forest px-1 text-center text-[0.625rem] leading-4 text-forest-foreground"
              >
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} />}

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="container-z flex items-center justify-between py-4">
            <span className="font-display text-2xl tracking-[0.4em]">
              {BRAND.name}
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Fermer le menu"
              className="-mr-2 flex size-11 items-center justify-center"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <nav
            aria-label="Navigation mobile"
            className="container-z flex flex-col pt-4"
          >
            {MAIN_NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="rule-z py-4 font-display text-2xl"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/compte"
              onClick={() => setMenuOpen(false)}
              className="rule-z py-4 text-sm"
            >
              Compte client
            </Link>
            <div className="rule-z flex items-center justify-between py-4 text-sm">
              <span>Langue</span>
              <LanguageMenu />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
