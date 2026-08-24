import { defineConfig } from "vitest/config";

// Les tests unitaires vivent à côté du code (`src/**/*.test.ts`).
// Les tests navigateur (`tests/e2e/*.spec.ts`) appartiennent à Playwright :
// une seule suite par outil, jamais deux exécutions concurrentes du même test.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
