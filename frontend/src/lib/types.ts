// Strapi media type
export interface StrapiMedia {
  id: number;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: { url: string; width: number; height: number };
    small?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    large?: { url: string; width: number; height: number };
  } | null;
}

// Strapi response wrappers (for future real API integration)
export interface StrapiResponse<T> {
  data: { id: number; attributes: T } | null;
  meta: Record<string, unknown>;
}

export interface StrapiCollectionResponse<T> {
  data: Array<{ id: number; attributes: T }>;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Domain types (what components receive)

export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  category: "antiquite" | "creation";
  order: number;
}

export interface Piece {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  photos: StrapiMedia[];
  category: "antiquite" | "creation";
  subcategory: Subcategory | null;
  period: string | null;
  materials: string | null;
  dimensions: string | null;
  provenance: string | null;
  price: number | null;
  showPrice: boolean;
  status: "available" | "sold";
  workInProgress: boolean;
  featured: boolean;
  publishedAt: string;
}

export interface Homepage {
  heroImage: StrapiMedia | null;
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  introImage: StrapiMedia | null;
}

export interface AboutPage {
  title: string;
  portraitImage: StrapiMedia | null;
  biography: string;
  atelierImages: StrapiMedia[];
  atelierDescription: string | null;
}

export interface ContactPage {
  address: string;
  phone: string;
  email: string;
  googleMapsEmbed: string;
  socialInstagram: string | null;
  socialFacebook: string | null;
}

export interface SiteSettings {
  siteName: string;
  logo: StrapiMedia | null;
  footerText: string;
}
