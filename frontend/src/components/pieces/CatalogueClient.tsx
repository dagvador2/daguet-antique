"use client";

import { useState } from "react";
import type { Piece, Subcategory } from "@/lib/types";
import { PieceFilters } from "./PieceFilters";
import { PieceGrid } from "./PieceGrid";
import type { Locale } from "@/lib/i18n";

interface CatalogueClientProps {
  pieces: Piece[];
  subcategories: Subcategory[];
  locale?: Locale;
  allLabel?: string;
}

export function CatalogueClient({
  pieces,
  subcategories,
  locale = "fr",
  allLabel,
}: CatalogueClientProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredPieces = activeFilter
    ? pieces.filter((p) => p.subcategory?.slug === activeFilter)
    : pieces;

  return (
    <div>
      <div className="mb-10">
        <PieceFilters
          subcategories={subcategories}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          allLabel={allLabel}
        />
      </div>
      <PieceGrid pieces={filteredPieces} locale={locale} />
    </div>
  );
}
