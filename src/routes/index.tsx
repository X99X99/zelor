import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { productsQueryOptions } from "@/lib/shopify/client";
import { StageOpening } from "@/components/zelor/StageOpening";
import { StageSequence } from "@/components/zelor/StageSequence";
import { ManifestScene } from "@/components/zelor/ManifestScene";
import { SilenceBand } from "@/components/zelor/SilenceBand";
import { Diptych } from "@/components/zelor/Diptych";
import { DenseGrid } from "@/components/zelor/DenseGrid";
import { ClosingScene } from "@/components/zelor/ClosingScene";
import { Reassurance } from "@/components/zelor/Reassurance";
import { absoluteUrl } from "@/lib/zelor/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZELOR | L'élégance dans chaque détail" },
      {
        name: "description",
        content:
          "Une sélection contemporaine de pièces essentielles, choisies pour leur allure, leurs matières et leur tenue dans le temps. Maison éditoriale française.",
      },
      { property: "og:title", content: "ZELOR | L'élégance dans chaque détail" },
      { name: "twitter:title", content: "ZELOR | L'élégance dans chaque détail" },
      {
        property: "og:description",
        content:
          "Une sélection contemporaine de pièces essentielles, choisies pour leur allure, leurs matières et leur tenue dans le temps. Maison éditoriale française.",
      },
      { property: "og:url", content: absoluteUrl("/") },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/") }],
  }),
  component: Home,
});

function Home() {
  const { data } = useQuery(productsQueryOptions(12));
  const products = data ?? [];
  const catalogueVide = products.length === 0;

  return (
    <>
      {/* La page suit le découpage relevé sur la référence, et ses proportions
          en écrans : 1,00 / 3,00 / 4,25 / 0,32 / 2,68 / 0,32 / 1,41 / 1,53 /
          0,26. C'est le rapport entre la plus longue et la plus courte — plus
          de treize — qui fait le rythme, pas la longueur totale. */}

      {/* 1 — L'ouverture. Un écran. Le titre reste petit : c'est l'image et le
          vide qui portent, jamais le corps de la lettre. */}
      <StageOpening />

      {/* 2 — Le manifeste. Trois écrans sans une seule image, où la phrase se
          relaie proposition par proposition. */}
      <ManifestScene />

      {/* 3 — La séquence. La section longue de la page : sans elle, toutes les
          hauteurs se ressemblent et la narration s'aplatit. */}
      <StageSequence />

      {/* 4 — Première déclaration. Un tiers d'écran, et le seul très grand
          corps de la page. Il frappe parce qu'il arrive après du vide. */}
      <SilenceBand id="declaration-un">Ce qui reste quand la nouveauté s'en va.</SilenceBand>

      {/* 5 — Le diptyque. Des plans verticaux à des échelles sans rapport,
          délibérément désalignés : une grille régulière ferait un catalogue. */}
      <Diptych />

      {/* 6 — Seconde déclaration. */}
      <SilenceBand id="declaration-deux">Peu de pièces, longuement regardées.</SilenceBand>

      {/* 7 — La planche. Après trois écrans où il ne se passe presque rien, la
          page se remplit d'un coup. Un seul format, serré. */}
      <DenseGrid catalogueVide={catalogueVide} />

      {/* 8 — La clôture. La première moitié est vide, et c'est voulu : on
          arrive au pied de page sans rupture au lieu d'y tomber. */}
      <ClosingScene />

      {/* 9 — La réassurance. La section la plus courte de la page. Elle range
          trois faits vérifiables et se tait. */}
      <Reassurance />
    </>
  );
}
