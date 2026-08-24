import { createFileRoute, Link } from "@tanstack/react-router";

import { PageShell, Section } from "@/components/zelor/Page";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales — ZELOR" },
      {
        name: "description",
        content:
          "Éditeur, directeur de la publication, hébergement et propriété intellectuelle du site ZELOR.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Mentions légales — ZELOR" },
      {
        property: "og:description",
        content: "Éditeur, hébergement et propriété intellectuelle du site.",
      },
      { property: "og:url", content: "/mentions-legales" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/mentions-legales" }],
  }),
  component: () => (
    <PageShell
      title="Mentions légales"
      intro="Informations relatives à l'éditeur du site, à son hébergement et aux droits attachés à son contenu."
      crumbs={[{ label: "Mentions légales" }]}
    >
      <Section title="Éditeur du site">
        <p>
          Le site zelor.com est édité par la Maison ZELOR. L'identification complète de la société
          éditrice — dénomination, forme juridique, capital, siège, numéro d'immatriculation et
          numéro de TVA intracommunautaire — est publiée sur cette page à l'ouverture de la boutique
          et tenue à jour ensuite.
        </p>
      </Section>
      <Section title="Directeur de la publication">
        <p>Le directeur de la publication est le représentant légal de la société éditrice.</p>
      </Section>
      <Section title="Contact">
        <p>
          Toute demande relative au site peut être adressée depuis la page{" "}
          <Link to="/contact" className="link-underline">
            Contact
          </Link>
          . Chaque message reçoit une réponse.
        </p>
      </Section>
      <Section title="Hébergement">
        <p>
          Le site est hébergé par un prestataire d'hébergement professionnel établi dans l'Union
          européenne. Ses coordonnées complètes figurent sur cette page dès la mise en service de la
          boutique.
        </p>
      </Section>
      <Section title="Propriété intellectuelle">
        <p>
          L'ensemble des éléments du site — textes, photographies, vidéos, identité visuelle, mise
          en page et code — est protégé par le droit de la propriété intellectuelle. Toute
          reproduction, représentation ou adaptation, totale ou partielle, sans autorisation écrite
          préalable, est interdite.
        </p>
      </Section>
      <Section title="Responsabilité">
        <p>
          La Maison ZELOR apporte le plus grand soin à l'exactitude des informations publiées. Elle
          ne saurait toutefois être tenue responsable des interruptions du service, ni du contenu
          des sites tiers accessibles depuis des liens présents sur ce site.
        </p>
      </Section>
      <Section title="Droit applicable">
        <p>
          Le présent site est soumis au droit français. Les conditions de vente applicables aux
          commandes figurent dans les{" "}
          <Link to="/cgv" className="link-underline">
            conditions générales de vente
          </Link>
          .
        </p>
      </Section>
    </PageShell>
  ),
});
