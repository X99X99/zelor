import { createFileRoute } from "@tanstack/react-router";

import editorialImage from "@/assets/editorial.jpg";
import { PageShell, Section } from "@/components/zelor/Page";
import { DraftNote, Missing } from "@/components/zelor/Placeholder";

export const Route = createFileRoute("/univers")({
  head: () => ({
    meta: [
      { title: "L'univers ZELOR — une signature discrète" },
      {
        name: "description",
        content:
          "L'univers ZELOR : une approche calme et précise du quotidien, entre forme, fonction et présence.",
      },
      { property: "og:title", content: "L'univers ZELOR" },
      {
        property: "og:description",
        content:
          "Une approche calme et précise du quotidien, entre forme, fonction et présence.",
      },
      { property: "og:url", content: "/univers" },
    ],
    links: [{ rel: "canonical", href: "/univers" }],
  }),
  component: UniversePage,
});

function UniversePage() {
  return (
    <PageShell
      title="Une signature discrète."
      intro="ZELOR privilégie les détails qui restent : une matière agréable, une silhouette équilibrée, une fonction intuitive et une présentation qui ne laisse rien au hasard."
      crumbs={[{ label: "L'univers ZELOR" }]}
      aside={
        <img
          src={editorialImage}
          width={1408}
          height={1760}
          loading="lazy"
          alt="Intérieur contemporain aux tons pierre et vert profond, socle et objet unique."
          className="aspect-4/5 w-full object-cover"
        />
      }
    >
      <DraftNote label="Brouillon">
        Texte de marque provisoire, à valider avec la direction avant
        publication.
      </DraftNote>
      <Section title="Notre point de départ">
        <p>
          Les objets qui nous entourent méritent plus d'attention. Une bonne
          pièce se reconnaît à l'usage : elle tombe juste, elle se range bien,
          elle vieillit correctement.
        </p>
      </Section>
      <Section title="Notre manière de choisir">
        <p>
          Nous regardons la forme, la fonction et la finition. Nous demandons
          les informations précises : composition, provenance, entretien. Nous
          ne publions rien qui n'ait été vérifié.
        </p>
        <p>
          Critères détaillés : <Missing>[À COMPLÉTER PAR LA MARQUE]</Missing>
        </p>
      </Section>
      <Section title="Une marque internationale">
        <p>
          ZELOR s'adresse à des clients en France, en Europe et au-delà. Le site
          est pensé pour le français au lancement, avec une structure prête pour
          l'anglais, le russe, l'italien, l'espagnol, l'allemand, le japonais et
          l'arabe.
        </p>
      </Section>
    </PageShell>
  );
}
