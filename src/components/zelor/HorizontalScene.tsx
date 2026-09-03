import detailImage from "@/assets/detail.jpg";
import editorialImage from "@/assets/editorial.jpg";
import { useScrollSteps } from "@/hooks/useScrollSteps";
import { MediaSlot } from "./MediaSlot";

/**
 * ————— Le ruban de fragments —————
 *
 * Entre le récit de méthode (le diptyque) et la sélection (la grille), une
 * planche qui se parcourt à l'horizontale : des fragments de matière, pas des
 * pièces finies. C'est une archive en cours, pas un inventaire.
 *
 * Cinq panneaux, deux réels. Les deux photographies existantes ont été
 * regardées en entier avant de choisir leur recadrage, et le panneau carré
 * (1:1, plutôt que le 4:5 du reste du site) a été choisi pour rogner
 * vraiment, pas seulement recomposer — deux tentatives d'isolation nette ont
 * pourtant échoué à l'image, et les deux fois le recadrage a été corrigé pour
 * refléter ce qu'il montre réellement plutôt que ce qu'il était censé
 * montrer :
 *
 * Sur `detail.jpg`, paysage, la fenêtre visible reste presque aussi large que
 * l'image entière (1008 sur 1408 px) et l'arête traverse le cadre à toutes
 * les hauteurs — aucune position ne l'exclut. Le recadrage resserre plutôt
 * vers le grain et le tissage, sans prétendre à une exclusion qu'il ne tient
 * pas. Sur `editorial.jpg`, déjà presque carrée, un panneau carré n'en retire
 * qu'un cinquième : la tentative d'isoler la penderie en arrière-plan ne
 * montrait presque rien de différent de sa scène déjà connue. Le recadrage
 * retenu retire la rangée de plafond et appuie sur le socle — honnêtement
 * modeste. Les trois autres emplacements sont explicitement identifiés —
 * `MediaSlot`, réutilisé tel quel, jamais dupliqué — plutôt que remplis d'une
 * pièce qui n'existe pas.
 *
 * Desktop : la scène s'épingle, la piste se traduit sur l'axe X en continu
 * depuis `--sp` — la même progression que `useScrollSteps` fournit déjà à
 * l'ouverture et au manifeste, réutilisée sans modification. Aucun nouvel
 * effet : contrairement au diptyque, rien ici n'a besoin d'être mesuré
 * individuellement, une seule valeur suffit.
 *
 * Mobile : le pilotage du scroll vertical est abandonné au profit d'un
 * défilement horizontal natif, au doigt, avec accrochage. Le scroll-jacking
 * horizontal est un motif fragile au tactile — la physique du geste s'y heurte
 * à la traduction programmée. Le défilement natif ne coûte aucune ligne de
 * JavaScript et ne rallonge pas la page.
 */

const PANELS = [
  {
    source: {
      src: detailImage,
      // La géométrie ne laisse pas exclure l'arête : sur ce panneau carré, la
      // fenêtre visible reste presque aussi large que l'image entière (1008
      // sur 1408 px), et l'arête traverse le cadre à toutes les hauteurs —
      // aucune position ne la fait sortir du champ. Essayé, mesuré, écarté.
      // Ce recadrage resserre plutôt vers le grain du bois et le tissage, pour
      // une lecture plus proche que celle déjà servie ailleurs, sans prétendre
      // à une exclusion qu'il ne tient pas.
      position: "88% 85%",
      width: 1408,
      height: 1008,
    },
    label: "Au plus près",
    note: "La même arête, resserrée.",
  },
  {
    source: {
      src: editorialImage,
      // editorial.jpg est déjà presque carrée (1408 × 1760, un ratio 4:5) :
      // même un panneau carré n'en rogne qu'un cinquième. Une isolation nette
      // sur la penderie, en arrière-plan, n'est pas atteignable ainsi — essayé,
      // vérifié à l'image, écarté. Ce recadrage retire la rangée de plafond et
      // appuie sur le socle : un cadrage réellement différent de celui du
      // diptyque (centré, 50 % 42 %), pas une prétention d'isolement qu'il ne
      // tient pas.
      position: "50% 88%",
      width: 1408,
      height: 1760,
    },
    label: "Le socle",
    note: "Le même intérieur, cadré vers le sol.",
  },
  { source: null, label: "Assemblage", note: "Aucune image du dépôt ne montre cette jonction." },
  { source: null, label: "Patine", note: "Aucune image du dépôt ne montre cet usage." },
  { source: null, label: "Lumière rasante", note: "Aucune image du dépôt ne montre ce plan." },
] as const;

export function HorizontalScene() {
  // Aucun nouvel effet : la progression déjà écrite par useScrollSteps pour
  // l'ouverture et le manifeste suffit à piloter la traduction de la piste.
  const { ref } = useScrollSteps(1);

  return (
    <section aria-labelledby="ruban-title" className="hscene-track-z" ref={ref}>
      <h2 id="ruban-title" className="sr-only">
        Un ruban de fragments
      </h2>

      <div className="hscene-scene-z">
        <p className="eyebrow hscene-eyebrow-z">Archive en cours</p>

        <div className="hscene-strip-z">
          {PANELS.map((panel, index) => (
            <figure key={panel.label} className="hscene-panel-z">
              <MediaSlot
                source={panel.source}
                fichier={`zelor-fragment-${String(index + 1).padStart(2, "0")}`}
                role={panel.label}
                format="4:5"
                className="hscene-media-z"
                // Largeur réelle d'un panneau : --panel-w, identique sur
                // mobile (le ruban y défile au doigt, sans recomposition).
                sizes="clamp(18rem, 32vw, 26rem)"
              />
              <figcaption className="hscene-caption-z">
                <span className="hscene-index-z">{String(index + 1).padStart(2, "0")}</span>
                <span className="hscene-label-z">{panel.label}</span>
                <span className="hscene-note-z">{panel.note}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="hscene-bar-z" aria-hidden="true">
          <span className="hscene-bar-fill-z" />
        </div>
      </div>
    </section>
  );
}
