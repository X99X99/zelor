import { createFileRoute, Link } from "@tanstack/react-router";

import { PageShell, Section } from "@/components/zelor/Page";

const faq = [
  {
    q: "Quels sont les délais de livraison ?",
    a: "Le délai exact dépend de la destination et du transporteur retenu. Il est affiché lors de la commande, avant le paiement, puis rappelé dans l'email de confirmation.",
  },
  {
    q: "Livrez-vous en dehors de l'Union européenne ?",
    a: "À l'ouverture, nous livrons en France et dans l'Union européenne. Les autres destinations seront ouvertes une fois la logistique et la fiscalité pleinement en place, et annoncées sur la page Livraison.",
  },
  {
    q: "Comment retourner une commande ?",
    a: "Écrivez-nous depuis la page Contact avec votre numéro de commande. Nous vous adressons la marche à suivre et l'adresse de retour, puis nous procédons au remboursement après réception et contrôle de la pièce.",
  },
  {
    q: "Quels moyens de paiement acceptez-vous ?",
    a: "Le paiement est traité par une solution sécurisée : cartes bancaires et portefeuilles numériques. La liste complète figure sur la page Moyens de paiement et s'affiche au moment de payer.",
  },
  {
    q: "Comment suivre ma commande ?",
    a: "Chaque expédition déclenche un email contenant le lien de suivi du transporteur. Le même lien reste accessible depuis votre espace client.",
  },
  {
    q: "Une question sur une pièce en particulier ?",
    a: "Écrivez-nous : nous connaissons les pièces et répondons précisément, en français comme en anglais.",
  },
];

export const Route = createFileRoute("/aide")({
  head: () => ({
    meta: [
      { title: "Aide et questions fréquentes — ZELOR — Maison éditoriale" },
      {
        name: "description",
        content:
          "Livraison, retours, paiement, suivi de commande : les réponses aux questions les plus fréquentes posées à ZELOR.",
      },
      { property: "og:title", content: "Aide et questions fréquentes — ZELOR — Maison éditoriale" },
      {
        property: "og:description",
        content: "Livraison, retours, paiement et suivi de commande.",
      },
      { property: "og:url", content: "/aide" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/aide" }],
  }),
  component: () => (
    <PageShell
      title="Aide"
      intro="Les réponses aux questions les plus fréquentes. Si vous ne trouvez pas la vôtre, écrivez-nous : nous répondons à chaque message."
      crumbs={[{ label: "Aide" }]}
      aside={
        <div className="rule-z space-y-3 pt-5">
          <p className="eyebrow">Raccourcis</p>
          <ul className="space-y-2">
            {[
              { to: "/livraison", label: "Livraison" },
              { to: "/retours", label: "Retours et remboursements" },
              { to: "/paiements", label: "Moyens de paiement" },
              { to: "/suivi-commande", label: "Suivi de commande" },
              { to: "/contact", label: "Contact" },
            ].map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="link-underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <div className="divide-y divide-border border-y border-border">
        {faq.map((item) => (
          <details key={item.q} className="py-4">
            <summary className="cursor-pointer list-none font-medium">{item.q}</summary>
            <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
          </details>
        ))}
      </div>
      <Section title="Guides">
        <p>
          Un guide d'entretien accompagnera chaque ligne dès l'ouverture, avec les gestes simples
          qui prolongent la vie d'une pièce.
        </p>
      </Section>
    </PageShell>
  ),
});
