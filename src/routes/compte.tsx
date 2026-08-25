import { createFileRoute } from "@tanstack/react-router";

import { PageShell, Section } from "@/components/zelor/Page";

export const Route = createFileRoute("/compte")({
  head: () => ({
    meta: [
      { title: "Compte client — ZELOR — Maison éditoriale" },
      {
        name: "description",
        content: "Espace client ZELOR : commandes, adresses et préférences de communication.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Compte client — ZELOR — Maison éditoriale" },
      {
        property: "og:description",
        content: "Commandes, adresses et préférences de communication.",
      },
      { property: "og:url", content: "/compte" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/compte" }],
  }),
  component: () => (
    <PageShell
      title="Compte client"
      intro="Suivez vos commandes, gérez vos adresses et vos préférences de communication. L'espace client ouvrira avec la boutique."
      crumbs={[{ label: "Compte" }]}
    >
      <Section title="Ce que vous y trouverez">
        <ul className="list-disc space-y-1 pl-5">
          <li>Historique et suivi de vos commandes</li>
          <li>Adresses de livraison et de facturation</li>
          <li>Préférences de langue et de communication</li>
          <li>Demandes de retour</li>
        </ul>
      </Section>
      <Section title="Connexion">
        <p>
          La connexion se fera par email, à l'aide d'un code à usage unique : aucun mot de passe à
          retenir, aucun identifiant conservé sur ce site.
        </p>
      </Section>
    </PageShell>
  ),
});
