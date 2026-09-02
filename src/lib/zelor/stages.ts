import detailImage from "@/assets/detail.jpg";
import editorialImage from "@/assets/editorial.jpg";

/**
 * Les trois temps du regard ZELOR : la matière, le détail, la pièce.
 *
 * Source unique de la séquence. Le jour où une photographie dédiée existe, on
 * la renseigne ici et **aucun composant ne change**.
 *
 * `null` signifie « pas encore fournie ». On n'y met jamais une image dont le
 * sujet ne correspond pas au rôle du plan : servir une photographie pour une
 * autre ferait mentir la scène. Un temps à `null` s'affiche comme un
 * emplacement explicitement marqué, jamais comme une fausse photographie.
 *
 * Deux images du dépôt correspondent réellement à leur rôle et sont donc
 * posées ici. La troisième — la jonction, l'arête, l'assemblage — n'existe pas
 * dans le dépôt, et rien ne la remplace.
 */

export const STAGES = ["matiere", "detail", "piece"] as const;

export type Stage = (typeof STAGES)[number];

/** Libellé affiché par le grand titre persistant, pour chaque temps. */
export const STAGE_LABELS: Record<Stage, string> = {
  matiere: "La matière",
  detail: "Le détail",
  piece: "La pièce",
};

/**
 * Ce que la photographie doit montrer. Sert de cahier des charges à la prise
 * de vue, et de note affichée tant que le plan manque.
 */
export const STAGE_INTENT: Record<Stage, string> = {
  matiere: "Un plan rapproché de matière : grain, tissage, trame, lumière rasante.",
  detail: "Un détail de fabrication : arête, couture, assemblage, jonction.",
  piece: "La pièce entière, posée, à distance de regard.",
};

/**
 * Une image posée sur un temps.
 *
 * `position` est le cadrage : la scène est en plein cadre, l'image y est
 * recadrée par `object-fit: cover`, et c'est `object-position` qui décide de
 * ce qui reste visible. `reserve` note honnêtement l'écart entre ce que
 * l'image montre et ce que le plan demanderait idéalement.
 */
export type StageSource = {
  src: string;
  /** Cadrage desktop. */
  position: string;
  /** Cadrage mobile, lorsque le format de l'écran impose un autre choix. */
  positionMobile?: string;
  width: number;
  height: number;
  reserve?: string;
};

export const STAGE_ASSETS: Record<Stage, StageSource | null> = {
  // Macro : arête métallique brossée posée sur une trame de lin. Le cadrage
  // décale vers la droite pour que la trame domine, l'arête restant en entrée
  // de champ. C'est bien un plan de matière, pas la jonction du temps suivant.
  matiere: {
    src: detailImage,
    position: "60% 50%",
    // En portrait, le cadre se resserre : on remonte pour garder l'arête et la
    // trame ensemble plutôt que de ne montrer que le flou.
    positionMobile: "62% 42%",
    width: 1408,
    height: 1008,
  },

  // Aucune image du dépôt ne montre une jonction de fabrication. On ne
  // substitue rien : l'emplacement reste visible et documenté.
  detail: null,

  // Intérieur : vase sur socle de travertin dans une niche vert profond. Le
  // plan est juste — la pièce entière, à distance de regard — mais c'est une
  // vue d'intérieur, pas un plan dédié sur fond continu. Provisoire, et dit.
  piece: {
    src: editorialImage,
    // Image portrait 4/5 dans une scène paysage : le cadrage remonte sur la
    // niche et le socle, sinon le plein cadre ne montrerait que le sol.
    position: "50% 38%",
    // En portrait, le format natif de l'image : on recentre.
    positionMobile: "50% 50%",
    width: 1408,
    height: 1760,
    reserve:
      "Vue d'intérieur, non un plan dédié sur fond continu. Provisoire, en attente d'un packshot ZELOR.",
  },
};

/** Cadrage attendu d'un plan dédié : plein cadre, 3/2 paysage. */
export const STAGE_RATIO = { width: 1600, height: 1067 } as const;

/** Vrai lorsque les trois plans sont pourvus. */
export function stagesReady(): boolean {
  return STAGES.every((stage) => STAGE_ASSETS[stage] !== null);
}

/** Les temps dont le plan manque encore. */
export function missingStages(): Stage[] {
  return STAGES.filter((stage) => STAGE_ASSETS[stage] === null);
}
