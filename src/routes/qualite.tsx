import { createFileRoute } from "@tanstack/react-router";

import detailImage from "@/assets/detail.jpg";
import { PageShell, Section } from "@/components/zelor/Page";
import { absoluteUrl } from "@/lib/zelor/site";

export const Route = createFileRoute("/qualite")({
  head: () => ({
    meta: [
      { title: "Qualité et sélection — ZELOR — Maison éditoriale" },
      {
        name: "description",
        content:
          "Comment ZELOR évalue une pièce avant de l'ajouter à la sélection : finition, matière, conception et usage réel.",
      },
      { property: "og:title", content: "Qualité et sélection — ZELOR — Maison éditoriale" },
      {
        property: "og:description",
        content: "Finition, matière, conception et usage réel.",
      },
      { property: "og:url", content: absoluteUrl("/qualite") },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/qualite") }],
  }),
  component: () => (
    <PageShell
      title="Qualité et sélection"
      intro="La qualité se démontre par des faits précis, jamais par des adjectifs. Voici ce que nous regardons, dans l'ordre."
      crumbs={[{ label: "Qualité et sélection" }]}
      editorial
      aside={
        <img
          src={detailImage}
          width={1408}
          height={1008}
          // Rendue dans la colonne aside, juste sous le titre : visible sans
          // défilement sur la plupart des écrans. Un chargement paresseux y
          // retardait une image déjà dans le premier écran — corrigé, comme
          // c'est déjà fait pour le premier plan de la séquence et le repli
          // de l'ouverture.
          loading="eager"
          fetchPriority="high"
          decoding="async"
          alt="Détail de finition : arête lisse contre un tissu de lin."
          className="aspect-4/3 w-full object-cover"
        />
      }
    >
      <Section title="Nos critères">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Finition : une arête franche, une couture régulière, un assemblage qui ne se remarque
            pas.
          </li>
          <li>
            Matière : une main agréable, une teinte stable, une surface qui se patine sans se
            marquer.
          </li>
          <li>
            Conception : un usage évident dès la première prise en main, sans notice ni
            apprentissage.
          </li>
          <li>Usage réel : plusieurs semaines d'essai avant toute mise en ligne.</li>
        </ul>
      </Section>
      <Section title="Ce que nous vérifions auprès des fournisseurs" offset>
        <p>
          Composition, lieu de fabrication, conditions d'entretien, durée de disponibilité. Une
          information qui ne peut pas être documentée n'est pas publiée : elle reste absente de la
          fiche plutôt que d'être approximative.
        </p>
      </Section>
      <Section title="Ce que nous n'écrirons pas">
        <p>
          Pas d'origine annoncée sans preuve, pas de savoir-faire supposé, pas de certification que
          nous ne détenons pas, pas de bénéfice qui n'a pas été démontré. La retenue fait partie de
          l'exigence.
        </p>
      </Section>
    </PageShell>
  ),
});
