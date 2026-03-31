import type { Locale } from "./i18n";

const pathMap: Record<string, Record<Locale, string>> = {
  home: { fr: "", en: "" },
  antiquites: { fr: "/antiquites", en: "/antiques" },
  travaux: { fr: "/travaux", en: "/creations" },
  journal: { fr: "/journal", en: "/journal" },
  about: { fr: "/a-propos", en: "/about" },
  contact: { fr: "/contact", en: "/contact" },
  legal: { fr: "/mentions-legales", en: "/mentions-legales" },
};

export function getPath(
  locale: Locale,
  route: string,
  slug?: string
): string {
  const prefix = locale === "en" ? "/en" : "";
  const base = pathMap[route]?.[locale] ?? "";
  return `${prefix}${base}${slug ? `/${slug}` : ""}`;
}

export function getHomePath(locale: Locale): string {
  return locale === "en" ? "/en" : "/";
}

// Build alternate URLs for hreflang
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://antiquedaguet.fr";

export function getAlternates(route: string, slug?: string) {
  return {
    languages: {
      fr: `${SITE_URL}${getPath("fr", route, slug)}`,
      en: `${SITE_URL}${getPath("en", route, slug)}`,
    },
  };
}
