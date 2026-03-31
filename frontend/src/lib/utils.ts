export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(
  price: number | null,
  showPrice: boolean
): string {
  if (!showPrice || price === null) return "Prix sur demande";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function getStrapiMediaUrl(url: string): string {
  if (url.startsWith("http")) return url;
  const base = process.env.NEXT_PUBLIC_STRAPI_URL || "";
  return `${base}${url}`;
}

export function stripHtml(html: string | null | undefined): string {
  if (!html || typeof html !== "string") return "";
  return html.replace(/<[^>]*>/g, "").trim();
}
