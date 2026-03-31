"use client";

import { useState } from "react";
import type { Article } from "@/lib/types";
import { ArticleFilters } from "./ArticleFilters";
import { ArticleGrid } from "./ArticleGrid";
import type { Locale } from "@/lib/i18n";

interface ArticleCatalogueClientProps {
  articles: Article[];
  locale?: Locale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categoryLabels?: any;
}

export function ArticleCatalogueClient({
  articles,
  locale = "fr",
  categoryLabels,
}: ArticleCatalogueClientProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredArticles = activeFilter
    ? articles.filter((a) => a.category === activeFilter)
    : articles;

  return (
    <div>
      <div className="mb-10">
        <ArticleFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          labels={categoryLabels}
        />
      </div>
      <ArticleGrid articles={filteredArticles} locale={locale} />
    </div>
  );
}
