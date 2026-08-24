import { useEffect, useRef, useState } from "react";

/**
 * Média éditorial : image fixe par défaut, vidéo silencieuse en boucle.
 * Desktop : lecture au survol, pause à la sortie SANS retour au début.
 * Mobile : lecture douce lorsque le média est visible, pause sinon.
 * Respecte prefers-reduced-motion et le mode économie de données.
 */
export function HoverVideo({
  src,
  poster,
  alt,
  className = "",
  ratio = "aspect-4/3",
  caption,
}: {
  src: string;
  poster: string;
  alt: string;
  className?: string;
  ratio?: string;
  caption?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (reduced || conn?.saveData) return;
    setEnabled(true);
  }, []);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    void v.play().then(
      () => setPlaying(true),
      () => undefined,
    );
  };
  const pause = () => {
    videoRef.current?.pause();
    setPlaying(false);
  };

  // Mobile / tactile : lecture lorsque la zone est visible.
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    const isCoarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const node = wrapRef.current;
    if (!isCoarse || !node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) play();
        else pause();
      },
      { threshold: 0.55 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [enabled]);

  return (
    <figure className={className}>
      <div
        ref={wrapRef}
        onMouseEnter={play}
        onMouseLeave={pause}
        onFocus={play}
        onBlur={pause}
        tabIndex={-1}
        className={`media-frame group relative ${ratio} w-full bg-navy/6`}
      >
        <img
          src={poster}
          alt={alt}
          loading="lazy"
          className={`absolute inset-0 size-full object-cover transition-opacity duration-[var(--dur-4)] ease-[var(--ease-lux)] ${
            playing ? "opacity-0" : "opacity-100"
          }`}
        />
        {enabled && (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            className="absolute inset-0 size-full object-cover transition-[scale] duration-[var(--dur-5)] ease-[var(--ease-lux)] group-hover:scale-[1.02]"
          />
        )}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-navy/25 via-transparent to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-40"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-xs tracking-wide text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
