import { BRAND } from "@/lib/zelor/content";
import { Reveal } from "./Reveal";

/**
 * ————— La signature —————
 *
 * Le dernier élément de la page, juste avant le pied de page : un seul mot,
 * le mot-symbole lui-même — pas le slogan, déjà porté par le pied de page
 * lui-même. Aucune piste de défilement, aucun état multiple : un mot ne se
 * raconte pas en plusieurs temps, il se pose une fois, en grand.
 *
 * La révélation réutilise `clip-reveal-z` — le geste déjà établi pour les
 * médias, « une image se découvre, elle ne s'éclaircit pas » — simplement
 * retourné sur l'axe horizontal plutôt que vertical : le mot se découvre de
 * gauche à droite, comme si on levait un cache plutôt que d'allumer une
 * lumière. Aucun nouveau système, aucun découpage lettre à lettre : à cette
 * taille et à cette approche déjà large (0,4 em, la même que partout ailleurs
 * sur le site), cinq fenêtres séparées se liraient comme un clignotement,
 * pas comme une signature.
 */
export function BrandSignature() {
  return (
    <Reveal as="section" aria-labelledby="signature-title" className="signature-track-z">
      <h2 id="signature-title" className="signature-word-z clip-reveal-x-z">
        {BRAND.name}
      </h2>
    </Reveal>
  );
}
