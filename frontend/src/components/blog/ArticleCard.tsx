import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { getStrapiMediaUrl } from "@/lib/utils";
import { getPath } from "@/lib/routes";
import type { Locale } from "@/lib/i18n";

const categoryLabels: Record<string, Record<Locale, string>> = {
  expertise: { fr: "Expertise", en: "Expertise" },
  "savoir-faire": { fr: "Savoir-faire", en: "Craftsmanship" },
  coulisses: { fr: "Coulisses", en: "Behind the scenes" },
  marche: { fr: "Marché", en: "Market" },
};

interface ArticleCardProps {
  article: Article;
  locale?: Locale;
}

export function ArticleCard({ article, locale = "fr" }: ArticleCardProps) {
  const href = getPath(locale, "journal", article.slug);

  const date = new Date(article.publishedAt).toLocaleDateString(
    locale === "en" ? "en-US" : "fr-FR",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <Link href={href} className="group block">
      {/* Cover image 16:9 */}
      <div className="relative aspect-video overflow-hidden bg-bg-secondary">
        {article.coverImage && (
          <Image
            src={getStrapiMediaUrl(article.coverImage.url)}
            alt={article.coverImage.alternativeText || article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}
        <div className="absolute top-3 left-3 z-10 bg-accent px-3 py-1">
          <span className="text-white text-xs tracking-wider uppercase font-sans">
            {categoryLabels[article.category]?.[locale] ?? article.category}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 space-y-2">
        <p className="text-xs text-text-muted uppercase tracking-wider">
          {date}
        </p>
        <h3 className="font-serif text-xl text-text-primary leading-tight">
          {article.title}
        </h3>
        <p className="text-sm text-text-secondary line-clamp-2">
          {article.excerpt}
        </p>
      </div>
    </Link>
  );
}
