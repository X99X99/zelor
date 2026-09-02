import { createFileRoute } from "@tanstack/react-router";

import { PageShell, Section } from "@/components/zelor/Page";
import { absoluteUrl } from "@/lib/zelor/site";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — ZELOR — Maison éditoriale" },
      {
        name: "description",
        content:
          "ZELOR, maison lifestyle premium internationale : notre approche, notre exigence et notre manière de travailler.",
      },
      { property: "og:title", content: "À propos — ZELOR — Maison éditoriale" },
      {
        property: "og:description",
        content: "Notre approche, notre exigence et notre manière de travailler.",
      },
      { property: "og:url", content: absoluteUrl("/a-propos") },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/a-propos") }],
  }),
  component: () => (
    <PageShell
      title="À propos"
      intro="ZELOR est une maison lifestyle premium internationale. Nous choisissons peu de pièces, et nous les choisissons longuement."
      crumbs={[{ label: "À propos" }]}
      editorial
    >
      <Section title="Notre intention">
        <p>
          Réunir des pièces élégantes et utiles, les présenter avec précision et les accompagner
          d'un service clair. Pas de superlatif : des informations exactes et une allure qui se
          passe de commentaire.
        </p>
      </Section>
      <Section title="Notre manière de travailler" offset>
        <p>
          Une sélection resserrée, revue saison après saison. Des pièces éprouvées à l'usage avant
          d'être retenues. Des fiches écrites par les personnes qui les ont essayées, et un service
          qui répond dans la même langue que le site.
        </p>
      </Section>
      <Section title="Notre horizon">
        <p>
          ZELOR ouvre en France et dans l'Union européenne, puis élargira ses marchés au rythme de
          sa logistique et de son service. Chaque nouvelle destination sera annoncée lorsqu'elle
          sera réellement desservie.
        </p>
      </Section>
      <Section title="Informations société" offset>
        <p>
          Les informations d'identification de la société sont réunies sur la page des mentions
          légales, mises à jour à l'ouverture de la boutique.
        </p>
      </Section>
    </PageShell>
  ),
});
