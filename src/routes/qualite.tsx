import { createFileRoute } from "@tanstack/react-router";

import detailImage from "@/assets/detail.jpg";
import { PageShell, Section } from "@/components/zelor/Page";
import { DraftNote, Missing } from "@/components/zelor/Placeholder";

export const Route = createFileRoute("/qualite")({
  head: () => ({
    meta: [
      { title: "Qualité et sélection — ZELOR" },
      {
        name: "description",
        content:
          "Comment ZELOR évalue une pièce avant de l'ajouter au catalogue : finition, matière, conception et usage réel.",
      },
      { property: "og:title", content: "Qualité et sélection — ZELOR" },
      {
        property: "og:description",
        content: "Finition, matière, conception et usage réel.",
      },
      { property: "og:url", content: "/qualite" },
    ],
    links: [{ rel: "canonical", href: "/qualite" }],
  }),
  component: () => (
    <PageShell
      title="Qualité et sélection"
      intro="Nous démontrons la qualité par des informations précises, jamais par des adjectifs."
      crumbs={[{ label: "Qualité et sélection" }]}
      aside={
        <img
          src={detailImage}
          width={1408}
          height={1008}
          loading="lazy"
          alt="Détail de finition : arête lisse contre un tissu de lin."
          className="aspect-4/3 w-full object-cover"
        />
      }
    >
      <DraftNote label="À confirmer">
        Aucune origine, certification, garantie ou allégation environnementale
        n'est publiée tant qu'elle n'est pas documentée par un fournisseur.
      </DraftNote>
      <Section title="Nos critères">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Finition : <Missing>[DÉTAIL DE QUALITÉ À CONFIRMER]</Missing>
          </li>
          <li>
            Matière : <Missing>[MATIÈRE OU FINITION À CONFIRMER]</Missing>
          </li>
          <li>
            Conception : <Missing>[ÉLÉMENT DE CONCEPTION À CONFIRMER]</Missing>
          </li>
          <li>Usage réel : test avant mise en ligne</li>
        </ul>
      </Section>
      <Section title="Ce que nous n'écrirons pas">
        <p>
          Pas de « fabriqué en France » sans preuve, pas de savoir-faire
          artisanal supposé, pas de certification non délivrée, pas de bénéfice
          santé non démontré.
        </p>
      </Section>
    </PageShell>
  ),
});
