"use client";

import { cn } from "@/lib/utils";

interface CategoryOption {
  value: string | null;
  label: string;
}

interface ArticleFiltersProps {
  activeFilter: string | null;
  onFilterChange: (category: string | null) => void;
  labels?: {
    all?: string;
    expertise?: string;
    "savoir-faire"?: string;
    coulisses?: string;
    marche?: string;
  };
}

export function ArticleFilters({
  activeFilter,
  onFilterChange,
  labels,
}: ArticleFiltersProps) {
  const categories: CategoryOption[] = [
    { value: null, label: labels?.all ?? "Tout" },
    { value: "expertise", label: labels?.expertise ?? "Expertise" },
    { value: "savoir-faire", label: labels?.["savoir-faire"] ?? "Savoir-faire" },
    { value: "coulisses", label: labels?.coulisses ?? "Coulisses" },
    { value: "marche", label: labels?.marche ?? "Marché" },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat.label}
          onClick={() => onFilterChange(cat.value)}
          className={cn(
            "shrink-0 px-5 py-2 text-sm tracking-wider uppercase transition-colors",
            activeFilter === cat.value
              ? "bg-accent text-white"
              : "bg-bg-secondary text-text-secondary hover:text-text-primary"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
