import { createFileRoute } from "@tanstack/react-router";

import { PageShell, Section } from "@/components/zelor/Page";

export const Route = createFileRoute("/paiements")({
  head: () => ({
    meta: [
      { title: "Moyens de paiement — ZELOR — Maison éditoriale" },
      {
        name: "description",
        content:
          "Paiement sécurisé des commandes ZELOR : moyens acceptés, devises et sécurité des transactions.",
      },
      { property: "og:title", content: "Moyens de paiement — ZELOR — Maison éditoriale" },
      {
        property: "og:description",
        content: "Moyens acceptés, devises et sécurité des transactions.",
      },
      { property: "og:url", content: "/paiements" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/paiements" }],
  }),
  component: () => (
    <PageShell
      title="Moyens de paiement"
      intro="Le paiement est traité par une plateforme sécurisée. ZELOR ne conserve aucune donnée bancaire."
      crumbs={[{ label: "Moyens de paiement" }]}
    >
      <Section title="Moyens acceptés">
        <ul className="list-disc space-y-1 pl-5">
          <li>Cartes bancaires : Visa, Mastercard, American Express</li>
          <li>Portefeuilles numériques : Apple Pay, Google Pay</li>
          <li>PayPal</li>
        </ul>
        <p className="mt-3">
          Les moyens disponibles s'affichent au moment de payer, selon le pays de livraison.
        </p>
      </Section>
      <Section title="Devises">
        <p>
          Les devises proposées seront annoncées à l'ouverture, marché par marché. Le montant exact
          réglé s'affiche toujours avant la validation de la commande.
        </p>
      </Section>
      <Section title="Sécurité">
        <p>
          Les données de paiement sont chiffrées et traitées par notre prestataire de paiement.
          Aucun numéro de carte ne transite par ce site ni n'y est stocké.
        </p>
      </Section>
    </PageShell>
  ),
});
