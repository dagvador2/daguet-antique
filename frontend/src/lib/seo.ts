import type { Piece } from "./types";
import { getStrapiMediaUrl, stripHtml } from "./utils";

interface DimensionValue {
  "@type": "QuantitativeValue";
  value: number;
  unitCode: string;
}

interface ParsedDimensions {
  height?: DimensionValue;
  width?: DimensionValue;
  depth?: DimensionValue;
}

export function parseDimensions(str: string | null): ParsedDimensions {
  if (!str) return {};

  const result: ParsedDimensions = {};

  // Match patterns like H.85, H85, H 85 (height)
  const heightMatch = str.match(/H\.?\s*(\d+(?:[.,]\d+)?)/i);
  if (heightMatch) {
    result.height = {
      "@type": "QuantitativeValue",
      value: parseFloat(heightMatch[1].replace(",", ".")),
      unitCode: "CMT",
    };
  }

  // Match patterns like L.120, L120, L 120 (width/length)
  const widthMatch = str.match(/L\.?\s*(\d+(?:[.,]\d+)?)/i);
  if (widthMatch) {
    result.width = {
      "@type": "QuantitativeValue",
      value: parseFloat(widthMatch[1].replace(",", ".")),
      unitCode: "CMT",
    };
  }

  // Match patterns like P.35, P35, P 35 (depth/profondeur)
  const depthMatch = str.match(/P\.?\s*(\d+(?:[.,]\d+)?)/i);
  if (depthMatch) {
    result.depth = {
      "@type": "QuantitativeValue",
      value: parseFloat(depthMatch[1].replace(",", ".")),
      unitCode: "CMT",
    };
  }

  return result;
}

export function buildProductJsonLd(piece: Piece) {
  const description =
    piece.seoDescription || stripHtml(piece.description).slice(0, 300);
  const dims = parseDimensions(piece.dimensions);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: piece.title,
    description,
    image: piece.photos.map((p) => getStrapiMediaUrl(p.url)),
    brand: { "@type": "Brand", name: "Daguet Antique" },
    ...(piece.materials && { material: piece.materials }),
    ...(piece.subcategory && { category: piece.subcategory.name }),
    countryOfOrigin: { "@type": "Country", name: "France" },
    ...(dims.height && { height: dims.height }),
    ...(dims.width && { width: dims.width }),
    ...(dims.depth && { depth: dims.depth }),
    ...(piece.showPrice &&
      piece.price && {
        offers: {
          "@type": "Offer",
          price: piece.price,
          priceCurrency: "EUR",
          availability:
            piece.status === "available"
              ? "https://schema.org/InStock"
              : "https://schema.org/SoldOut",
        },
      }),
  };
}
