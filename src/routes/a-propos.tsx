import { createFileRoute } from "@tanstack/react-router";

import { PageShell, Section } from "@/components/zelor/Page";
import { DraftNote, Missing } from "@/components/zelor/Placeholder";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — ZELOR" },
      {
        name: "description",
        content:
          "ZELOR, marque lifestyle premium internationale : notre approche, notre exigence et notre manière de travailler.",
      },
      { property: "og:title", content: "À propos — ZELOR" },
      {
        property: "og:description",
        content: "Notre approche, notre exigence et notre manière de travailler.",
      },
      { property: "og:url", content: "/a-propos" },
    ],
    links: [{ rel: "canonical", href: "/a-propos" }],
  }),
  component: () => (
    <PageShell
      title="À propos"
      intro="ZELOR est une marque lifestyle premium internationale. Nous choisissons peu de pièces, et nous les choisissons bien."
      crumbs={[{ label: "À propos" }]}
    >
      <DraftNote label="Brouillon">
        Histoire de marque provisoire. À valider avant publication.
      </DraftNote>
      <Section title="Notre intention">
        <p>
          Proposer des pièces élégantes et utiles, présentées avec précision, et
          un service clair. Pas de superlatif : des informations exactes.
        </p>
      </Section>
      <Section title="Informations société">
        <ul className="space-y-1">
          <li>
            Raison sociale : <Missing>[STATUT JURIDIQUE À RENSEIGNER]</Missing>
          </li>
          <li>
            Siège : <Missing>[ADRESSE À RENSEIGNER]</Missing>
          </li>
          <li>
            Contact : <Missing>[EMAIL PROFESSIONNEL À RENSEIGNER]</Missing>
          </li>
        </ul>
      </Section>
    </PageShell>
  ),
});
