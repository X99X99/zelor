/**
 * L'image logée entre les deux lignes du titre.
 *
 * Purement décorative : la phrase se lit sans elle, et son sujet est décrit
 * plus bas dans la page. Elle porte donc un alt vide et disparaît des lecteurs
 * d'écran, au lieu d'interrompre le titre en son milieu.
 *
 * On garde la photographie déjà encodée en AVIF, WebP et JPEG à quatre
 * largeurs — c'est le travail le plus utile déjà fait sur ce site, et il
 * n'avait aucune raison d'être refait. La vidéo de huit mégaoctets, elle, ne
 * revient pas : dans cette composition l'image est petite à l'ouverture et
 * grandit, ce qu'une vidéo de fond ne sait pas faire sans peser.
 */
export function HeroFrame() {
  return (
    <span aria-hidden="true" className="hero-frame-z">
      <picture>
        <source
          type="image/avif"
          srcSet="/hero/zelor-hero-640.avif 640w, /hero/zelor-hero-1024.avif 1024w, /hero/zelor-hero-1600.avif 1600w, /hero/zelor-hero-1774.avif 1774w"
          sizes="(max-width: 768px) 70vw, 46vw"
        />
        <source
          type="image/webp"
          srcSet="/hero/zelor-hero-640.webp 640w, /hero/zelor-hero-1024.webp 1024w, /hero/zelor-hero-1600.webp 1600w, /hero/zelor-hero-1774.webp 1774w"
          sizes="(max-width: 768px) 70vw, 46vw"
        />
        <img
          src="/hero/zelor-hero-1024.jpg"
          srcSet="/hero/zelor-hero-640.jpg 640w, /hero/zelor-hero-1024.jpg 1024w, /hero/zelor-hero-1600.jpg 1600w"
          sizes="(max-width: 768px) 70vw, 46vw"
          width={1774}
          height={887}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          alt=""
        />
      </picture>
    </span>
  );
}
