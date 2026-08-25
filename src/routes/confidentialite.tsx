import { createFileRoute, Link } from "@tanstack/react-router";

import { PageShell, Section } from "@/components/zelor/Page";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité — ZELOR — Maison éditoriale" },
      {
        name: "description",
        content:
          "Traitement des données personnelles chez ZELOR : finalités, bases légales, durées de conservation et droits des personnes.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Politique de confidentialité — ZELOR — Maison éditoriale" },
      {
        property: "og:description",
        content: "Finalités, durées de conservation et droits des personnes.",
      },
      { property: "og:url", content: "/confidentialite" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/confidentialite" }],
  }),
  component: () => (
    <PageShell
      title="Politique de confidentialité"
      intro="La Maison ZELOR ne collecte que les données nécessaires à la commande, à la livraison et au service client."
      crumbs={[{ label: "Confidentialité" }]}
    >
      <Section title="Responsable de traitement">
        <p>
          Le responsable du traitement est la société éditrice du site, identifiée sur la page{" "}
          <Link to="/mentions-legales" className="link-underline">
            Mentions légales
          </Link>
          .
        </p>
      </Section>
      <Section title="Données collectées">
        <p>
          Identité et coordonnées, adresses de livraison et de facturation, historique de commandes,
          échanges avec le service client, et données techniques de navigation strictement
          nécessaires au fonctionnement du site. Aucune donnée bancaire n'est conservée par la
          Maison ZELOR.
        </p>
      </Section>
      <Section title="Finalités et bases légales">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Exécution de la commande, de la livraison et du service après-vente — exécution du
            contrat.
          </li>
          <li>Obligations comptables et fiscales — respect d'une obligation légale.</li>
          <li>Envoi de la lettre de la Maison — consentement, révocable à tout moment.</li>
          <li>
            Mesure d'audience et amélioration du site — consentement, recueilli via le panneau de
            préférences.
          </li>
        </ul>
      </Section>
      <Section title="Destinataires et sous-traitants">
        <p>
          Les données sont communiquées aux seuls prestataires nécessaires : plateforme de commerce,
          prestataire de paiement, transporteurs et outil d'envoi d'emails, tous liés par un
          engagement de confidentialité.
        </p>
      </Section>
      <Section title="Transferts hors Union européenne">
        <p>
          Lorsqu'un prestataire traite des données en dehors de l'Union européenne, le transfert est
          encadré par les garanties prévues par le RGPD, notamment les clauses contractuelles types
          de la Commission européenne.
        </p>
      </Section>
      <Section title="Durées de conservation">
        <p>
          Les données de commande sont conservées pendant la durée requise par les obligations
          comptables. Les données liées à un compte client sont conservées tant que le compte est
          actif. Les données de prospection sont supprimées au retrait du consentement.
        </p>
      </Section>
      <Section title="Vos droits">
        <p>
          Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation,
          d'opposition et de portabilité, ainsi que du droit de définir des directives post mortem.
          Adressez votre demande depuis la page{" "}
          <Link to="/contact" className="link-underline">
            Contact
          </Link>
          . Vous pouvez également introduire une réclamation auprès de l'autorité de contrôle
          compétente.
        </p>
      </Section>
      <Section title="Cookies">
        <p>
          Les traceurs déposés et la manière de les refuser sont décrits sur la page{" "}
          <Link to="/cookies" className="link-underline">
            Cookies
          </Link>
          .
        </p>
      </Section>
    </PageShell>
  ),
});
