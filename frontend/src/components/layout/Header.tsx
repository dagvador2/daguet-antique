"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Navigation } from "./Navigation";
import { MobileMenu } from "./MobileMenu";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-bg-primary/90 backdrop-blur-md shadow-sm py-4"
            : "bg-transparent py-6"
        )}
      >
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-xl md:text-2xl tracking-[0.25em] uppercase text-text-primary"
          >
            Daguet Antique
          </Link>

          <Navigation />

          {/* Mobile hamburger */}
          <button
            className="lg:hidden relative z-50 w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <span
              className={cn(
                "block w-6 h-[1.5px] bg-text-primary transition-all duration-300 origin-center",
                menuOpen && "rotate-45 translate-y-[4.5px]"
              )}
            />
            <span
              className={cn(
                "block w-6 h-[1.5px] bg-text-primary transition-all duration-300",
                menuOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "block w-6 h-[1.5px] bg-text-primary transition-all duration-300 origin-center",
                menuOpen && "-rotate-45 -translate-y-[4.5px]"
              )}
            />
          </button>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={closeMenu} />
    </>
  );
}
