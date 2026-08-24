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
    <footer className="mt-24 bg-forest text-forest-foreground">
      <Newsletter />
      <div className="container-z grid gap-10 border-t border-forest-foreground/15 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <p className="font-display text-2xl tracking-[0.4em]">{BRAND.name}</p>
          <p className="mt-3 max-w-56 text-sm text-forest-foreground/70">
            {BRAND.taglineFr}
          </p>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="eyebrow font-sans text-forest-foreground/60">
              {column.title}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-forest-foreground/90 underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="container-z flex flex-col gap-3 border-t border-forest-foreground/15 py-6 text-xs text-forest-foreground/60 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {BRAND.name} — [STATUT JURIDIQUE À
          RENSEIGNER]
        </p>
        <p>Site de préproduction. Contenus provisoires à valider.</p>
      </div>
    </footer>
  );
}
