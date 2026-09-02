import { BRAND } from "@/lib/zelor/content";
import { BrandLink, NavLink, scrollToTop } from "@/components/zelor/NavLink";
import { LineReveal } from "./LineReveal";
import { Reveal } from "./Reveal";
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
    <footer className="overlay-navy grain-z shoreline-z mt-28 text-navy-foreground">
      <Newsletter />

      {/* ————— La clôture —————
          Un pied de page de maison n'est pas une barre de liens : c'est la fin
          de l'expérience, et elle mérite la même respiration que son ouverture.
          Chez Vero il occupe presque un écran entier. On y pose la signature en
          entier — l'accueil n'en montre que la seconde moitié — au palier
          d'affichage, révélée derrière une fenêtre.

          Les dix-sept liens qui suivent ne bougent pas d'une ligne : c'est la
          composition qui change, jamais la navigation. */}
      <Reveal
        as="section"
        aria-labelledby="footer-signature"
        className="container-z border-t border-navy-foreground/12 py-24 md:py-32"
      >
        <p className="eyebrow text-navy-foreground/45">Maison ZELOR</p>
        <LineReveal id="footer-signature" className="mt-6 max-w-5xl display-2-z">
          L'élégance dans chaque détail, pour faire de chaque détail une <em>promesse</em>.
        </LineReveal>
      </Reveal>

      <div className="container-z grid gap-10 border-t border-navy-foreground/12 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <BrandLink className="wordmark-z inline-block font-display text-2xl tracking-[0.4em]">
            {BRAND.name}
          </BrandLink>
          <p className="mt-4 max-w-56 text-sm leading-relaxed text-navy-foreground/65">
            Maison éditoriale française, pensée à Nice et tournée vers l'international.
          </p>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="eyebrow font-sans text-navy-foreground/50">{column.title}</h2>
            <ul className="mt-5 space-y-3">
              {column.links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    variant="footer"
                    className="text-sm text-navy-foreground/80 hover:text-navy-foreground"
                    activeClassName="text-navy-foreground"
                  >
                    {link.label}
                  </NavLink>
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
            onClick={scrollToTop}
            className="link-underline press-z tap-target-z text-navy-foreground/70 hover:text-navy-foreground"
          >
            Haut de page
          </button>
        </div>
      </div>
    </footer>
  );
}
