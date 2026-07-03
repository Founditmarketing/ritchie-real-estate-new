/**
 * Canonical site origin for metadata, sitemap, robots, and JSON-LD.
 * Prefers an explicit env override, then the Vercel production domain,
 * and falls back to the local dev port (3001 — see package.json).
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3001");
