import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts", "app/api/**/*.test.ts"],
    coverage: {
      reporter: ["text", "json-summary"],
      include: ["lib/**/*.ts"],
    },
  },
  resolve: {
    alias: {
      "@": new URL(".", import.meta.url).pathname,
    },
  },
});
