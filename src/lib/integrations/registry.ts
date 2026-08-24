/** ————— Couche d'intégrations ZELOR (préparation, aucune connexion) —————
 *
 * Aucun compte externe n'est branché ici, aucune clé n'est présente et aucun
 * appel réseau n'est effectué. Ce fichier décrit *le contrat* : quelles
 * intégrations sont prévues, quelles variables d'environnement serveur elles
 * exigent, et par quel drapeau on les active. L'interface ne parle jamais
 * directement à un fournisseur : elle passe par un adaptateur qui respecte ce
 * registre.
 *
 * Invariants :
 *  - les secrets restent côté serveur (`process.env`, lus dans un handler) ;
 *  - rien de sensible n'est exposé via `import.meta.env.VITE_*` ;
 *  - une intégration désactivée doit dégrader proprement (état vide, pas
 *    d'erreur visible) ;
 *  - toute intégration passe par un environnement sandbox avant production.
 */

export type IntegrationDomain =
  "payments" | "commerce" | "crm" | "shipping" | "inventory" | "analytics" | "email" | "support";

export type IntegrationSpec = {
  id: string;
  domain: IntegrationDomain;
  /** Ce que l'intégration apporte au produit, en une phrase. */
  purpose: string;
  /** Variables d'environnement serveur attendues (jamais côté navigateur). */
  serverEnv: readonly string[];
  /** Variables publiques éventuelles (clés publiables uniquement). */
  publicEnv?: readonly string[];
  /** Webhooks à exposer sous `src/routes/api/public/*`, signature vérifiée. */
  webhooks?: readonly string[];
  /** Décision métier requise avant activation. */
  requiresBusinessDecision: boolean;
};

export const INTEGRATIONS: readonly IntegrationSpec[] = [
  {
    id: "shopify",
    domain: "commerce",
    purpose: "Catalogue, stock et commandes réels en remplacement du contenu de démonstration.",
    serverEnv: ["SHOPIFY_STORE_DOMAIN", "SHOPIFY_STOREFRONT_TOKEN"],
    webhooks: ["orders/create", "products/update"],
    requiresBusinessDecision: true,
  },
  {
    id: "stripe",
    domain: "payments",
    purpose: "Encaissement, remboursements et reçus.",
    serverEnv: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"],
    publicEnv: ["VITE_STRIPE_PUBLISHABLE_KEY"],
    webhooks: ["payment_intent.succeeded", "charge.refunded"],
    requiresBusinessDecision: true,
  },
  {
    id: "shipping",
    domain: "shipping",
    purpose: "Tarifs, étiquettes et suivi de commande.",
    serverEnv: ["SHIPPING_API_KEY", "SHIPPING_ACCOUNT_ID"],
    webhooks: ["shipment.updated"],
    requiresBusinessDecision: true,
  },
  {
    id: "crm",
    domain: "crm",
    purpose: "Fiches client, historique et service après-vente.",
    serverEnv: ["CRM_API_KEY", "CRM_BASE_URL"],
    requiresBusinessDecision: true,
  },
  {
    id: "email",
    domain: "email",
    purpose: "Transactionnel (commande, expédition) et newsletter opt-in.",
    serverEnv: ["EMAIL_API_KEY", "EMAIL_FROM_ADDRESS"],
    requiresBusinessDecision: true,
  },
  {
    id: "analytics",
    domain: "analytics",
    purpose: "Mesure d'audience respectueuse, soumise au consentement cookies.",
    publicEnv: ["VITE_ANALYTICS_ID"],
    serverEnv: [],
    requiresBusinessDecision: true,
  },
] as const;

export function getIntegration(id: string): IntegrationSpec | undefined {
  return INTEGRATIONS.find((i) => i.id === id);
}

/**
 * Une intégration n'est active que si toutes ses variables serveur sont
 * présentes. À appeler exclusivement côté serveur (handler de server function).
 */
export function isIntegrationConfigured(
  id: string,
  env: Record<string, string | undefined>,
): boolean {
  const spec = getIntegration(id);
  if (!spec) return false;
  return spec.serverEnv.every((key) => Boolean(env[key]));
}

/** État lisible pour un diagnostic sans jamais révéler une valeur de secret. */
export function integrationStatus(env: Record<string, string | undefined>) {
  return INTEGRATIONS.map((spec) => ({
    id: spec.id,
    domain: spec.domain,
    configured: isIntegrationConfigured(spec.id, env),
    missing: spec.serverEnv.filter((key) => !env[key]),
  }));
}
