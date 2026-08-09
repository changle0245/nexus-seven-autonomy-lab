const productionHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ??
  process.env.VERCEL_URL ??
  "localhost:3000";

export const siteUrl = productionHost.startsWith("http")
  ? productionHost
  : `${productionHost === "localhost:3000" ? "http" : "https"}://${productionHost}`;
