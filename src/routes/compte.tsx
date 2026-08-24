import { createFileRoute } from "@tanstack/react-router";

import { PageShell, Section } from "@/components/zelor/Page";
import { DraftNote } from "@/components/zelor/Placeholder";

export const Route = createFileRoute("/compte")({
  head: () => ({
    meta: [
      { title: "Compte client — ZELOR" },
      {
        name: "description",
        content:
          "Espace client ZELOR : commandes, adresses et préférences, géré par les comptes clients Shopify.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Compte client — ZELOR" },
      {
        property: "og:description",
        content: "Espace client ZELOR géré par les comptes clients Shopify.",
      },
      { property: "og:url", content: "/compte" },
    ],
    links: [{ rel: "canonical", href: "/compte" }],
  }),
  component: () => (
    <PageShell
      title="Compte client"
      intro="Suivez vos commandes, gérez vos adresses et vos préférences de communication."
      crumbs={[{ label: "Compte" }]}
    >
      <DraftNote label="À connecter">
        L'espace client sera assuré par les comptes clients Shopify (connexion
        par email à usage unique). Aucun identifiant n'est stocké sur ce site.
      </DraftNote>
      <Section title="Ce que vous y trouverez">
        <ul className="list-disc space-y-1 pl-5">
          <li>Historique et suivi de vos commandes</li>
          <li>Adresses de livraison et de facturation</li>
          <li>Préférences de langue et de communication</li>
          <li>Demandes de retour</li>
        </ul>
      </Section>
    </PageShell>
  ),
});
