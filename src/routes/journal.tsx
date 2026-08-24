import { createFileRoute } from "@tanstack/react-router";

import { PageShell } from "@/components/zelor/Page";
import { DraftNote, ImageSlot } from "@/components/zelor/Placeholder";

const drafts = [
  { title: "[TITRE D'ARTICLE À RÉDIGER]", theme: "Sélection" },
  { title: "[TITRE D'ARTICLE À RÉDIGER]", theme: "Matières" },
  { title: "[TITRE D'ARTICLE À RÉDIGER]", theme: "Voyage" },
];

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Journal — ZELOR" },
      {
        name: "description",
        content:
          "Le Journal ZELOR : notes sur la sélection, les matières et l'art de choisir. Premiers articles à paraître.",
      },
      { property: "og:title", content: "Journal — ZELOR" },
      {
        property: "og:description",
        content: "Notes sur la sélection, les matières et l'art de choisir.",
      },
      { property: "og:url", content: "/journal" },
    ],
    links: [{ rel: "canonical", href: "/journal" }],
  }),
  component: () => (
    <PageShell
      title="Journal"
      intro="Des notes courtes sur la sélection, les matières et les lieux qui nourrissent notre regard."
      crumbs={[{ label: "Journal" }]}
    >
      <DraftNote label="À rédiger">
        Aucun article n'est publié pour le moment. Les emplacements ci-dessous
        montrent la mise en page prévue.
      </DraftNote>
      <ul className="grid gap-8 sm:grid-cols-2">
        {drafts.map((draft, index) => (
          <li key={index}>
            <ImageSlot
              tone={index % 2 === 0 ? "sand" : "stone"}
              ratio="aspect-4/3"
              caption="Visuel d'article à fournir"
            />
            <p className="eyebrow mt-4">{draft.theme}</p>
            <h2 className="mt-2 font-display text-xl">{draft.title}</h2>
          </li>
        ))}
      </ul>
    </PageShell>
  ),
});
