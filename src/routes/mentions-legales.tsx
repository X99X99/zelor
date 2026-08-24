import { createFileRoute } from "@tanstack/react-router";

import { PageShell, Section } from "@/components/zelor/Page";
import { DraftNote, Missing } from "@/components/zelor/Placeholder";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales — ZELOR" },
      {
        name: "description",
        content:
          "Éditeur, hébergeur et informations légales du site ZELOR. Page en préparation.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Mentions légales — ZELOR" },
      {
        property: "og:description",
        content: "Éditeur, hébergeur et informations légales du site ZELOR.",
      },
      { property: "og:url", content: "/mentions-legales" },
    ],
    links: [{ rel: "canonical", href: "/mentions-legales" }],
  }),
  component: () => (
    <PageShell
      title="Mentions légales"
      crumbs={[{ label: "Mentions légales" }]}
    >
      <DraftNote label="Emplacement">
        Ce document doit être rédigé et validé par un professionnel du droit.
        Aucun texte légal n'est généré automatiquement.
      </DraftNote>
      <Section title="Éditeur du site">
        <ul className="space-y-1">
          <li><Missing>[RAISON SOCIALE]</Missing></li>
          <li><Missing>[FORME JURIDIQUE ET CAPITAL]</Missing></li>
          <li><Missing>[ADRESSE DU SIÈGE]</Missing></li>
          <li><Missing>[NUMÉRO D'IMMATRICULATION / TVA]</Missing></li>
          <li><Missing>[DIRECTEUR DE LA PUBLICATION]</Missing></li>
          <li><Missing>[EMAIL PROFESSIONNEL]</Missing></li>
        </ul>
      </Section>
      <Section title="Hébergement">
        <p><Missing>[HÉBERGEUR ET COORDONNÉES]</Missing></p>
      </Section>
    </PageShell>
  ),
});
