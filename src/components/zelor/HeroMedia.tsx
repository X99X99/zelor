import { useEffect, useState } from "react";

const IMG_CLASS =
  "h-[68vh] min-h-[26rem] w-full object-cover object-[28%_center] md:h-[82vh] md:object-center";

const HERO_ALT =
  "Une femme drapée d'un voile de soie ivoire, adossée à une roche sombre face à la mer au soleil couchant.";

function HeroPoster() {
  return (
    <picture>
      <source
        type="image/avif"
        srcSet="/hero/zelor-hero-640.avif 640w, /hero/zelor-hero-1024.avif 1024w, /hero/zelor-hero-1600.avif 1600w, /hero/zelor-hero-1774.avif 1774w"
        sizes="100vw"
      />
      <source
        type="image/webp"
        srcSet="/hero/zelor-hero-640.webp 640w, /hero/zelor-hero-1024.webp 1024w, /hero/zelor-hero-1600.webp 1600w, /hero/zelor-hero-1774.webp 1774w"
        sizes="100vw"
      />
      <img
        src="/hero/zelor-hero-1600.jpg"
        srcSet="/hero/zelor-hero-640.jpg 640w, /hero/zelor-hero-1024.jpg 1024w, /hero/zelor-hero-1600.jpg 1600w, /hero/zelor-hero-1774.jpg 1774w"
        sizes="100vw"
        width={1774}
        height={887}
        fetchPriority="high"
        loading="eager"
        decoding="async"
        alt={HERO_ALT}
        className={IMG_CLASS}
      />
    </picture>
  );
}

/**
 * Bannière d'accueil : vidéo décorative en fond, repli sur la photographie
 * lorsque le mouvement est réduit, la connexion ménagée ou le format illisible.
 */
export function HeroMedia() {
  const [playVideo, setPlayVideo] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const frugal =
      connection?.saveData === true ||
      ["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "");
    const canPlay =
      typeof document !== "undefined" && !!document.createElement("video").canPlayType("video/mp4");

    if (!reduced && !frugal && canPlay) setPlayVideo(true);
  }, []);

  if (!playVideo) return <HeroPoster />;

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      poster="/hero/zelor-hero-1600.jpg"
      width={1344}
      height={672}
      aria-label={HERO_ALT}
      className={IMG_CLASS}
      onError={() => setPlayVideo(false)}
    >
      <source src="/hero/hero.webm" type="video/webm" />
      <source src="/hero/hero.mp4" type="video/mp4" />
    </video>
  );
}
