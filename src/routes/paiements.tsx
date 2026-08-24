import { createFileRoute } from "@tanstack/react-router";

import { PageShell, Section } from "@/components/zelor/Page";
import { DraftNote, Missing } from "@/components/zelor/Placeholder";

export const Route = createFileRoute("/paiements")({
  head: () => ({
    meta: [
      { title: "Moyens de paiement — ZELOR" },
      {
        name: "description",
        content:
          "Paiements sécurisés via Shopify Checkout. Moyens acceptés et sécurité des transactions ZELOR.",
      },
      { property: "og:title", content: "Moyens de paiement — ZELOR" },
      {
        property: "og:description",
        content: "Paiements sécurisés via Shopify Checkout.",
      },
      { property: "og:url", content: "/paiements" },
    ],
    links: [{ rel: "canonical", href: "/paiements" }],
  }),
  component: () => (
    <PageShell
      title="Moyens de paiement"
      intro="Le paiement est traité par Shopify Checkout. ZELOR ne stocke aucune donnée bancaire."
      crumbs={[{ label: "Moyens de paiement" }]}
    >
      <DraftNote label="À confirmer">
        La liste finale dépend des passerelles activées dans Shopify Payments.
      </DraftNote>
      <Section title="Moyens envisagés">
        <ul className="list-disc space-y-1 pl-5">
          <li>Cartes bancaires (Visa, Mastercard, American Express)</li>
          <li>Shop Pay, Apple Pay, Google Pay</li>
          <li>PayPal</li>
          <li>
            Autres méthodes locales : <Missing>[À CONFIRMER PAR MARCHÉ]</Missing>
          </li>
        </ul>
      </Section>
      <Section title="Sécurité">
        <p>
          Les données de paiement sont chiffrées et traitées par Shopify, aucun
          numéro de carte ne transite par ce site.
        </p>
      </Section>
    </PageShell>
  ),
});
