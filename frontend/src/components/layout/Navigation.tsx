"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getPath } from "@/lib/routes";
import type { Locale } from "@/lib/i18n";

interface NavigationProps {
  locale: Locale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

export function Navigation({ locale, dict }: NavigationProps) {
  const pathname = usePathname();

  const navLinks = [
    { route: "antiquites", label: dict.nav.antiquites },
    { route: "travaux", label: dict.nav.travaux },
    { route: "journal", label: dict.nav.journal },
    { route: "about", label: dict.nav.about },
    { route: "contact", label: dict.nav.contact },
  ];

  return (
    <nav className="flex items-center gap-8">
      {navLinks.map((link) => {
        const href = getPath(locale, link.route);
        const isActive =
          pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={link.route}
            href={href}
            className={cn(
              "font-sans text-sm tracking-widest uppercase transition-colors duration-300",
              isActive
                ? "text-text-primary border-b border-text-primary"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
