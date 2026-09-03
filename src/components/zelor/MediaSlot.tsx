import type { CSSProperties } from "react";

/**
 * ————— Un emplacement d'image —————
 *
 * Soit une photographie ZELOR, soit un emplacement qui se déclare comme tel.
 * Jamais une image dont le sujet ne correspond pas au rôle : substituer
 * silencieusement ferait mentir la composition sur ce qu'elle montre.
 *
 * L'emplacement vide n'est pas un trou. Il porte le nom du fichier attendu,
 * son rôle et son format, de sorte qu'il vaut cahier des charges pour la prise
 * de vue tout en tenant sa place dans la composition.
 */

export type SlotSource = {
  src: string;
  /** Cadrage : la boîte est imposée, c'est `object-position` qui choisit. */
  position?: string;
  positionMobile?: string;
  width: number;
  height: number;
  /**
   * Variantes modernes, quand elles existent réellement.
   *
   * Absentes aujourd'hui pour les trois photographies actives : aucun outil
   * de conversion d'image (sharp, imagemin, cwebp, avifenc…) n'est disponible
   * dans ce dépôt ni sur cette machine — vérifié avant d'écrire ce champ, pas
   * supposé. Renseigner l'un d'eux suffit à faire apparaître son `<source>` ;
   * en laisser un absent ne génère jamais de référence vers un fichier qui
   * n'existe pas, donc jamais de 404.
   */
  avif?: string;
  webp?: string;
};

export function MediaSlot({
  source,
  fichier,
  role,
  format,
  priority = false,
  className = "",
  /**
   * Largeur réellement occupée par l'image chez l'appelant, en syntaxe
   * `sizes`. Sans `srcset` multi-largeur — le cas de toutes les photographies
   * actives à ce jour — le navigateur l'ignore complètement : c'est une
   * préparation, pas un gain mesurable aujourd'hui. La valeur par défaut
   * couvre les appelants qui ne la précisent pas encore.
   */
  sizes = "(max-width: 767px) 100vw, 50vw",
}: {
  source: SlotSource | null;
  fichier: string;
  role: string;
  format: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  if (source) {
    const style = {
      "--pos": source.position ?? "50% 50%",
      "--pos-mobile": source.positionMobile ?? source.position ?? "50% 50%",
    } as CSSProperties;

    const img = (
      <img
        className={`slot-media-z ${className}`.trim()}
        src={source.src}
        style={style}
        width={source.width}
        height={source.height}
        sizes={sizes}
        fetchPriority={priority ? "high" : "low"}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        alt=""
      />
    );

    // Sans variante moderne fournie, le JPEG reste l'unique source : pas de
    // <picture> pour rien, pas de <source> vers un fichier absent.
    if (!source.avif && !source.webp) return img;

    return (
      <picture>
        {source.avif && <source type="image/avif" srcSet={source.avif} sizes={sizes} />}
        {source.webp && <source type="image/webp" srcSet={source.webp} sizes={sizes} />}
        {img}
      </picture>
    );
  }

  return (
    <div
      className={`slot-empty-z ${className}`.trim()}
      role="img"
      aria-label={`Image à venir : ${role}`}
    >
      <p className="slot-empty-role-z">{role}</p>
      <p className="slot-empty-file-z">{fichier}</p>
      <p className="slot-empty-format-z">{format}</p>
    </div>
  );
}
