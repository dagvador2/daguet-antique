import Link from "next/link";
import { getFeaturedPieces } from "@/lib/strapi";
import { PieceCard } from "@/components/pieces/PieceCard";
import { getPath } from "@/lib/routes";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { Locale } from "@/lib/i18n";

export async function LatestPieces({ locale = "fr" }: { locale?: string }) {
  const pieces = await getFeaturedPieces(8, locale);
  const isEn = locale === "en";

  if (pieces.length === 0) return null;

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <h2 className="font-serif text-3xl md:text-4xl text-center tracking-wide">
            {isEn ? "Latest pieces" : "Derni\u00E8res pi\u00E8ces"}
          </h2>
          <p className="mt-3 text-center text-text-muted text-sm tracking-wider uppercase">
            {isEn ? "A selection of our recent pieces" : "S\u00E9lection de nos pi\u00E8ces r\u00E9centes"}
          </p>
        </ScrollReveal>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {pieces.map((piece, index) => (
            <ScrollReveal key={piece.id} delay={index * 0.1}>
              <PieceCard piece={piece} locale={locale as Locale} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-12 text-center">
          <Link
            href={getPath(locale as Locale, "antiquites")}
            className="inline-block font-sans text-sm tracking-widest uppercase text-text-secondary hover:text-text-primary transition-colors border-b border-text-muted hover:border-text-primary pb-1"
          >
            {isEn ? "View all pieces" : "Voir toutes les pi\u00E8ces"} &rarr;
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
