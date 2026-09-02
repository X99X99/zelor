/**
 * L'image logée entre les deux lignes du titre.
 *
 * Purement décorative : la phrase se lit sans elle, et son sujet est décrit
 * plus bas dans la page. Elle porte donc un alt vide et disparaît des lecteurs
 * d'écran, au lieu d'interrompre le titre en son milieu. C'est aussi pourquoi
 * les images d'étape gardent `alt=""` : leur donner un texte casserait le nom
 * accessible du H1.
 *
 * La scène raconte trois temps — la matière, le détail, la pièce. Le jour où
 * les trois photographies existeront, il suffira de renseigner STAGE_ASSETS :
 * le composant bascule seul sur un fondu croisé piloté par data-step, sans
 * qu'une ligne de HeroScroll ne change.
 *
 * Tant qu'aucune n'est fournie — c'est le cas aujourd'hui — le composant rend
 * la photographie existante et rien d'autre. Pas de doublon, pas de requête
 * supplémentaire, pas un pixel de différence.
 */
const STAGES = ["matiere", "detail", "piece"] as const;

type Stage = (typeof STAGES)[number];

/**
 * Fichiers d'étape présents dans `public/hero/`.
 *
 * `null` signifie « pas encore fourni ». On ne met jamais une image de
 * substitution ici : servir une photographie pour une autre serait mentir sur
 * ce que la scène raconte.
 *
 * Attendu par étape, au même format que l'existant : trois largeurs (640,
 * 1024, 1600) en AVIF, WebP et JPEG, cadrées en 16/9.
 */
const STAGE_ASSETS: Record<Stage, string | null> = {
  matiere: null,
  detail: null,
  piece: null,
};

const STAGE_WIDTHS = [640, 1024, 1600] as const;
const SIZES = "(max-width: 768px) 70vw, 46vw";

function srcSet(base: string, extension: string): string {
  return STAGE_WIDTHS.map((w) => `/hero/${base}-${w}.${extension} ${w}w`).join(", ");
}

/** Une étape de la séquence, quand sa photographie existe. */
function StagePicture({
  base,
  stage,
  priority,
}: {
  base: string;
  stage: Stage;
  priority: boolean;
}) {
  return (
    <picture className="hero-stage-z" data-stage={stage}>
      <source type="image/avif" srcSet={srcSet(base, "avif")} sizes={SIZES} />
      <source type="image/webp" srcSet={srcSet(base, "webp")} sizes={SIZES} />
      <img
        src={`/hero/${base}-1024.jpg`}
        srcSet={srcSet(base, "jpg")}
        sizes={SIZES}
        width={1600}
        height={900}
        // Seule la première étape entre dans le chemin critique. Les deux
        // autres cèdent le passage : `lazy` ne diffère pas une image déjà dans
        // la fenêtre, c'est la priorité basse qui fait le vrai travail.
        fetchPriority={priority ? "high" : "low"}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        alt=""
      />
    </picture>
  );
}

/**
 * La photographie actuelle, servie tant que les étapes ne sont pas fournies.
 * Balisage repris verbatim : quatre largeurs, trois formats, priorité haute.
 */
function FallbackPicture() {
  return (
    <picture>
      <source
        type="image/avif"
        srcSet="/hero/zelor-hero-640.avif 640w, /hero/zelor-hero-1024.avif 1024w, /hero/zelor-hero-1600.avif 1600w, /hero/zelor-hero-1774.avif 1774w"
        sizes={SIZES}
      />
      <source
        type="image/webp"
        srcSet="/hero/zelor-hero-640.webp 640w, /hero/zelor-hero-1024.webp 1024w, /hero/zelor-hero-1600.webp 1600w, /hero/zelor-hero-1774.webp 1774w"
        sizes={SIZES}
      />
      <img
        src="/hero/zelor-hero-1024.jpg"
        srcSet="/hero/zelor-hero-640.jpg 640w, /hero/zelor-hero-1024.jpg 1024w, /hero/zelor-hero-1600.jpg 1600w"
        sizes={SIZES}
        width={1774}
        height={887}
        fetchPriority="high"
        loading="eager"
        decoding="async"
        alt=""
      />
    </picture>
  );
}

export function HeroFrame() {
  // Le prédicat de type évite une assertion non-nulle : c'est le filtre
  // lui-même qui prouve au compilateur que `base` n'est plus nul.
  const provided = STAGES.map((stage) => ({ stage, base: STAGE_ASSETS[stage] })).filter(
    (entry): entry is { stage: Stage; base: string } => entry.base !== null,
  );

  return (
    <span aria-hidden="true" className="hero-frame-z" data-staged={provided.length > 0}>
      {provided.length === 0 ? (
        <FallbackPicture />
      ) : (
        provided.map(({ stage, base }, index) => (
          <StagePicture key={stage} base={base} stage={stage} priority={index === 0} />
        ))
      )}
    </span>
  );
}
