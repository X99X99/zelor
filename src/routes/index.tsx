import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";


import editorialImage from "@/assets/editorial.jpg";
import detailImage from "@/assets/detail.jpg";
import detailVideo from "@/assets/video-detail.mp4.asset.json";
import editorialVideo from "@/assets/video-editorial.mp4.asset.json";
import { BRAND, PROMISES } from "@/lib/zelor/content";
import { productsQueryOptions } from "@/lib/shopify/client";
import { ProductCard } from "@/components/zelor/ProductCard";
import { EmptyCatalog } from "@/components/zelor/EmptyCatalog";
import { HoverVideo } from "@/components/zelor/HoverVideo";
import { Reveal } from "@/components/zelor/Reveal";
import { absoluteUrl } from "@/lib/zelor/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZELOR — Maison éditoriale" },
      {
        name: "description",
        content:
          "ZELOR est une maison éditoriale contemporaine. Des pièces choisies avec exigence, entre présence, usage et élégance. Livraison en France et dans l'Union européenne.",
      },
      { property: "og:title", content: "ZELOR — Maison éditoriale" },
      {
        property: "og:description",
        content:
          "ZELOR est une maison éditoriale contemporaine. Des pièces choisies avec exigence, entre présence, usage et élégance. Livraison en France et dans l'Union européenne.",
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
      {/* A. Hero */}
      <section className="relative isolate">
        <img
          src={heroImage}
          width={1920}
          height={1200}
          fetchPriority="high"
          alt="Atmosphère ZELOR : lumière naturelle sur une composition en pierre, céramique et lin."
          className="h-[68vh] min-h-[26rem] w-full object-cover md:h-[82vh]"
        />
        <div
          aria-hidden="true"
          className="grain-z absolute inset-0 bg-linear-to-t from-navy-deep/85 via-navy/30 to-navy-deep/25 md:bg-linear-to-r md:from-navy-deep/80 md:via-navy/25 md:to-navy-deep/10"
        />
        <div className="container-z absolute inset-0 flex items-end pb-12 md:items-center md:pb-0">
          <div className="slide-up-lux max-w-xl text-navy-foreground">
            <p className="eyebrow text-navy-foreground/65">Maison ZELOR</p>
            <h1 className="mt-3 font-display text-4xl md:text-6xl lg:text-7xl">
              {BRAND.taglineFr}
            </h1>
            <p className="mt-4 max-w-md text-sm text-navy-foreground/80 md:text-base">
              {BRAND.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link
                to="/collection"
                className="btn-lux ring-1 whitespace-nowrap ring-navy-foreground/20"
              >
                Découvrir la collection
              </Link>
              <Link
                to="/univers"
                className="link-underline text-sm whitespace-nowrap text-navy-foreground/90"
              >
                L'univers ZELOR
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* B. Promesse */}
      <Reveal as="section" aria-labelledby="promesse-title" className="container-z py-24 md:py-32">
        <h2 id="promesse-title" className="sr-only">
          Nos engagements
        </h2>
        <ul className="grid gap-10 md:grid-cols-3 md:gap-12">
          {PROMISES.map((promise) => (
            <li key={promise.title} className="rule-z pt-6">
              <h3 className="font-display text-2xl">{promise.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{promise.body}</p>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* C. Collection */}
      <Reveal
        as="section"
        aria-labelledby="collection-title"
        className="container-z pb-24 md:pb-32"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Sélection</p>
            <h2 id="collection-title" className="mt-2 font-display text-3xl md:text-4xl">
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
        <div className="container-z grid gap-10 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <h2 className="font-display text-3xl md:text-5xl">Le goût des choses bien choisies.</h2>
            <p className="mt-6 max-w-md text-base text-foreground/80">
              ZELOR est née d'une idée simple : les objets qui nous entourent méritent plus
              d'attention. Chaque pièce est pensée ou sélectionnée pour son équilibre entre forme,
              fonction et présence. De la première impression au dernier détail, nous construisons
              une expérience plus calme, plus précise et plus personnelle.
            </p>
          </div>
          <HoverVideo
            src={detailVideo.url}
            poster={detailImage}
            ratio="aspect-4/3"
            alt="Détail de matière : arête d'un objet posée sur un tissu de lin sable."
            caption="Séquence silencieuse — au survol."
          />
        </div>
      </Reveal>

      {/* E. Qualité */}
      <Reveal as="section" aria-labelledby="qualite-title" className="container-z py-24 md:py-32">
        <p className="eyebrow">Qualité</p>
        <h2 id="qualite-title" className="mt-2 max-w-2xl font-display text-3xl md:text-4xl">
          Ce que nous regardons avant de sélectionner une pièce.
        </h2>
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
        className="container-z grid gap-10 pb-20 md:grid-cols-[1.1fr_1fr] md:items-center md:pb-28"
      >
        <HoverVideo
          src={editorialVideo.url}
          poster={editorialImage}
          ratio="aspect-4/5"
          alt="Intérieur de boutique contemporaine : alcôve profonde, socle de pierre et lumière douce."
          caption="Séquence silencieuse — au survol."
        />
        <div>
          <p className="eyebrow">Éditorial</p>
          <h2 className="mt-2 font-display text-3xl md:text-5xl">Une signature discrète.</h2>
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
      <section aria-labelledby="avis-title" className="container-z pb-4">
        <h2 id="avis-title" className="font-display text-3xl md:text-4xl">
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
