import type { Article } from "@/lib/types";
import { ArticleCard } from "./ArticleCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { Locale } from "@/lib/i18n";

interface ArticleGridProps {
  articles: Article[];
  locale?: Locale;
  emptyMessage?: string;
}

export function ArticleGrid({
  articles,
  locale = "fr",
  emptyMessage,
}: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-text-muted text-lg">
          {emptyMessage ||
            (locale === "en"
              ? "No articles at the moment."
              : "Aucun article pour le moment.")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {articles.map((article, index) => (
        <ScrollReveal key={article.id} delay={index * 0.08}>
          <ArticleCard article={article} locale={locale} />
        </ScrollReveal>
      ))}
    </div>
  );
}
