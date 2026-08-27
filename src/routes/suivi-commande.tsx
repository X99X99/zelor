import { createFileRoute, Link } from "@tanstack/react-router";

import { PageShell, Section } from "@/components/zelor/Page";
import { absoluteUrl } from "@/lib/zelor/site";

export const Route = createFileRoute("/suivi-commande")({
  head: () => ({
    meta: [
      { title: "Suivi de commande — ZELOR — Maison éditoriale" },
      {
        name: "description",
        content:
          "Suivez votre commande ZELOR à partir de l'email de confirmation d'expédition ou depuis votre espace client.",
      },
      { property: "og:title", content: "Suivi de commande — ZELOR — Maison éditoriale" },
      {
        property: "og:description",
        content: "Suivez votre commande à partir de l'email d'expédition.",
      },
      { property: "og:url", content: absoluteUrl("/suivi-commande") },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/suivi-commande") }],
  }),
  component: () => (
    <PageShell
      title="Suivi de commande"
      intro="Chaque expédition déclenche un email contenant le lien de suivi du transporteur. Le même lien reste accessible depuis votre espace client."
      crumbs={[{ label: "Suivi de commande" }]}
    >
      <Section title="Les étapes">
        <ol className="list-decimal space-y-2 pl-5">
          <li>Confirmation de commande, par email, immédiatement.</li>
          <li>Préparation et contrôle de la pièce dans nos ateliers.</li>
          <li>Expédition, avec l'envoi du lien de suivi.</li>
          <li>Livraison à l'adresse indiquée.</li>
        </ol>
      </Section>
      <Section title="Une livraison qui tarde ?">
        <p>
          Écrivez-nous depuis la page{" "}
          <Link to="/contact" className="link-underline">
            Contact
          </Link>{" "}
          avec votre numéro de commande : nous contactons le transporteur et vous tenons informé
          jusqu'à la remise du colis.
        </p>
      </Section>
    </PageShell>
  ),
});
