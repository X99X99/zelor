/** Origine canonique du site : source unique pour les URL absolues (SEO, partage). */
export const SITE_ORIGIN = "https://zelor.lovable.app";

/** Construit une URL absolue à partir d'un chemin interne ("/collection"). */
export function absoluteUrl(path = "/"): string {
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Image d'aperçu par défaut pour les réseaux sociaux (1200 × 630). */
export const OG_IMAGE_URL = absoluteUrl("/og-image.jpg");
