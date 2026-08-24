import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider } from "@/lib/zelor/cart";
import { SiteHeader } from "@/components/zelor/SiteHeader";
import { SiteFooter } from "@/components/zelor/SiteFooter";
import { CookieConsent } from "@/components/zelor/CookieConsent";

function NotFoundComponent() {
  return (
    <main className="container-z flex min-h-[70vh] flex-col justify-center py-20">
      <p className="eyebrow">Erreur 404</p>
      <h1 className="mt-4 max-w-2xl font-display text-4xl md:text-6xl">
        Cette page n'existe plus.
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Le lien est peut-être ancien ou incomplet. Voici les chemins les plus
        utiles.
      </p>
      <ul className="mt-8 grid max-w-lg gap-3 sm:grid-cols-2">
        {[
          { to: "/collection", label: "Voir la collection" },
          { to: "/nouveautes", label: "Nouveautés" },
          { to: "/univers", label: "L'univers ZELOR" },
          { to: "/aide", label: "Aide et contact" },
        ].map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className="chip-z lift-z flex min-h-12 items-center justify-center px-5 text-sm text-foreground"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <main className="container-z flex min-h-[70vh] flex-col justify-center py-20">
      <p className="eyebrow">Incident technique</p>
      <h1 className="mt-4 max-w-2xl font-display text-4xl md:text-5xl">
        Cette page ne s'est pas chargée.
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Vous pouvez réessayer ou revenir à l'accueil. Si le problème persiste,
        écrivez-nous depuis la page contact.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="btn-lux"
        >
          Réessayer
        </button>
        <a
          href="/"
          className="btn-lux-ghost press-z"
        >
          Accueil
        </a>
      </div>
    </main>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ZELOR — L'élégance dans chaque détail" },
      {
        name: "description",
        content:
          "ZELOR, marque lifestyle premium internationale. Des pièces choisies pour un quotidien plus raffiné.",
      },
      { name: "author", content: "ZELOR" },
      { property: "og:site_name", content: "ZELOR" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_FR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#151F31" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Manrope:wght@400;500;600&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    scripts: [
      // Pose la classe de thème avant le premier rendu : aucun flash.
      { children: THEME_INIT_SCRIPT },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "ZELOR",
          slogan: "L'élégance dans chaque détail.",
        }),
      },
    ],

  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

/** Chaque page se pose avec la même respiration, jamais un basculement sec. */
function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div key={pathname} className="page-in">
      {children}
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Aller au contenu
        </a>
        <SiteHeader />
        <main id="contenu">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
        <SiteFooter />
        <CookieConsent />
      </CartProvider>
    </QueryClientProvider>
  );
}
