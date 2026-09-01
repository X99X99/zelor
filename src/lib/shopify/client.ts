import { DEFAULT_LOCALE, shopifyContext, type LocaleCode } from "@/lib/i18n/locales";

/** ————— Couche Storefront Shopify —————
 * Source de vérité du catalogue, des stocks et du checkout.
 * Le jeton Storefront est publiable : il n'ouvre qu'un accès lecture publique.
 *
 * Chaque requête transporte la langue et le pays en cours, par la directive
 * `@inContext`. Sans elle, Shopify renverrait toujours les titres et les
 * descriptions dans la langue d'origine de la boutique — un site anglais avec
 * des noms de produits en français, ce qui ne se voit qu'une fois le catalogue
 * rempli.
 */

export const SHOPIFY_API_VERSION = "2025-07";
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "zelor-brand-foundation-pm3wq-hu6dsnjy.myshopify.com";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
export const SHOPIFY_STOREFRONT_TOKEN = "6e66110dc2314d5b73c477facd030cd2";

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    productType: string;
    tags: string[];
    createdAt: string;
    priceRange: { minVariantPrice: ShopifyMoney };
    images: { edges: Array<{ node: { url: string; altText: string | null } }> };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: ShopifyMoney;
          availableForSale: boolean;
          selectedOptions: Array<{ name: string; value: string }>;
        };
      }>;
    };
    options: Array<{ name: string; values: string[] }>;
  };
}

export const PRODUCT_FIELDS = `
  id
  title
  description
  handle
  productType
  tags
  createdAt
  priceRange { minVariantPrice { amount currencyCode } }
  images(first: 5) { edges { node { url altText } } }
  variants(first: 20) {
    edges {
      node {
        id
        title
        price { amount currencyCode }
        availableForSale
        selectedOptions { name value }
      }
    }
  }
  options { name values }
`;

export const STOREFRONT_QUERY = `
  query GetProducts($first: Int!, $query: String, $language: LanguageCode, $country: CountryCode)
  @inContext(language: $language, country: $country) {
    products(first: $first, query: $query) {
      edges { node { ${PRODUCT_FIELDS} } }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query GetProduct($handle: String!, $language: LanguageCode, $country: CountryCode)
  @inContext(language: $language, country: $country) {
    product(handle: $handle) { ${PRODUCT_FIELDS} }
  }
`;

export async function storefrontApiRequest(
  query: string,
  variables: Record<string, unknown> = {},
  locale: LocaleCode = DEFAULT_LOCALE,
  // La forme du corps dépend de la requête : chaque appelant sait ce qu'il a
  // demandé et le type sur place. Une forme générique ici ne dirait rien de vrai.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  // La langue n'est ajoutée qu'aux opérations qui la déclarent : les mutations
  // du panier n'en ont pas besoin et refuseraient une variable inconnue.
  const context = shopifyContext(locale);
  const contextual = query.includes("$language")
    ? { ...variables, language: context.language, country: context.country }
    : variables;

  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables: contextual }),
  });

  if (response.status === 402) {
    // `sonner` s'adresse au DOM : on ne le charge que dans le navigateur, et
    // seulement le jour où ce cas se présente. Un import de haut niveau
    // ferait échouer le rendu serveur de toutes les pages.
    if (typeof window !== "undefined") {
      const { toast } = await import("sonner");
      toast.error("Shopify : abonnement requis", {
        description:
          "L'accès à l'API Shopify demande une offre Shopify active. Rendez-vous sur admin.shopify.com pour activer une offre.",
      });
    }
    return;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(
      `Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(", ")}`,
    );
  }
  return data;
}

/**
 * L'URL de caisse mène-t-elle bien chez Shopify ?
 *
 * Elle est fournie par Shopify, mais elle transite par le panier, lui-même
 * conservé dans le stockage local du navigateur. Ce stockage n'est pas une
 * zone de confiance : une extension, un poste partagé ou une faille ailleurs
 * sur le domaine suffisent à y écrire. Une valeur remplacée enverrait le
 * client sur une fausse page de paiement — depuis un clic légitime, sur le
 * vrai site. C'est le scénario d'hameçonnage le plus convaincant qui soit.
 *
 * On n'ouvre donc que des adresses Shopify, et seulement en HTTPS.
 * Le jour où une caisse sur domaine personnalisé sera configurée, son hôte
 * devra être ajouté ici — sinon le bouton restera désactivé.
 */
export function isTrustedCheckoutUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    const host = url.hostname.toLowerCase();
    return (
      host.endsWith(".myshopify.com") || host === "checkout.shopify.com" || host === "shop.app"
    );
  } catch {
    // Une valeur qui n'est même pas une URL : on refuse sans discuter.
    return false;
  }
}

/** Prix formatés depuis les unités Shopify et le code devise renvoyé. */
export function formatMoney(money: ShopifyMoney | undefined, locale: string = DEFAULT_LOCALE) {
  if (!money) return "";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currencyCode,
    maximumFractionDigits: 2,
  }).format(Number(money.amount));
}

export async function fetchProducts(
  first = 50,
  query?: string,
  locale: LocaleCode = DEFAULT_LOCALE,
): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(
    STOREFRONT_QUERY,
    { first, query: query ?? null },
    locale,
  );
  return (data?.data?.products?.edges ?? []) as ShopifyProduct[];
}

export async function fetchProductByHandle(
  handle: string,
  locale: LocaleCode = DEFAULT_LOCALE,
): Promise<ShopifyProduct | null> {
  const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle }, locale);
  const node = data?.data?.product;
  return node ? ({ node } as ShopifyProduct) : null;
}

// La langue fait partie de la clé de cache : sans elle, le catalogue chargé en
// français resterait affiché après un changement de langue.
export const productsQueryOptions = (
  first = 50,
  query?: string,
  locale: LocaleCode = DEFAULT_LOCALE,
) => ({
  queryKey: ["shopify", "products", locale, first, query ?? null] as const,
  queryFn: () => fetchProducts(first, query, locale),
  staleTime: 60_000,
});

export const productQueryOptions = (handle: string, locale: LocaleCode = DEFAULT_LOCALE) => ({
  queryKey: ["shopify", "product", locale, handle] as const,
  queryFn: () => fetchProductByHandle(handle, locale),
  staleTime: 60_000,
});
