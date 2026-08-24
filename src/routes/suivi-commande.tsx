import { createFileRoute } from "@tanstack/react-router";

import { PageShell, Section } from "@/components/zelor/Page";
import { DraftNote, Missing } from "@/components/zelor/Placeholder";

export const Route = createFileRoute("/suivi-commande")({
  head: () => ({
    meta: [
      { title: "Suivi de commande — ZELOR" },
      {
        name: "description",
        content:
          "Suivez votre commande ZELOR à partir de l'email de confirmation d'expédition.",
      },
      { property: "og:title", content: "Suivi de commande — ZELOR" },
      {
        property: "og:description",
        content: "Suivez votre commande à partir de l'email d'expédition.",
      },
      { property: "og:url", content: "/suivi-commande" },
    ],
    links: [{ rel: "canonical", href: "/suivi-commande" }],
  }),
  component: () => (
    <PageShell
      title="Suivi de commande"
      intro="Chaque expédition déclenche un email contenant le lien de suivi du transporteur."
      crumbs={[{ label: "Suivi de commande" }]}
    >
      <DraftNote label="À connecter">
        Le suivi sera assuré par les notifications Shopify et l'espace client.
      </DraftNote>
      <Section title="Étapes">
        <ol className="list-decimal space-y-1 pl-5">
          <li>Confirmation de commande (email immédiat)</li>
          <li>Préparation : <Missing>[DÉLAI À RENSEIGNER]</Missing></li>
          <li>Expédition et lien de suivi</li>
          <li>Livraison</li>
        </ol>
      </Section>
      <Section title="Un problème de livraison ?">
        <p>
          Écrivez-nous avec votre numéro de commande : nous contactons le
          transporteur et vous tenons informé.
        </p>
      </Section>
    </PageShell>
  ),
});
