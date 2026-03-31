import type { Piece } from "@/lib/types";
import { PieceCard } from "./PieceCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface PieceGridProps {
  pieces: Piece[];
}

export function PieceGrid({ pieces }: PieceGridProps) {
  if (pieces.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-text-muted text-lg">
          Aucune pi&egrave;ce pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {pieces.map((piece, index) => (
        <ScrollReveal key={piece.id} delay={index * 0.08}>
          <PieceCard piece={piece} />
        </ScrollReveal>
      ))}
    </div>
  );
}
