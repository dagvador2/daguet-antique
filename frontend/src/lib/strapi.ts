import type {
  Piece,
  Subcategory,
  Homepage,
  AboutPage,
  ContactPage,
  SiteSettings,
} from "./types";
import {
  mockPieces,
  mockSubcategories,
  mockHomepage,
  mockAboutPage,
  mockContactPage,
  mockSiteSettings,
} from "./mock-data";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

// When Strapi is connected, set USE_MOCK to false
const USE_MOCK = !STRAPI_TOKEN;

async function fetchStrapi<T>(
  path: string,
  params?: Record<string, string>
): Promise<T | null> {
  try {
    const url = new URL(`/api${path}`, STRAPI_URL);
    if (params) {
      Object.entries(params).forEach(([key, value]) =>
        url.searchParams.set(key, value)
      );
    }

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// --- Pieces ---

export async function getPieces(filters?: {
  category?: "antiquite" | "creation";
  subcategorySlug?: string;
}): Promise<Piece[]> {
  if (USE_MOCK) {
    let pieces = [...mockPieces];
    if (filters?.category) {
      pieces = pieces.filter((p) => p.category === filters.category);
    }
    if (filters?.subcategorySlug) {
      pieces = pieces.filter(
        (p) => p.subcategory?.slug === filters.subcategorySlug
      );
    }
    return pieces.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  const params: Record<string, string> = {
    "populate": "*",
    "sort": "publishedAt:desc",
  };
  if (filters?.category) {
    params["filters[category][$eq]"] = filters.category;
  }
  if (filters?.subcategorySlug) {
    params["filters[subcategory][slug][$eq]"] = filters.subcategorySlug;
  }

  const data = await fetchStrapi<{ data: Piece[] }>("/pieces", params);
  return data?.data ?? [];
}

export async function getPieceBySlug(slug: string): Promise<Piece | null> {
  if (USE_MOCK) {
    return mockPieces.find((p) => p.slug === slug) ?? null;
  }

  const data = await fetchStrapi<{ data: Piece[] }>("/pieces", {
    "filters[slug][$eq]": slug,
    "populate": "*",
  });
  return data?.data?.[0] ?? null;
}

export async function getPiecesByCategory(
  category: "antiquite" | "creation",
  subcategorySlug?: string
): Promise<Piece[]> {
  return getPieces({ category, subcategorySlug });
}

export async function getFeaturedPieces(limit = 8): Promise<Piece[]> {
  if (USE_MOCK) {
    return mockPieces
      .filter((p) => p.featured)
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
      .slice(0, limit);
  }

  const data = await fetchStrapi<{ data: Piece[] }>("/pieces", {
    "filters[featured][$eq]": "true",
    "populate": "*",
    "sort": "publishedAt:desc",
    "pagination[limit]": String(limit),
  });
  return data?.data ?? [];
}

// --- Subcategories ---

export async function getSubcategories(
  category?: "antiquite" | "creation"
): Promise<Subcategory[]> {
  if (USE_MOCK) {
    let subs = [...mockSubcategories];
    if (category) {
      subs = subs.filter((s) => s.category === category);
    }
    return subs.sort((a, b) => a.order - b.order);
  }

  const params: Record<string, string> = { "sort": "order:asc" };
  if (category) {
    params["filters[category][$eq]"] = category;
  }

  const data = await fetchStrapi<{ data: Subcategory[] }>(
    "/subcategories",
    params
  );
  return data?.data ?? [];
}

// --- Single types ---

export async function getHomepage(): Promise<Homepage> {
  if (USE_MOCK) return mockHomepage;

  const data = await fetchStrapi<{ data: Homepage }>("/homepage", {
    populate: "*",
  });
  return data?.data ?? mockHomepage;
}

export async function getAboutPage(): Promise<AboutPage> {
  if (USE_MOCK) return mockAboutPage;

  const data = await fetchStrapi<{ data: AboutPage }>("/about-page", {
    populate: "*",
  });
  return data?.data ?? mockAboutPage;
}

export async function getContactPage(): Promise<ContactPage> {
  if (USE_MOCK) return mockContactPage;

  const data = await fetchStrapi<{ data: ContactPage }>("/contact-page", {
    populate: "*",
  });
  return data?.data ?? mockContactPage;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (USE_MOCK) return mockSiteSettings;

  const data = await fetchStrapi<{ data: SiteSettings }>("/site-setting", {
    populate: "*",
  });
  return data?.data ?? mockSiteSettings;
}
