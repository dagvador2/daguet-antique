import type {
  Piece,
  Subcategory,
  Homepage,
  AboutPage,
  ContactPage,
  SiteSettings,
  StrapiMedia,
  Article,
} from "./types";
import {
  mockPieces,
  mockSubcategories,
  mockHomepage,
  mockAboutPage,
  mockContactPage,
  mockSiteSettings,
  mockArticles,
} from "./mock-data";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

const USE_MOCK = !STRAPI_TOKEN;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

// Convert Strapi v5 blocks JSON to HTML string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function blocksToHtml(blocks: any): string {
  if (!blocks) return "";
  if (typeof blocks === "string") return blocks;
  if (!Array.isArray(blocks)) return "";

  return blocks
    .map((block) => {
      if (block.type === "paragraph") {
        const text = block.children
          ?.map((child: { text?: string; bold?: boolean; italic?: boolean }) => {
            let t = child.text ?? "";
            if (child.bold) t = `<strong>${t}</strong>`;
            if (child.italic) t = `<em>${t}</em>`;
            return t;
          })
          .join("");
        return `<p>${text}</p>`;
      }
      if (block.type === "heading") {
        const level = block.level ?? 2;
        const text = block.children?.map((c: { text?: string }) => c.text ?? "").join("");
        return `<h${level}>${text}</h${level}>`;
      }
      if (block.type === "list") {
        const tag = block.format === "ordered" ? "ol" : "ul";
        const items = block.children
          ?.map((item: { children?: { text?: string }[] }) => {
            const text = item.children?.map((c) => c.text ?? "").join("");
            return `<li>${text}</li>`;
          })
          .join("");
        return `<${tag}>${items}</${tag}>`;
      }
      return "";
    })
    .join("");
}

// Generate a slug from a title
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Map a raw Strapi piece to our domain Piece type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPiece(raw: any, locale: string = "fr"): Piece {
  const useEn = locale === "en";
  return {
    id: raw.id,
    title: (useEn && raw.title_en) || raw.title,
    slug: raw.slug || slugify(raw.title),
    description: blocksToHtml(
      (useEn && raw.description_en) || raw.description
    ),
    photos: (raw.photos ?? []).map(mapMedia),
    category: raw.category,
    subcategory: raw.subcategory
      ? {
          id: raw.subcategory.id,
          name: (useEn && raw.subcategory.name_en) || raw.subcategory.name,
          slug: raw.subcategory.slug,
          category: raw.subcategory.category,
          order: raw.subcategory.order,
        }
      : null,
    period: (useEn && raw.period_en) || (raw.period ?? null),
    materials: (useEn && raw.materials_en) || (raw.materials ?? null),
    dimensions: raw.dimensions ?? null,
    provenance: raw.provenance ?? null,
    price: raw.price ?? null,
    showPrice: raw.show_price ?? false,
    status: raw.sale_status === "sold" ? "sold" : "available",
    workInProgress: raw.work_in_progress ?? false,
    featured: raw.featured ?? false,
    seoDescription:
      (useEn && raw.seo_description_en) || (raw.seo_description ?? null),
    publishedAt: raw.publishedAt,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapMedia(raw: any): StrapiMedia {
  return {
    id: raw.id,
    url: raw.url,
    alternativeText: raw.alternativeText ?? null,
    width: raw.width,
    height: raw.height,
    formats: raw.formats ?? null,
  };
}

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

export async function getPieces(
  filters?: {
    category?: "antiquite" | "creation";
    subcategorySlug?: string;
  },
  locale: string = "fr"
): Promise<Piece[]> {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await fetchStrapi<{ data: any[] }>("/pieces", params);
  return (data?.data ?? []).map((raw) => mapPiece(raw, locale));
}

export async function getPieceBySlug(
  slug: string,
  locale: string = "fr"
): Promise<Piece | null> {
  if (USE_MOCK) {
    return mockPieces.find((p) => p.slug === slug) ?? null;
  }

  // Since Strapi slugs may be null, fetch all and find by generated slug
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await fetchStrapi<{ data: any[] }>("/pieces", {
    "populate": "*",
  });
  const pieces = (data?.data ?? []).map((raw) => mapPiece(raw, locale));
  return pieces.find((p) => p.slug === slug) ?? null;
}

export async function getPiecesByCategory(
  category: "antiquite" | "creation",
  subcategorySlug?: string,
  locale: string = "fr"
): Promise<Piece[]> {
  return getPieces({ category, subcategorySlug }, locale);
}

export async function getFeaturedPieces(
  limit = 8,
  locale: string = "fr"
): Promise<Piece[]> {
  if (USE_MOCK) {
    return mockPieces
      .filter((p) => p.featured)
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
      .slice(0, limit);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await fetchStrapi<{ data: any[] }>("/pieces", {
    "filters[featured][$eq]": "true",
    "populate": "*",
    "sort": "publishedAt:desc",
    "pagination[limit]": String(limit),
  });
  return (data?.data ?? []).map((raw) => mapPiece(raw, locale));
}

// ---------------------------------------------------------------------------
// Subcategories
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Single types
// ---------------------------------------------------------------------------

export async function getHomepage(
  locale: string = "fr"
): Promise<Homepage> {
  if (USE_MOCK) return mockHomepage;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await fetchStrapi<{ data: any }>("/homepage", {
    populate: "*",
  });
  const raw = data?.data;
  if (!raw) return mockHomepage;

  const useEn = locale === "en";
  return {
    heroImage: raw.hero_image ? mapMedia(raw.hero_image) : null,
    heroTitle: (useEn && raw.hero_title_en) || (raw.hero_title ?? "Daguet Antique"),
    heroSubtitle: (useEn && raw.hero_subtitle_en) || (raw.hero_subtitle ?? ""),
    introText: blocksToHtml((useEn && raw.intro_text_en) || raw.intro_text),
    introImage: raw.intro_image ? mapMedia(raw.intro_image) : null,
  };
}

export async function getAboutPage(
  locale: string = "fr"
): Promise<AboutPage> {
  if (USE_MOCK) return mockAboutPage;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await fetchStrapi<{ data: any }>("/about-page", {
    populate: "*",
  });
  const raw = data?.data;
  if (!raw) return mockAboutPage;

  const useEn = locale === "en";
  return {
    title: (useEn && raw.title_en) || (raw.title ?? "\u00C0 propos"),
    portraitImage: raw.portrait_image ? mapMedia(raw.portrait_image) : null,
    biography: blocksToHtml((useEn && raw.biography_en) || raw.biography),
    atelierImages: (raw.atelier_images ?? []).map(mapMedia),
    atelierDescription: blocksToHtml(
      (useEn && raw.atelier_description_en) || raw.atelier_description
    ),
  };
}

export async function getContactPage(): Promise<ContactPage> {
  if (USE_MOCK) return mockContactPage;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await fetchStrapi<{ data: any }>("/contact-page", {
    populate: "*",
  });
  const raw = data?.data;
  if (!raw) return mockContactPage;

  return {
    address: raw.address ?? "",
    phone: raw.phone ?? "",
    email: raw.email ?? "",
    googleMapsEmbed: raw.google_maps_embed ?? "",
    socialInstagram: raw.social_instagram || null,
    socialFacebook: raw.social_facebook || null,
  };
}

// ---------------------------------------------------------------------------
// Articles
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapArticle(raw: any, locale: string = "fr"): Article {
  const useEn = locale === "en";
  return {
    id: raw.id,
    title: (useEn && raw.title_en) || raw.title,
    slug: raw.slug || slugify(raw.title),
    excerpt: (useEn && raw.excerpt_en) || (raw.excerpt ?? ""),
    body: blocksToHtml((useEn && raw.body_en) || raw.body),
    coverImage: raw.cover_image ? mapMedia(raw.cover_image) : null,
    tags: raw.tags ?? [],
    category: raw.category ?? "expertise",
    language: raw.language ?? "fr",
    relatedPieces: (raw.related_pieces ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (p: any) => mapPiece(p, locale)
    ),
    seoKeywords: raw.seo_keywords ?? null,
    seoDescription:
      (useEn && raw.seo_description_en) || (raw.seo_description ?? null),
    publishedAt: raw.publishedAt,
  };
}

export async function getArticles(
  filters?: { category?: string },
  locale: string = "fr"
): Promise<Article[]> {
  if (USE_MOCK) {
    let articles = [...mockArticles];
    if (filters?.category) {
      articles = articles.filter((a) => a.category === filters.category);
    }
    return articles.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  const params: Record<string, string> = {
    "populate[cover_image]": "*",
    "populate[related_pieces][populate]": "photos",
    "sort": "publishedAt:desc",
  };
  if (filters?.category) {
    params["filters[category][$eq]"] = filters.category;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await fetchStrapi<{ data: any[] }>("/articles", params);
  return (data?.data ?? []).map((raw) => mapArticle(raw, locale));
}

export async function getArticleBySlug(
  slug: string,
  locale: string = "fr"
): Promise<Article | null> {
  if (USE_MOCK) {
    return mockArticles.find((a) => a.slug === slug) ?? null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await fetchStrapi<{ data: any[] }>("/articles", {
    "populate[cover_image]": "*",
    "populate[related_pieces][populate]": "photos",
  });
  const articles = (data?.data ?? []).map((raw) => mapArticle(raw, locale));
  return articles.find((a) => a.slug === slug) ?? null;
}

export async function getArticlesByPiece(
  pieceId: number,
  locale: string = "fr"
): Promise<Article[]> {
  if (USE_MOCK) {
    return mockArticles.filter((a) =>
      a.relatedPieces.some((p) => p.id === pieceId)
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await fetchStrapi<{ data: any[] }>("/articles", {
    "filters[related_pieces][id][$eq]": String(pieceId),
    "populate[cover_image]": "*",
    "populate[related_pieces][populate]": "photos",
  });
  return (data?.data ?? []).map((raw) => mapArticle(raw, locale));
}

// ---------------------------------------------------------------------------
// Single types
// ---------------------------------------------------------------------------

export async function getSiteSettings(
  locale: string = "fr"
): Promise<SiteSettings> {
  if (USE_MOCK) return mockSiteSettings;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await fetchStrapi<{ data: any }>("/site-setting", {
    populate: "*",
  });
  const raw = data?.data;
  if (!raw) return mockSiteSettings;

  const useEn = locale === "en";
  return {
    siteName: raw.site_name ?? "Daguet Antique",
    logo: raw.logo ? mapMedia(raw.logo) : null,
    footerText: (useEn && raw.footer_text_en) || (raw.footer_text ?? ""),
  };
}
