"use client";

import { useState } from "react";
import type { Piece, Subcategory } from "@/lib/types";
import { PieceFilters } from "./PieceFilters";
import { PieceGrid } from "./PieceGrid";

interface CatalogueClientProps {
  pieces: Piece[];
  subcategories: Subcategory[];
}

export function CatalogueClient({
  pieces,
  subcategories,
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
        />
      </div>
      <PieceGrid pieces={filteredPieces} />
    </div>
  );
}
