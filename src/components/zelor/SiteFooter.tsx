import type { CSSProperties } from "react";

import { BRAND } from "@/lib/zelor/content";
import { BrandLink, NavLink, scrollToTop } from "@/components/zelor/NavLink";
import { Newsletter } from "./Newsletter";
import { Reveal } from "./Reveal";

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

/**
 * ————— Le pied de page —————
 *
 * ——— Ce qui a été retiré ———
 *
 * Le nom de la maison y apparaissait quatre fois en quelques centimètres : un
 * bloc « MAISON ZELOR » avec sa promesse en grand, un petit mot-symbole en
 * tête des colonnes avec sa ligne de description, le mot-symbole géant en bas,
 * et la lettre. Répété à ce rythme, un nom cesse d'être une signature : il
 * devient un tic.
 *
 * Il n'en reste qu'un, le grand, et il ouvre le pied de page au lieu de le
 * fermer. La lettre passe dessous, à la place qu'occupait la promesse.
 *
 * ——— L'ordre ———
 *
 * Le nom, l'invitation, les liens, les mentions. On quitte la maison en la
 * nommant, pas en lisant une ligne de droits réservés.
 */
export function SiteFooter() {
  return (
    <footer className="overlay-navy grain-z shoreline-z mt-28 text-navy-foreground">
      {/* Le nom ouvre le pied de page. C'est un lien vers l'accueil, pas une
          image : il répond au clavier et il se lit. */}
      {/* L observateur est posé sur le conteneur, pas dans le lien : un span
          inline à l intérieur d une ancre ne rapporte pas d intersection
          fiable, et les cinq lettres restaient à opacité zéro — signature
          invisible, constaté à la mesure. */}
      <Reveal as="div" className="container-z pt-20 pb-4 md:pt-28">
        {/* Le nom se compose lettre par lettre, du même geste que le logo
            d ouverture : chaque lettre derrière sa propre fenêtre de
            rognage, décalée sur la précédente. Même famille, même
            décalage, même courbe — c est la même signature, à l autre
            bout de la page.

            Le `aria-label` du lien porte déjà le nom entier : le
            découpage est purement visuel, et un lecteur d écran entend
            « ZELOR — accueil », jamais cinq lettres à la file. */}
        <BrandLink className="wordmark-z footer-wordmark-z text-navy-foreground">
          <span className="signature-letters-z">
            {BRAND.name.split("").map((lettre, index) => (
              <span key={index} className="signature-letter-mask-z">
                <span
                  className="signature-letter-z"
                  style={{ "--letter-i": index } as CSSProperties}
                >
                  {lettre}
                </span>
              </span>
            ))}
          </span>
        </BrandLink>
      </Reveal>

      <Newsletter />

      {/* Sous 640px, les 4 colonnes s'empilaient en une seule : 17 liens à la
          file portaient le footer à 2,7 écrans sur un iPhone SE (mesuré).
          Réparties en 2 colonnes dès le mobile, aucun lien ne disparaît et
          seule la hauteur se resserre. */}
      <div className="container-z grid grid-cols-1 gap-x-6 gap-y-10 border-t border-navy-foreground/12 py-16 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title} className="min-w-0">
            <h2 className="eyebrow text-navy-foreground/60">{column.title}</h2>
            {/* Le retrait négatif annule le `padding-inline` de la capsule :
                sans lui, le libellé se posait 12 px à droite du titre de sa
                propre colonne. Même compensation que la navigation du header. */}
            <ul className="-ml-3 mt-4 space-y-3">
              {column.links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    variant="footer"
                    className="text-sm text-navy-foreground"
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

      <div className="container-z flex flex-col gap-3 border-t border-navy-foreground/12 pt-10 pb-7 text-xs text-navy-foreground/60 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {BRAND.name}. Tous droits réservés.
        </p>
        <div className="flex items-center gap-6">
          <p>Maison lifestyle premium — France et Union européenne.</p>
          <button
            type="button"
            onClick={scrollToTop}
            className="link-underline press-z tap-target-z text-navy-foreground"
          >
            Haut de page
          </button>
        </div>
      </div>
    </footer>
  );
}
