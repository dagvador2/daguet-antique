import Link from "next/link";
import { getFeaturedPieces } from "@/lib/strapi";
import { PieceCard } from "@/components/pieces/PieceCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export async function LatestPieces() {
  const pieces = await getFeaturedPieces(8);

  if (pieces.length === 0) return null;

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <h2 className="font-serif text-3xl md:text-4xl text-center tracking-wide">
            Dernières pièces
          </h2>
          <p className="mt-3 text-center text-text-muted text-sm tracking-wider uppercase">
            Sélection de nos pièces récentes
          </p>
        </ScrollReveal>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {pieces.map((piece, index) => (
            <ScrollReveal key={piece.id} delay={index * 0.1}>
              <PieceCard piece={piece} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-12 text-center">
          <Link
            href="/antiquites"
            className="inline-block font-sans text-sm tracking-widest uppercase text-text-secondary hover:text-text-primary transition-colors border-b border-text-muted hover:border-text-primary pb-1"
          >
            Voir toutes les pièces &rarr;
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
