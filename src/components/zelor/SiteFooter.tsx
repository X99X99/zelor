import { Link } from "@tanstack/react-router";

import { BRAND } from "@/lib/zelor/content";
import { Newsletter } from "./Newsletter";

const columns = [
  {
    title: "Boutique",
    links: [
      { to: "/nouveautes", label: "Nouveautés" },
      { to: "/collection", label: "Collection" },
      { to: "/panier", label: "Panier" },
    ],
  },
  {
    title: "Maison",
    links: [
      { to: "/univers", label: "L'univers ZELOR" },
      { to: "/qualite", label: "Qualité et sélection" },
      { to: "/journal", label: "Journal" },
      { to: "/a-propos", label: "À propos" },
    ],
  },
  {
    title: "Aide",
    links: [
      { to: "/aide", label: "Centre d'aide" },
      { to: "/contact", label: "Contact" },
      { to: "/livraison", label: "Livraison" },
      { to: "/retours", label: "Retours et remboursements" },
      { to: "/paiements", label: "Moyens de paiement" },
      { to: "/suivi-commande", label: "Suivi de commande" },
    ],
  },
  {
    title: "Informations",
    links: [
      { to: "/mentions-legales", label: "Mentions légales" },
      { to: "/cgv", label: "Conditions générales de vente" },
      { to: "/confidentialite", label: "Confidentialité" },
      { to: "/cookies", label: "Préférences cookies" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="overlay-navy grain-z mt-20 text-navy-foreground">
      <Newsletter />
      <div className="container-z grid gap-10 border-t border-navy-foreground/12 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <Link
            to="/"
            aria-label="ZELOR — accueil"
            className="wordmark-z inline-block font-display text-2xl tracking-[0.4em]"
          >
            {BRAND.name}
          </Link>
          <p className="mt-4 max-w-56 text-sm leading-relaxed text-navy-foreground/65">
            {BRAND.taglineFr}
          </p>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="eyebrow font-sans text-navy-foreground/50">
              {column.title}
            </h2>
            <ul className="mt-5 space-y-3">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="link-underline text-sm text-navy-foreground/80 hover:text-navy-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="container-z flex flex-col gap-3 border-t border-navy-foreground/12 py-7 text-xs text-navy-foreground/55 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {BRAND.name}. Tous droits réservés.
        </p>
        <div className="flex items-center gap-6">
          <p>Maison lifestyle premium — France et Union européenne.</p>
          <button
            type="button"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
            className="link-underline press-z text-navy-foreground/70 hover:text-navy-foreground"
          >
            Haut de page
          </button>
        </div>
      </div>
    </footer>
  );
}

