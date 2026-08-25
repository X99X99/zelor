import { toast } from "sonner";

/** ————— Couche Storefront Shopify —————
 * Source de vérité du catalogue, des stocks et du checkout.
 * Le jeton Storefront est publiable : il n'ouvre qu'un accès lecture publique.
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
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges { node { ${PRODUCT_FIELDS} } }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query GetProduct($handle: String!) {
    product(handle: $handle) { ${PRODUCT_FIELDS} }
  }
`;

export async function storefrontApiRequest(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<any> {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify : abonnement requis", {
      description:
        "L'accès à l'API Shopify demande une offre Shopify active. Rendez-vous sur admin.shopify.com pour activer une offre.",
    });
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

/** Prix formatés depuis les unités Shopify et le code devise renvoyé. */
export function formatMoney(money: ShopifyMoney | undefined, locale = "fr-FR") {
  if (!money) return "";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currencyCode,
    maximumFractionDigits: 2,
  }).format(Number(money.amount));
}

export async function fetchProducts(first = 50, query?: string): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(STOREFRONT_QUERY, { first, query: query ?? null });
  return (data?.data?.products?.edges ?? []) as ShopifyProduct[];
}

export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
  const node = data?.data?.product;
  return node ? ({ node } as ShopifyProduct) : null;
}

export const productsQueryOptions = (first = 50, query?: string) => ({
  queryKey: ["shopify", "products", first, query ?? null] as const,
  queryFn: () => fetchProducts(first, query),
  staleTime: 60_000,
});

export const productQueryOptions = (handle: string) => ({
  queryKey: ["shopify", "product", handle] as const,
  queryFn: () => fetchProductByHandle(handle),
  staleTime: 60_000,
});
