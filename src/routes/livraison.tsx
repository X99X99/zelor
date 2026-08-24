import { createFileRoute } from "@tanstack/react-router";

import { PageShell, Section } from "@/components/zelor/Page";
import { DraftNote, Missing } from "@/components/zelor/Placeholder";

export const Route = createFileRoute("/livraison")({
  head: () => ({
    meta: [
      { title: "Livraison — ZELOR" },
      {
        name: "description",
        content:
          "Zones desservies, délais et frais de livraison ZELOR. Phase 1 : France et Union européenne.",
      },
      { property: "og:title", content: "Livraison — ZELOR" },
      {
        property: "og:description",
        content: "Zones desservies, délais et frais de livraison.",
      },
      { property: "og:url", content: "/livraison" },
    ],
    links: [{ rel: "canonical", href: "/livraison" }],
  }),
  component: () => (
    <PageShell
      title="Livraison"
      intro="Phase 1 : France et Union européenne. Les autres marchés seront ouverts après validation de la logistique, de la fiscalité et du service."
      crumbs={[{ label: "Livraison" }]}
    >
      <DraftNote label="À renseigner">
        Aucune livraison offerte n'est annoncée tant que le seuil n'est pas
        défini : <Missing>[SEUIL DE LIVRAISON OFFERTE À DÉFINIR]</Missing>.
      </DraftNote>
      <Section title="Zones et délais">
        <dl className="divide-y divide-border border-y border-border text-sm">
          {[
            ["France", "[DÉLAI À RENSEIGNER] · [FRAIS DE PORT À RENSEIGNER]"],
            ["Union européenne", "[DÉLAI À RENSEIGNER] · [FRAIS À RENSEIGNER]"],
            ["Suisse, Royaume-Uni", "Phase 2 — à ouvrir après validation"],
            [
              "États-Unis, Canada, Japon, Émirats, Australie, Singapour, Corée du Sud",
              "Phase 2 — à ouvrir après validation",
            ],
          ].map(([zone, value]) => (
            <div key={zone} className="flex flex-wrap justify-between gap-3 py-3">
              <dt>{zone}</dt>
              <dd>
                <Missing>{value}</Missing>
              </dd>
            </div>
          ))}
        </dl>
      </Section>
      <Section title="Douanes et taxes">
        <p>
          Pour les commandes hors Union européenne, des droits et taxes peuvent
          s'appliquer. Les règles exactes seront précisées après configuration
          fiscale dans Shopify.
        </p>
      </Section>
    </PageShell>
  ),
});
