import type { MetadataRoute } from "next";
import { getPieces } from "@/lib/strapi";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://antiquedaguet.fr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pieces = await getPieces();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/antiquites`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/travaux`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/a-propos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/mentions-legales`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const piecePages: MetadataRoute.Sitemap = pieces.map((piece) => {
    const prefix = piece.category === "antiquite" ? "antiquites" : "travaux";
    return {
      url: `${BASE_URL}/${prefix}/${piece.slug}`,
      lastModified: new Date(piece.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    };
  });

  return [...staticPages, ...piecePages];
}
