"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

// Map FR public paths to EN public paths and vice versa
const frToEn: Record<string, string> = {
  "/antiquites": "/antiques",
  "/travaux": "/creations",
  "/a-propos": "/about",
};

const enToFr: Record<string, string> = {
  "/antiques": "/antiquites",
  "/creations": "/travaux",
  "/about": "/a-propos",
};

function switchPath(pathname: string, fromLocale: Locale): string {
  if (fromLocale === "fr") {
    // Currently FR → switch to EN: add /en prefix and map paths
    let path = pathname;
    for (const [fr, en] of Object.entries(frToEn)) {
      if (path === fr || path.startsWith(`${fr}/`)) {
        path = path.replace(fr, en);
        break;
      }
    }
    return `/en${path}`;
  } else {
    // Currently EN → switch to FR: remove /en prefix and map paths
    let path = pathname.replace(/^\/en/, "") || "/";
    for (const [en, fr] of Object.entries(enToFr)) {
      if (path === en || path.startsWith(`${en}/`)) {
        path = path.replace(en, fr);
        break;
      }
    }
    return path;
  }
}

interface LanguageSwitcherProps {
  locale: Locale;
}

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSwitch = (newLocale: Locale) => {
    if (newLocale === locale) return;

    // Set cookie
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=${60 * 60 * 24 * 365}`;

    // Navigate to the alternate path
    const newPath = switchPath(pathname, locale);
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-1 text-sm font-sans tracking-wider">
      <button
        onClick={() => handleSwitch("fr")}
        className={cn(
          "px-1.5 py-0.5 transition-colors",
          locale === "fr"
            ? "text-text-primary font-medium"
            : "text-text-muted hover:text-text-primary"
        )}
      >
        FR
      </button>
      <span className="text-text-muted">/</span>
      <button
        onClick={() => handleSwitch("en")}
        className={cn(
          "px-1.5 py-0.5 transition-colors",
          locale === "en"
            ? "text-text-primary font-medium"
            : "text-text-muted hover:text-text-primary"
        )}
      >
        EN
      </button>
    </div>
  );
}
