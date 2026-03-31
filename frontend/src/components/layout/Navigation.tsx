"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/antiquites", label: "Antiquités" },
  { href: "/travaux", label: "Travaux" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex items-center gap-8">
      {navLinks.map((link) => {
        const isActive =
          pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
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
