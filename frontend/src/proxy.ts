import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["fr", "en"];
const defaultLocale = "fr";

// Map EN public paths to FR internal directory names
const enToFrPathMap: Record<string, string> = {
  "/antiques": "/antiquites",
  "/creations": "/travaux",
  "/about": "/a-propos",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal paths, API routes, static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname === "/favicon.ico" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if path already has locale prefix
  const pathnameHasLocale = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    // Handle EN path rewriting: /en/antiques -> /en/antiquites
    if (pathname.startsWith("/en")) {
      const enPath = pathname.slice(3) || "/"; // Remove /en prefix
      for (const [enRoute, frRoute] of Object.entries(enToFrPathMap)) {
        if (enPath === enRoute || enPath.startsWith(`${enRoute}/`)) {
          const newPath = `/en${enPath.replace(enRoute, frRoute)}`;
          return NextResponse.rewrite(new URL(newPath, request.url));
        }
      }
    }
    return NextResponse.next();
  }

  // No locale in path — determine which locale to use
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  let locale = defaultLocale;

  if (cookieLocale && locales.includes(cookieLocale)) {
    locale = cookieLocale;
  } else {
    // Check Accept-Language for first-time visitors
    const acceptLang = request.headers.get("accept-language") || "";
    // Only redirect to EN if user clearly prefers EN and NOT FR
    const prefersFr = acceptLang.match(/fr/i);
    const prefersEn = acceptLang.match(/en/i);
    if (prefersEn && !prefersFr) {
      locale = "en";
    }
  }

  if (locale === "en") {
    // Redirect to /en prefix so it shows in the URL
    const response = NextResponse.redirect(
      new URL(`/en${pathname}`, request.url)
    );
    response.cookies.set("NEXT_LOCALE", "en", { path: "/" });
    return response;
  }

  // FR: rewrite internally to /fr/... but keep the URL clean (no prefix)
  const response = NextResponse.rewrite(
    new URL(`/fr${pathname}`, request.url)
  );
  response.cookies.set("NEXT_LOCALE", "fr", { path: "/" });
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
