import { createFileRoute } from "@tanstack/react-router";

import { PageShell, Section } from "@/components/zelor/Page";
import { DraftNote, Missing } from "@/components/zelor/Placeholder";

export const Route = createFileRoute("/retours")({
  head: () => ({
    meta: [
      { title: "Retours et remboursements — ZELOR" },
      {
        name: "description",
        content:
          "Conditions de retour, délais de rétractation et remboursement des commandes ZELOR.",
      },
      { property: "og:title", content: "Retours et remboursements — ZELOR" },
      {
        property: "og:description",
        content: "Conditions de retour, rétractation et remboursement.",
      },
      { property: "og:url", content: "/retours" },
    ],
    links: [{ rel: "canonical", href: "/retours" }],
  }),
  component: () => (
    <PageShell
      title="Retours et remboursements"
      intro="Une procédure courte et lisible : demande, renvoi, contrôle, remboursement."
      crumbs={[{ label: "Retours et remboursements" }]}
    >
      <DraftNote label="Provisoire">
        Ce texte n'est pas un document juridique. Il doit être rédigé et
        vérifié par un professionnel avant publication.
      </DraftNote>
      <Section title="Délai">
        <p>
          Délai de rétractation : <Missing>[DÉLAI À RENSEIGNER]</Missing> à
          compter de la réception.
        </p>
      </Section>
      <Section title="Procédure">
        <ol className="list-decimal space-y-1 pl-5">
          <li>Écrivez au service client avec votre numéro de commande.</li>
          <li>Vous recevez les instructions et l'adresse de retour.</li>
          <li>
            Renvoyez la pièce à : <Missing>[ADRESSE DE RETOUR À RENSEIGNER]</Missing>
          </li>
          <li>
            Remboursement sous <Missing>[DÉLAI À RENSEIGNER]</Missing> après
            réception et contrôle.
          </li>
        </ol>
      </Section>
      <Section title="Formulaire de rétractation">
        <p>
          Un modèle de formulaire de rétractation sera mis à disposition en
          téléchargement : <Missing>[DOCUMENT À FOURNIR]</Missing>.
        </p>
      </Section>
    </PageShell>
  ),
});
