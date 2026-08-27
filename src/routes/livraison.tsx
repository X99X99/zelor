import { createFileRoute } from "@tanstack/react-router";

import { PageShell, Section } from "@/components/zelor/Page";
import { absoluteUrl } from "@/lib/zelor/site";

export const Route = createFileRoute("/livraison")({
  head: () => ({
    meta: [
      { title: "Livraison — ZELOR — Maison éditoriale" },
      {
        name: "description",
        content:
          "Zones desservies, délais et frais de livraison ZELOR. À l'ouverture : France et Union européenne.",
      },
      { property: "og:title", content: "Livraison — ZELOR — Maison éditoriale" },
      {
        property: "og:description",
        content: "Zones desservies, délais et frais de livraison.",
      },
      { property: "og:url", content: absoluteUrl("/livraison") },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/livraison") }],
  }),
  component: () => (
    <PageShell
      title="Livraison"
      intro="À l'ouverture, nous livrons en France et dans l'Union européenne. Les autres marchés suivront, une fois la logistique, la fiscalité et le service pleinement en place."
      crumbs={[{ label: "Livraison" }]}
    >
      <Section title="Zones desservies">
        <dl className="divide-y divide-border border-y border-border text-sm">
          {[
            ["France", "Desservie à l'ouverture · délai et frais affichés avant paiement"],
            [
              "Union européenne",
              "Desservie à l'ouverture · délai et frais affichés avant paiement",
            ],
            ["Suisse, Royaume-Uni", "Ouverture prévue dans un second temps"],
            [
              "États-Unis, Canada, Japon, Émirats, Australie, Singapour, Corée du Sud",
              "Ouverture prévue dans un second temps",
            ],
          ].map(([zone, value]) => (
            <div key={zone} className="flex flex-wrap justify-between gap-3 py-3">
              <dt>{zone}</dt>
              <dd className="text-muted-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </Section>
      <Section title="Délais et frais">
        <p>
          Le délai et le montant exacts dépendent de la destination et du transporteur retenu. Ils
          s'affichent avant le paiement, sans surprise à l'étape suivante, et sont rappelés dans
          l'email de confirmation.
        </p>
      </Section>
      <Section title="Douanes et taxes">
        <p>
          Pour les commandes hors Union européenne, des droits et taxes peuvent s'ajouter au montant
          réglé. Les modalités applicables à chaque destination seront précisées à son ouverture.
        </p>
      </Section>
      <Section title="Emballage">
        <p>
          Chaque commande est emballée avec soin, dans une présentation sobre qui protège la pièce
          sans excès de matière.
        </p>
      </Section>
    </PageShell>
  ),
});
