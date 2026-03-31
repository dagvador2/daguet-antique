import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticles } from "@/lib/strapi";
import { getStrapiMediaUrl, stripHtml } from "@/lib/utils";
import { PieceCard } from "@/components/pieces/PieceCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { getAlternates, getPath } from "@/lib/routes";
import { hasLocale, getDictionary, type Locale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: locale === "en" ? "Article not found" : "Article introuvable" };
  }

  return {
    title: article.title,
    description:
      article.seoDescription ||
      article.excerpt ||
      stripHtml(article.body).slice(0, 160),
    openGraph: {
      images: article.coverImage
        ? [{ url: getStrapiMediaUrl(article.coverImage.url) }]
        : [],
    },
    alternates: getAlternates("journal", slug),
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();

  const loc = locale as Locale;
  const isEn = locale === "en";
  const dict = await getDictionary(loc);
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const date = new Date(article.publishedAt).toLocaleDateString(
    isEn ? "en-US" : "fr-FR",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const categoryLabel =
    dict.journal.categories[article.category as keyof typeof dict.journal.categories] ||
    article.category;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    image: article.coverImage ? getStrapiMediaUrl(article.coverImage.url) : undefined,
    author: { "@type": "Person", name: "Christophe Daguet" },
    publisher: { "@type": "Organization", name: "Daguet Antique" },
  };

  return (
    <div className="pt-28 pb-20 md:pb-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: isEn ? "Home" : "Accueil", path: isEn ? "/en" : "/" },
          { name: dict.journal.title, path: getPath(loc, "journal") },
          { name: article.title, path: getPath(loc, "journal", article.slug) },
        ]}
      />

      {article.coverImage && (
        <div className="relative w-full aspect-[21/9] max-h-[480px] overflow-hidden">
          <Image
            src={getStrapiMediaUrl(article.coverImage.url)}
            alt={article.coverImage.alternativeText || article.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-6">
        <ScrollReveal>
          <div className="mt-10 md:mt-14 space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <span className="bg-accent text-white px-3 py-1 text-xs tracking-wider uppercase">
                {categoryLabel}
              </span>
              <span className="text-text-muted">{date}</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-wide leading-tight">
              {article.title}
            </h1>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div
            className="mt-10 prose prose-lg max-w-none
              prose-headings:font-serif prose-headings:tracking-wide
              prose-p:text-text-secondary prose-p:leading-relaxed
              prose-a:text-accent prose-a:underline
              prose-strong:text-text-primary"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />
        </ScrollReveal>

        {article.tags.length > 0 && (
          <div className="mt-10 pt-8 border-t border-border-custom">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-text-muted bg-bg-secondary px-3 py-1 tracking-wider uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {article.relatedPieces.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 mt-20 md:mt-28">
          <ScrollReveal>
            <h2 className="font-serif text-2xl md:text-3xl tracking-wide text-center">
              {isEn ? "Featured pieces" : "Pi\u00E8ces mentionn\u00E9es"}
            </h2>
          </ScrollReveal>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {article.relatedPieces.map((piece, i) => (
              <ScrollReveal key={piece.id} delay={i * 0.1}>
                <PieceCard piece={piece} locale={loc} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
