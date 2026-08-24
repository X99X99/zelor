import { createFileRoute } from "@tanstack/react-router";

import { PageShell, Section } from "@/components/zelor/Page";
import { DraftNote, Missing } from "@/components/zelor/Placeholder";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité — ZELOR" },
      {
        name: "description",
        content:
          "Traitement des données personnelles chez ZELOR : finalités, durées et droits des personnes. Document en préparation.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Politique de confidentialité — ZELOR" },
      {
        property: "og:description",
        content: "Finalités, durées de conservation et droits des personnes.",
      },
      { property: "og:url", content: "/confidentialite" },
    ],
    links: [{ rel: "canonical", href: "/confidentialite" }],
  }),
  component: () => (
    <PageShell
      title="Politique de confidentialité"
      crumbs={[{ label: "Confidentialité" }]}
    >
      <DraftNote label="Emplacement">
        Document à rédiger et vérifier (RGPD). Aucune donnée marketing ne doit
        être collectée sans consentement préalable.
      </DraftNote>
      {[
        "Responsable de traitement",
        "Données collectées",
        "Finalités et bases légales",
        "Destinataires et sous-traitants",
        "Transferts hors Union européenne",
        "Durées de conservation",
        "Vos droits et exercice",
      ].map((title) => (
        <Section key={title} title={title}>
          <p>
            <Missing>[SECTION À RÉDIGER ET À VALIDER]</Missing>
          </p>
        </Section>
      ))}
    </PageShell>
  ),
});
