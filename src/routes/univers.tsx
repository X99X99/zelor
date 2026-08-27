import { createFileRoute } from "@tanstack/react-router";

import editorialImage from "@/assets/editorial.jpg";
import editorialVideo from "@/assets/video-editorial.mp4.asset.json";
import { PageShell, Section } from "@/components/zelor/Page";
import { HoverVideo } from "@/components/zelor/HoverVideo";
import { absoluteUrl } from "@/lib/zelor/site";

export const Route = createFileRoute("/univers")({
  head: () => ({
    meta: [
      { title: "L'univers ZELOR — Maison éditoriale — une signature discrète" },
      {
        name: "description",
        content:
          "L'univers ZELOR : une approche calme et précise du quotidien, où la forme, l'usage et la matière comptent autant l'un que l'autre.",
      },
      { property: "og:title", content: "L'univers ZELOR — Maison éditoriale — une signature discrète" },
      {
        property: "og:description",
        content: "Une approche calme et précise du quotidien, entre forme, usage et matière.",
      },
      { property: "og:url", content: absoluteUrl("/univers") },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/univers") }],
  }),
  component: UniversePage,
});

function UniversePage() {
  return (
    <PageShell
      title="Une signature discrète."
      intro="ZELOR s'intéresse à ce qui reste : une matière agréable en main, une silhouette juste, une fonction évidente, une présentation qui ne laisse rien au hasard."
      crumbs={[{ label: "L'univers ZELOR" }]}
      aside={
        <HoverVideo
          src={editorialVideo.url}
          poster={editorialImage}
          ratio="aspect-4/5"
          alt="Intérieur contemporain aux tons pierre et marine profond, socle et objet unique."
          caption="Séquence silencieuse — au survol."
        />
      }
    >
      <Section title="Notre point de départ">
        <p>
          Les objets que l'on utilise chaque jour façonnent l'humeur d'une journée. Une pièce juste
          se reconnaît à l'usage : elle tombe bien, se range sans y penser, se patine au lieu de se
          fatiguer. C'est cette qualité-là, silencieuse, que la Maison ZELOR cherche à réunir.
        </p>
      </Section>
      <Section title="Notre manière de choisir">
        <p>
          Nous regardons la forme, l'usage et la finition, dans cet ordre. Une pièce est prise en
          main, portée, posée, déplacée pendant plusieurs semaines avant d'être retenue. Ce qui
          séduit en photographie mais déçoit à l'usage n'entre pas au catalogue.
        </p>
        <p>
          Nous demandons ensuite les informations précises — composition, provenance, entretien — et
          nous ne publions que ce que le fournisseur peut documenter.
        </p>
      </Section>
      <Section title="Une allure européenne">
        <p>
          Notre vocabulaire visuel vient de la Riviera et des villes du Sud : la lumière sur la
          pierre claire, le bleu dense de la fin de journée, le calme des intérieurs sobres. Rien de
          démonstratif, une présence.
        </p>
      </Section>
      <Section title="Une maison internationale">
        <p>
          ZELOR s'adresse à des clients en France, en Europe et au-delà. Le site ouvre en français,
          avec une structure prête pour l'anglais, le russe, l'italien, l'espagnol, l'allemand, le
          japonais et l'arabe.
        </p>
      </Section>
    </PageShell>
  );
}
