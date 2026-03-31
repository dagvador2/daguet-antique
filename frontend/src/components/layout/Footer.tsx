import Link from "next/link";
import { getPath } from "@/lib/routes";
import type { Locale } from "@/lib/i18n";

interface FooterProps {
  locale: Locale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

export function Footer({ locale, dict }: FooterProps) {
  const year = new Date().getFullYear();

  const navLinks = [
    { route: "antiquites", label: dict.nav.antiquites },
    { route: "travaux", label: dict.nav.travaux },
    { route: "journal", label: dict.nav.journal },
    { route: "about", label: dict.nav.about },
    { route: "contact", label: dict.nav.contact },
    { route: "legal", label: dict.nav.legal },
  ];

  return (
    <footer className="bg-bg-secondary border-t border-border-custom">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Top section */}
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between md:items-start">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h2 className="font-serif text-2xl tracking-[0.2em] uppercase text-text-primary">
              Daguet Antique
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              {dict.footer.tagline}
            </p>
          </div>

          {/* Contact info */}
          <div className="text-center md:text-left text-sm text-text-secondary space-y-1">
            <p>12 Rue de l&apos;Atelier, 75011 Paris</p>
            <p>
              <a href="tel:+33123456789" className="hover:text-text-primary transition-colors">
                01 23 45 67 89
              </a>
            </p>
            <p>
              <a href="mailto:contact@antiquedaguet.fr" className="hover:text-text-primary transition-colors">
                contact@antiquedaguet.fr
              </a>
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.route}
                href={getPath(locale, link.route)}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-border-custom flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-xs text-text-muted">
            &copy; {year} Daguet Antique — {dict.footer.rights}
          </p>

          {/* Instagram */}
          <a
            href="https://instagram.com/daguet_antiques"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-text-primary transition-colors"
            aria-label="Instagram"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
