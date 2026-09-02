import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import editorialImage from "@/assets/editorial.jpg";
import detailImage from "@/assets/detail.jpg";
import detailVideo from "@/assets/video-detail.mp4.asset.json";
import editorialVideo from "@/assets/video-editorial.mp4.asset.json";
import { PROMISES } from "@/lib/zelor/content";
import { productsQueryOptions } from "@/lib/shopify/client";
import { ProductCard } from "@/components/zelor/ProductCard";
import { EmptyCatalog } from "@/components/zelor/EmptyCatalog";
import { HoverVideo } from "@/components/zelor/HoverVideo";
import { HeroScroll } from "@/components/zelor/HeroScroll";
import { Reveal } from "@/components/zelor/Reveal";
import { SplitReveal } from "@/components/zelor/SplitReveal";
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
  const { data } = useQuery(productsQueryOptions(4));
  const products = data ?? [];

  return (
    <>
      {/* A. Ouverture épinglée */}
      <HeroScroll />

      {/* A bis. Le manifeste.
          Vero ne met sous son ouverture ni argument ni bouton : la scène tient
          seule, et la phrase qui l'explique vient après, dans une colonne
          étroite. On reprend cet ordre — l'accroche en sans serré, le détail
          en petit, et les deux chemins d'entrée seulement à la fin. */}
      <Reveal as="section" className="container-z module-silence-z text-center">
        <p className="lead-z mx-auto max-w-3xl">
          Une sélection contemporaine de pièces essentielles, choisies pour leur allure, leurs
          matières et leur tenue dans le temps.
        </p>
        <p className="mx-auto mt-8 max-w-md text-sm text-muted-foreground">
          Une maison éditoriale française pensée à Nice, où chaque pièce affirme une élégance
          durable. Livraison internationale avec suivi.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          <Link to="/collection" className="btn-lux whitespace-nowrap">
            Découvrir la collection
          </Link>
          <Link to="/univers" className="link-underline text-sm whitespace-nowrap">
            L'univers ZELOR
          </Link>
        </div>
      </Reveal>

      {/* B. Promesse */}
      <Reveal as="section" aria-labelledby="promesse-title" className="container-z module-breath-z">
        <h2 id="promesse-title" className="sr-only">
          Nos engagements
        </h2>
        <ul className="grid gap-10 md:grid-cols-3 md:gap-12">
          {PROMISES.map((promise) => (
            <li key={promise.title} className="rule-z pt-6">
              <h3 className="subhead-z">{promise.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{promise.body}</p>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* C. Collection */}
      <Reveal
        as="section"
        aria-labelledby="collection-title"
        className="container-z module-develop-z"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Sélection</p>
            <h2 id="collection-title" className="caps-z mt-4 display-2-z">
              La collection
            </h2>
          </div>
          <Link to="/collection" className="link-underline text-sm">
            Voir tout
          </Link>
        </div>
        <p className="mt-4 max-w-xl text-sm text-muted-foreground">
          Quelques pièces de la sélection en cours. Les prix seront communiqués à l'ouverture.
        </p>
        {products.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {products.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <EmptyCatalog />
          </div>
        )}
      </Reveal>

      {/* D. Storytelling */}
      <Reveal as="section" replay className="surface-light hairline-z">
        <div className="container-z module-develop-z grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <SplitReveal text="Le goût des choses bien *choisies.*" className="display-1-z" />
            <p className="prose-z mt-6 max-w-lg text-foreground/80">
              ZELOR est née d'une idée simple : les objets qui nous entourent méritent plus
              d'attention. Chaque pièce est pensée ou sélectionnée pour son équilibre entre forme,
              fonction et présence. De la première impression au dernier détail, nous construisons
              une expérience plus calme, plus précise et plus personnelle.
            </p>
          </div>
          <HoverVideo
            className="clip-reveal-z"
            src={detailVideo.url}
            poster={detailImage}
            ratio="aspect-4/3"
            alt="Détail de matière : arête d'un objet posée sur un tissu de lin sable."
            caption="Séquence silencieuse — au survol."
          />
        </div>
      </Reveal>

      {/* E. Qualité */}
      <Reveal as="section" aria-labelledby="qualite-title" className="container-z module-silence-z">
        <p className="eyebrow">Qualité</p>
        <SplitReveal
          id="qualite-title"
          text="Ce que nous regardons *avant de sélectionner* une pièce."
          className="mt-4 max-w-4xl display-2-z"
        />
        <dl className="mt-10 grid gap-8 md:grid-cols-3">
          {[
            [
              "Finition",
              "Une arête franche, une couture régulière, un assemblage qui ne se voit pas.",
            ],
            [
              "Matière",
              "Une main agréable, une teinte stable, une surface qui se patine sans se marquer.",
            ],
            [
              "Conception",
              "Un usage évident dès la première prise en main, sans notice ni apprentissage.",
            ],
          ].map(([term, value]) => (
            <div key={term} className="rule-z pt-6">
              <dt className="eyebrow">{term}</dt>
              <dd className="mt-3 text-sm text-foreground/80">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
          Nous n'annonçons une origine, une certification ou une garantie que lorsqu'elle est
          documentée. Le reste se lit dans l'objet.
        </p>
      </Reveal>

      {/* F. Section éditoriale */}
      <Reveal
        as="section"
        replay
        className="container-z module-develop-z grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center"
      >
        <HoverVideo
          className="clip-reveal-z"
          src={editorialVideo.url}
          poster={editorialImage}
          ratio="aspect-4/5"
          alt="Intérieur de boutique contemporaine : alcôve profonde, socle de pierre et lumière douce."
          caption="Séquence silencieuse — au survol."
        />
        <div>
          <p className="eyebrow">Éditorial</p>
          <SplitReveal text="Une signature *discrète.*" className="mt-4 display-1-z" />
          <p className="mt-6 max-w-md text-base text-foreground/80">
            ZELOR privilégie les détails qui restent : une matière agréable, une silhouette
            équilibrée, une fonction intuitive et une présentation qui ne laisse rien au hasard.
          </p>
          <Link to="/univers" className="link-underline mt-6 inline-block text-sm">
            Lire l'univers ZELOR
          </Link>
        </div>
      </Reveal>

      {/* G. Avis */}
      <section aria-labelledby="avis-title" className="container-z module-close-z">
        <h2 id="avis-title" className="caps-z display-2-z">
          Avis clients
        </h2>
        <div className="surface-light aura-z mt-6 rounded-3xl border border-border/70 p-14 text-center">
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            Les premiers retours de nos clients paraîtront ici, tels qu'ils nous seront adressés,
            sans sélection ni retouche.
          </p>
        </div>
      </section>
    </>
  );
}
