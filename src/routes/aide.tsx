import { createFileRoute, Link } from "@tanstack/react-router";

import { PageShell, Section } from "@/components/zelor/Page";
import { DraftNote, Missing } from "@/components/zelor/Placeholder";

const faq = [
  "Quels sont les délais de livraison ?",
  "Livrez-vous en dehors de l'Union européenne ?",
  "Comment retourner une commande ?",
  "Quels moyens de paiement acceptez-vous ?",
  "Comment suivre ma commande ?",
  "Comment choisir la bonne taille ?",
];

export const Route = createFileRoute("/aide")({
  head: () => ({
    meta: [
      { title: "Aide et questions fréquentes — ZELOR" },
      {
        name: "description",
        content:
          "Livraison, retours, paiement, suivi de commande : retrouvez les réponses aux questions fréquentes ZELOR.",
      },
      { property: "og:title", content: "Aide et questions fréquentes — ZELOR" },
      {
        property: "og:description",
        content: "Livraison, retours, paiement et suivi de commande.",
      },
      { property: "og:url", content: "/aide" },
    ],
    links: [{ rel: "canonical", href: "/aide" }],
  }),
  component: () => (
    <PageShell
      title="Aide"
      intro="Les réponses aux questions les plus fréquentes. Si vous ne trouvez pas ce que vous cherchez, écrivez-nous."
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
      <DraftNote label="À compléter">
        Les réponses seront rédigées une fois les délais, transporteurs et
        conditions de retour confirmés.
      </DraftNote>
      <div className="divide-y divide-border border-y border-border">
        {faq.map((question) => (
          <details key={question} className="py-4">
            <summary className="cursor-pointer list-none font-medium">
              {question}
            </summary>
            <p className="mt-2 text-sm text-muted-foreground">
              <Missing>[RÉPONSE À RENSEIGNER]</Missing>
            </p>
          </details>
        ))}
      </div>
      <Section title="Guides à venir">
        <p>
          Un guide des tailles et un guide d'utilisation seront ajoutés si la
          catégorie de produits l'exige.
        </p>
      </Section>
    </PageShell>
  ),
});
