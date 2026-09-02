import { createFileRoute } from "@tanstack/react-router";

import { StageOpening } from "@/components/zelor/StageOpening";
import { StageSequence } from "@/components/zelor/StageSequence";
import { STAGES, STAGE_ASSETS, STAGE_INTENT, STAGE_LABELS } from "@/lib/zelor/stages";

/**
 * Route de démonstration du prototype d'ouverture et de séquence.
 *
 * Elle existe pour être jugée, pas pour être visitée : `noindex, nofollow`,
 * absente du plan de site et de toute navigation. L'accueil n'est pas touché
 * tant que le prototype n'est pas validé.
 */
export const Route = createFileRoute("/prototype-hero")({
  head: () => ({
    meta: [
      { title: "Prototype — ouverture et séquence — ZELOR" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PrototypeHero,
});

function PrototypeHero() {
  const manquantes = STAGES.filter((stage) => STAGE_ASSETS[stage] === null);

  return (
    <>
      <StageOpening />
      <StageSequence />

      {/* Fiche de lecture du prototype. Elle ne fait pas partie du modèle :
          elle disparaîtra à l'intégration. */}
      <section aria-labelledby="proto-title" className="container-z module-breath-z">
        <p className="eyebrow">Prototype</p>
        <h2 id="proto-title" className="caps-z mt-4 display-2-z">
          Ce que cette page démontre
        </h2>
        <p className="lead-z mt-6 max-w-2xl">
          Un écran d'ouverture, puis trois écrans de séquence sous un titre qui ne bouge pas. La
          profondeur vient de calques à vitesses différentes, jamais d'une 3D.
        </p>

        <dl className="mt-16 grid gap-8 md:grid-cols-3">
          {STAGES.map((stage) => (
            <div key={stage} className="rule-z pt-6">
              <dt className="eyebrow">{STAGE_LABELS[stage]}</dt>
              <dd className="mt-4 text-sm text-foreground/75">{STAGE_INTENT[stage]}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-16 max-w-2xl text-sm text-muted-foreground">
          {manquantes.length === 0
            ? "Les trois photographies sont fournies : la scène les sert directement."
            : `Photographies encore attendues : ${manquantes
                .map((stage) => STAGE_LABELS[stage].toLocaleLowerCase("fr"))
                .join(
                  ", ",
                )}. Les panneaux affichent des emplacements marqués, jamais une autre image présentée comme celle-ci.`}
        </p>
      </section>
    </>
  );
}
