import type { Piece } from "@/lib/types";
import { PieceCard } from "./PieceCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { Locale } from "@/lib/i18n";

interface PieceGridProps {
  pieces: Piece[];
  locale?: Locale;
  emptyMessage?: string;
}

export function PieceGrid({
  pieces,
  locale = "fr",
  emptyMessage,
}: PieceGridProps) {
  if (pieces.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-text-muted text-lg">
          {emptyMessage ||
            (locale === "en"
              ? "No pieces at the moment."
              : "Aucune pi\u00E8ce pour le moment.")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {pieces.map((piece, index) => (
        <ScrollReveal key={piece.id} delay={index * 0.08}>
          <PieceCard piece={piece} locale={locale} />
        </ScrollReveal>
      ))}
    </div>
  );
}
