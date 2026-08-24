import { createFileRoute, Link } from "@tanstack/react-router";

import heroImage from "@/assets/hero.jpg";
import editorialImage from "@/assets/editorial.jpg";
import detailImage from "@/assets/detail.jpg";
import detailVideo from "@/assets/video-detail.mp4.asset.json";
import editorialVideo from "@/assets/video-editorial.mp4.asset.json";
import { BRAND, DEMO_PRODUCTS, PROMISES } from "@/lib/zelor/content";
import { ProductCard } from "@/components/zelor/ProductCard";
import { HoverVideo } from "@/components/zelor/HoverVideo";
import { DraftNote, Missing } from "@/components/zelor/Placeholder";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZELOR — L'élégance dans chaque détail" },
      {
        name: "description",
        content:
          "ZELOR sélectionne des pièces élégantes et fonctionnelles pour un quotidien plus raffiné. Livraison en France et dans l'Union européenne.",
      },
      { property: "og:title", content: "ZELOR — L'élégance dans chaque détail" },
      {
        property: "og:description",
        content:
          "Marque lifestyle premium internationale. Des pièces choisies pour leur équilibre entre forme, fonction et présence.",
      },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* A. Hero */}
      <section className="relative">
        <img
          src={heroImage}
          width={1920}
          height={1200}
          fetchPriority="high"
          alt="Atmosphère ZELOR : lumière naturelle sur une composition en pierre, céramique et lin."
          className="h-[68vh] min-h-[26rem] w-full object-cover md:h-[82vh]"
        />
        <div className="container-z absolute inset-0 flex items-end pb-10 md:items-center md:pb-0">
          <div className="rise max-w-xl bg-background/80 p-6 backdrop-blur-[2px] md:bg-transparent md:p-0 md:backdrop-blur-none">
            <p className="eyebrow">Maison ZELOR</p>
            <h1 className="mt-3 font-display text-4xl md:text-6xl lg:text-7xl">
              {BRAND.taglineFr}
            </h1>
            <p className="mt-4 max-w-md text-sm text-foreground/80 md:text-base">
              {BRAND.heroSubtitle}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-5">
              <Link
                to="/collection"
                className="inline-flex min-h-12 items-center bg-primary px-7 text-sm tracking-[0.14em] text-primary-foreground uppercase transition-opacity hover:opacity-85"
              >
                Découvrir la collection
              </Link>
              <Link to="/univers" className="link-underline text-sm">
                L'univers ZELOR
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container-z pt-6">
        <DraftNote label="Placeholder">
          Catégorie de produits non définie :{" "}
          <Missing>[CATÉGORIE À DÉFINIR]</Missing>. Visuel d'ambiance à
          remplacer par la photographie officielle de la marque.
        </DraftNote>
      </div>

      {/* B. Promesse */}
      <section
        aria-labelledby="promesse-title"
        className="container-z py-20 md:py-28"
      >
        <h2 id="promesse-title" className="sr-only">
          Nos engagements
        </h2>
        <ul className="grid gap-10 md:grid-cols-3 md:gap-12">
          {PROMISES.map((promise) => (
            <li key={promise.title} className="rule-z pt-6">
              <h3 className="font-display text-2xl">{promise.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                {promise.body}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <DraftNote>
            Engagements à confirmer par la marque. Ils ne constituent ni une
            certification, ni une garantie contractuelle.
          </DraftNote>
        </div>
      </section>

      {/* C. Collection */}
      <section
        aria-labelledby="collection-title"
        className="container-z pb-20 md:pb-28"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Sélection</p>
            <h2
              id="collection-title"
              className="mt-2 font-display text-3xl md:text-4xl"
            >
              La collection
            </h2>
          </div>
          <Link to="/collection" className="link-underline text-sm">
            Voir tout
          </Link>
        </div>
        <div className="mt-4">
          <DraftNote label="Démonstration">
            Ces fiches sont des exemples de mise en page. Aucun produit n'est en
            vente : le catalogue, les prix et les stocks proviendront de
            Shopify.
          </DraftNote>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
          {DEMO_PRODUCTS.slice(0, 4).map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* D. Storytelling */}
      <section className="bg-secondary/60">
        <div className="container-z grid gap-10 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <h2 className="font-display text-3xl md:text-5xl">
              Le goût des choses bien choisies.
            </h2>
            <p className="mt-6 max-w-md text-base text-foreground/80">
              ZELOR est née d'une idée simple : les objets qui nous entourent
              méritent plus d'attention. Chaque pièce est pensée ou sélectionnée
              pour son équilibre entre forme, fonction et présence. De la
              première impression au dernier détail, nous construisons une
              expérience plus calme, plus précise et plus personnelle.
            </p>
            <div className="mt-6 max-w-md">
              <DraftNote label="Brouillon">
                Texte provisoire, à valider une fois les produits et l'histoire
                réels définis.
              </DraftNote>
            </div>
          </div>
          <img
            src={detailImage}
            width={1408}
            height={1008}
            loading="lazy"
            alt="Détail de matière : arête d'un objet posée sur un tissu de lin sable."
            className="aspect-4/3 w-full object-cover"
          />
        </div>
      </section>

      {/* E. Qualité */}
      <section
        aria-labelledby="qualite-title"
        className="container-z py-20 md:py-28"
      >
        <p className="eyebrow">Qualité</p>
        <h2
          id="qualite-title"
          className="mt-2 max-w-2xl font-display text-3xl md:text-4xl"
        >
          Ce que nous regardons avant de sélectionner une pièce.
        </h2>
        <dl className="mt-10 grid gap-8 md:grid-cols-3">
          {[
            ["Finition", "[DÉTAIL DE QUALITÉ À CONFIRMER]"],
            ["Matière", "[MATIÈRE OU FINITION À CONFIRMER]"],
            ["Conception", "[ÉLÉMENT DE CONCEPTION À CONFIRMER]"],
          ].map(([term, value]) => (
            <div key={term} className="rule-z pt-6">
              <dt className="eyebrow">{term}</dt>
              <dd className="mt-3">
                <Missing>{value}</Missing>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
          Aucune origine, certification, garantie ou performance n'est affirmée
          tant qu'elle n'a pas été vérifiée et documentée.
        </p>
      </section>

      {/* F. Section éditoriale */}
      <section className="container-z grid gap-10 pb-20 md:grid-cols-[1.1fr_1fr] md:items-center md:pb-28">
        <img
          src={editorialImage}
          width={1408}
          height={1760}
          loading="lazy"
          alt="Intérieur de boutique contemporaine : alcôve vert profond, socle de pierre et lumière douce."
          className="aspect-4/5 w-full object-cover"
        />
        <div>
          <p className="eyebrow">Éditorial</p>
          <h2 className="mt-2 font-display text-3xl md:text-5xl">
            Une signature discrète.
          </h2>
          <p className="mt-6 max-w-md text-base text-foreground/80">
            ZELOR privilégie les détails qui restent : une matière agréable, une
            silhouette équilibrée, une fonction intuitive et une présentation
            qui ne laisse rien au hasard.
          </p>
          <div className="mt-6 max-w-md">
            <DraftNote>
              À adapter aux produits réels avant publication.
            </DraftNote>
          </div>
          <Link
            to="/univers"
            className="link-underline mt-6 inline-block text-sm"
          >
            Lire l'univers ZELOR
          </Link>
        </div>
      </section>

      {/* G. Avis */}
      <section
        aria-labelledby="avis-title"
        className="container-z pb-20 md:pb-28"
      >
        <h2 id="avis-title" className="font-display text-3xl md:text-4xl">
          Avis clients
        </h2>
        <div className="mt-6 border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Les avis clients apparaîtront ici après les premières commandes.
          </p>
        </div>
      </section>
    </>
  );
}
