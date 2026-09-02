import { createFileRoute } from "@tanstack/react-router";

import { PageShell } from "@/components/zelor/Page";
import { ImageSlot } from "@/components/zelor/Placeholder";
import { absoluteUrl } from "@/lib/zelor/site";

const entries = [
  {
    theme: "Sélection",
    title: "Ce qu'une pièce doit prouver avant d'entrer au catalogue",
    body: "Quelques semaines d'usage, trois ou quatre gestes répétés chaque jour : notre méthode d'essai, sans complaisance.",
  },
  {
    theme: "Matière",
    title: "La patine, cette qualité qui ne se photographie pas",
    body: "Pourquoi nous préférons les surfaces qui évoluent lentement à celles qui restent neuves un mois puis se fatiguent.",
  },
  {
    theme: "Voyage",
    title: "Riviera, hors saison",
    body: "La lumière de fin de journée sur la pierre claire, le bleu dense de la mer en novembre : la palette d'où vient ZELOR.",
  },
];

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Journal — ZELOR — Maison éditoriale" },
      {
        name: "description",
        content:
          "Le Journal ZELOR : notes sur la sélection, les matières et l'art de choisir. Premiers textes à paraître.",
      },
      { property: "og:title", content: "Journal — ZELOR — Maison éditoriale" },
      {
        property: "og:description",
        content: "Notes sur la sélection, les matières et l'art de choisir.",
      },
      { property: "og:url", content: absoluteUrl("/journal") },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/journal") }],
  }),
  component: () => (
    <PageShell
      title="Journal"
      intro="Des notes courtes sur la sélection, les matières et les lieux qui nourrissent notre regard. Les premiers textes paraîtront avec l'ouverture de la boutique."
      crumbs={[{ label: "Journal" }]}
      editorial
    >
      <ul className="grid gap-16 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-24">
        {entries.map((entry, index) => (
          <li key={entry.title} className={index % 2 === 1 ? "sm:mt-28" : ""}>
            <ImageSlot
              tone={index % 2 === 0 ? "sand" : "stone"}
              ratio="aspect-4/3"
              caption={entry.theme}
              label={`${entry.title} — ${entry.theme}`}
            />

            <p className="eyebrow mt-4">{entry.theme}</p>
            <h2 className="mt-2 font-display text-xl">{entry.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{entry.body}</p>
            <p className="mt-3 text-xs tracking-wide text-muted-foreground">À paraître</p>
          </li>
        ))}
      </ul>
    </PageShell>
  ),
});
