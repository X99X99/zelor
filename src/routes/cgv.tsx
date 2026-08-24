import { createFileRoute } from "@tanstack/react-router";

import { PageShell, Section } from "@/components/zelor/Page";
import { DraftNote, Missing } from "@/components/zelor/Placeholder";

export const Route = createFileRoute("/cgv")({
  head: () => ({
    meta: [
      { title: "Conditions générales de vente — ZELOR" },
      {
        name: "description",
        content:
          "Conditions générales de vente ZELOR : commandes, prix, livraison, rétractation et garanties. Document en préparation.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Conditions générales de vente — ZELOR" },
      {
        property: "og:description",
        content: "Commandes, prix, livraison, rétractation et garanties.",
      },
      { property: "og:url", content: "/cgv" },
    ],
    links: [{ rel: "canonical", href: "/cgv" }],
  }),
  component: () => (
    <PageShell
      title="Conditions générales de vente"
      crumbs={[{ label: "Conditions générales de vente" }]}
    >
      <DraftNote label="Emplacement">
        Structure de document. Le contenu doit être rédigé et validé
        juridiquement ; il n'a aucune valeur contractuelle en l'état.
      </DraftNote>
      {[
        "Objet et champ d'application",
        "Produits et disponibilité",
        "Prix et taxes",
        "Commande et acceptation",
        "Paiement",
        "Livraison et transfert de risque",
        "Droit de rétractation",
        "Retours et remboursements",
        "Garanties légales de conformité et des vices cachés",
        "Responsabilité",
        "Données personnelles",
        "Droit applicable et litiges",
      ].map((title) => (
        <Section key={title} title={title}>
          <p>
            <Missing>[CLAUSE À RÉDIGER ET À VALIDER]</Missing>
          </p>
        </Section>
      ))}
    </PageShell>
  ),
});
