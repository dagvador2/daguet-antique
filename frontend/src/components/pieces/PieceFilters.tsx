"use client";

import type { Subcategory } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PieceFiltersProps {
  subcategories: Subcategory[];
  activeFilter: string | null;
  onFilterChange: (slug: string | null) => void;
}

export function PieceFilters({
  subcategories,
  activeFilter,
  onFilterChange,
}: PieceFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onFilterChange(null)}
        className={cn(
          "shrink-0 px-5 py-2 text-sm tracking-wider uppercase transition-colors",
          activeFilter === null
            ? "bg-accent text-white"
            : "bg-bg-secondary text-text-secondary hover:text-text-primary"
        )}
      >
        Tout
      </button>
      {subcategories.map((sub) => (
        <button
          key={sub.id}
          onClick={() => onFilterChange(sub.slug)}
          className={cn(
            "shrink-0 px-5 py-2 text-sm tracking-wider uppercase transition-colors",
            activeFilter === sub.slug
              ? "bg-accent text-white"
              : "bg-bg-secondary text-text-secondary hover:text-text-primary"
          )}
        >
          {sub.name}
        </button>
      ))}
    </div>
  );
}
