import type { MetadataRoute } from "next";
import { listings } from "@/content/listings";
import { siteUrl } from "@/lib/site";

/** Static routes (includes the pages being built alongside this one). */
const staticRoutes: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/listings", priority: 0.9 },
  { path: "/explore", priority: 0.8 },
  { path: "/sell", priority: 0.8 },
  { path: "/areas", priority: 0.7 },
  { path: "/team", priority: 0.7 },
  { path: "/contact", priority: 0.7 },
  { path: "/privacy", priority: 0.2 },
  { path: "/terms", priority: 0.2 },
  { path: "/accessibility", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticRoutes.map(({ path, priority }) => ({
      url: `${siteUrl}${path}`,
      changeFrequency: "weekly" as const,
      priority,
    })),
    ...listings.map((l) => ({
      url: `${siteUrl}/listings/${l.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
