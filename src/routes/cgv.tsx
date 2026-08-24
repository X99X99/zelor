import { createFileRoute, Link } from "@tanstack/react-router";

import { PageShell, Section } from "@/components/zelor/Page";

export const Route = createFileRoute("/cgv")({
  head: () => ({
    meta: [
      { title: "Conditions générales de vente — ZELOR" },
      {
        name: "description",
        content:
          "Conditions générales de vente ZELOR : commandes, prix, paiement, livraison, rétractation et garanties.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Conditions générales de vente — ZELOR" },
      {
        property: "og:description",
        content: "Commandes, prix, livraison, rétractation et garanties.",
      },
      { property: "og:url", content: "/cgv" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/cgv" }],
  }),
  component: () => (
    <PageShell
      title="Conditions générales de vente"
      intro="Les présentes conditions régissent les commandes passées auprès de la Maison ZELOR. Elles sont acceptées au moment de la validation de la commande."
      crumbs={[{ label: "Conditions générales de vente" }]}
    >
      <Section title="Objet et champ d'application">
        <p>
          Les présentes conditions s'appliquent à toute commande passée sur ce site par un client,
          professionnel ou consommateur. Elles prévalent sur tout autre document, sous réserve des
          dispositions légales impératives du pays de résidence du client.
        </p>
      </Section>
      <Section title="Produits et disponibilité">
        <p>
          Les pièces sont présentées avec la précision la plus grande possible. Les photographies et
          descriptions n'ont pas de valeur contractuelle quant aux légères variations propres aux
          matières naturelles. Les offres sont valables dans la limite des quantités disponibles.
        </p>
      </Section>
      <Section title="Prix et taxes">
        <p>
          Les prix sont indiqués toutes taxes comprises pour les livraisons au sein de l'Union
          européenne. Les frais de livraison éventuels sont affichés avant la validation de la
          commande. Pour les destinations hors Union européenne, des droits et taxes peuvent
          s'ajouter à la charge du destinataire.
        </p>
      </Section>
      <Section title="Commande et acceptation">
        <p>
          La commande est formée lorsque le client valide son panier et le paiement correspondant.
          Un email de confirmation récapitule les pièces commandées, le montant réglé et l'adresse
          de livraison.
        </p>
      </Section>
      <Section title="Paiement">
        <p>
          Le paiement est exigible immédiatement. Il est traité par un prestataire de paiement
          sécurisé ; aucune donnée bancaire n'est conservée par la Maison ZELOR. Les moyens acceptés
          sont détaillés sur la page{" "}
          <Link to="/paiements" className="link-underline">
            Moyens de paiement
          </Link>
          .
        </p>
      </Section>
      <Section title="Livraison et transfert de risque">
        <p>
          Les zones desservies et les modalités d'expédition sont décrites sur la page{" "}
          <Link to="/livraison" className="link-underline">
            Livraison
          </Link>
          . Le risque de perte ou d'endommagement est transféré au client à la remise physique du
          colis.
        </p>
      </Section>
      <Section title="Droit de rétractation">
        <p>
          Le client consommateur dispose du délai légal de rétractation à compter de la réception de
          sa commande, sans avoir à motiver sa décision. La procédure est décrite sur la page{" "}
          <Link to="/retours" className="link-underline">
            Retours et remboursements
          </Link>
          .
        </p>
      </Section>
      <Section title="Retours et remboursements">
        <p>
          Les pièces doivent être retournées complètes, non utilisées et dans leur emballage
          d'origine. Le remboursement intervient sur le moyen de paiement d'origine après réception
          et contrôle du retour.
        </p>
      </Section>
      <Section title="Garanties légales">
        <p>
          Le client bénéficie de la garantie légale de conformité et de la garantie contre les vices
          cachés prévues par la loi, indépendamment de toute garantie commerciale. Toute demande
          peut être formulée depuis la page Contact.
        </p>
      </Section>
      <Section title="Responsabilité">
        <p>
          La responsabilité de la Maison ZELOR ne saurait être engagée en cas d'inexécution
          résultant d'un cas de force majeure ou du fait du client ou d'un tiers.
        </p>
      </Section>
      <Section title="Données personnelles">
        <p>
          Le traitement des données personnelles liées aux commandes est décrit dans la{" "}
          <Link to="/confidentialite" className="link-underline">
            politique de confidentialité
          </Link>
          .
        </p>
      </Section>
      <Section title="Droit applicable et litiges">
        <p>
          Les présentes conditions sont soumises au droit français. En cas de différend, le client
          est invité à s'adresser d'abord au service client. À défaut d'accord, il peut recourir à
          une médiation de la consommation ou saisir la juridiction compétente.
        </p>
      </Section>
    </PageShell>
  ),
});
