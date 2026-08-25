import { createFileRoute, Link } from "@tanstack/react-router";

import { PageShell, Section } from "@/components/zelor/Page";

export const Route = createFileRoute("/retours")({
  head: () => ({
    meta: [
      { title: "Retours et remboursements — ZELOR — Maison éditoriale" },
      {
        name: "description",
        content:
          "Conditions de retour, délai de rétractation et remboursement des commandes ZELOR.",
      },
      { property: "og:title", content: "Retours et remboursements — ZELOR — Maison éditoriale" },
      {
        property: "og:description",
        content: "Conditions de retour, rétractation et remboursement.",
      },
      { property: "og:url", content: "/retours" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/retours" }],
  }),
  component: () => (
    <PageShell
      title="Retours et remboursements"
      intro="Une procédure courte et lisible : demande, renvoi, contrôle, remboursement."
      crumbs={[{ label: "Retours et remboursements" }]}
    >
      <Section title="Délai de rétractation">
        <p>
          Vous disposez du délai légal de rétractation prévu par le droit européen à compter de la
          réception de votre commande. Le délai précis applicable à votre pays est rappelé dans
          l'email de confirmation et dans les conditions générales de vente.
        </p>
      </Section>
      <Section title="Procédure">
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Écrivez-nous depuis la page{" "}
            <Link to="/contact" className="link-underline">
              Contact
            </Link>{" "}
            en indiquant votre numéro de commande.
          </li>
          <li>Vous recevez la marche à suivre et l'adresse de retour.</li>
          <li>Renvoyez la pièce dans son emballage d'origine, complète et non utilisée.</li>
          <li>
            Le remboursement est effectué sur le moyen de paiement d'origine, après réception et
            contrôle de la pièce.
          </li>
        </ol>
      </Section>
      <Section title="Pièces abîmées ou non conformes">
        <p>
          Si une pièce vous parvient endommagée ou ne correspond pas à votre commande, signalez-le
          dès la réception avec quelques photographies : nous organisons le retour à nos frais et
          procédons à l'échange ou au remboursement.
        </p>
      </Section>
      <Section title="Formulaire de rétractation">
        <p>
          Un modèle de formulaire de rétractation sera mis à disposition en téléchargement dès
          l'ouverture de la boutique. Une demande écrite claire suffit en attendant.
        </p>
      </Section>
    </PageShell>
  ),
});
