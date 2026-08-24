import { describe, expect, it } from "vitest";

import { INTEGRATIONS, integrationStatus, isIntegrationConfigured } from "./registry";

describe("couche d'intégrations", () => {
  it("n'expose aucun secret dans le dépôt", () => {
    for (const spec of INTEGRATIONS) {
      for (const key of spec.publicEnv ?? []) {
        expect(key.startsWith("VITE_"), `${key} doit être publiable`).toBe(true);
      }
      for (const key of spec.serverEnv) {
        expect(key.startsWith("VITE_"), `${key} ne doit jamais être public`).toBe(false);
      }
    }
  });

  it("n'active une intégration que si sa configuration est complète", () => {
    expect(isIntegrationConfigured("stripe", {})).toBe(false);
    expect(
      isIntegrationConfigured("stripe", {
        STRIPE_SECRET_KEY: "x",
        STRIPE_WEBHOOK_SECRET: "y",
      }),
    ).toBe(true);
  });

  it("diagnostique sans révéler de valeur", () => {
    const status = integrationStatus({ CRM_API_KEY: "x" });
    const crm = status.find((s) => s.id === "crm")!;
    expect(crm.configured).toBe(false);
    expect(crm.missing).toEqual(["CRM_BASE_URL"]);
    expect(JSON.stringify(status)).not.toContain("x");
  });
});
