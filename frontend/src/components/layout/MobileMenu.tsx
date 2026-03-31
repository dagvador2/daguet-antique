"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getPath } from "@/lib/routes";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { Locale } from "@/lib/i18n";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

export function MobileMenu({ isOpen, onClose, locale, dict }: MobileMenuProps) {
  const pathname = usePathname();

  const navLinks = [
    { route: "antiquites", label: dict.nav.antiquites },
    { route: "travaux", label: dict.nav.travaux },
    { route: "journal", label: dict.nav.journal },
    { route: "about", label: dict.nav.about },
    { route: "contact", label: dict.nav.contact },
  ];

  // Close menu on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40 bg-bg-primary"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation"
        >
          <nav className="flex flex-col items-center justify-center h-full gap-10">
            {navLinks.map((link) => {
              const href = getPath(locale, link.route);
              const isActive =
                pathname === href ||
                pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={link.route}
                  href={href}
                  onClick={onClose}
                  className={cn(
                    "font-serif text-3xl tracking-widest uppercase transition-colors duration-300",
                    isActive
                      ? "text-text-primary"
                      : "text-text-muted hover:text-text-primary"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-4">
              <LanguageSwitcher locale={locale} />
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
