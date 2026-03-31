import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPieceBySlug, getPieces } from "@/lib/strapi";
import { getStrapiMediaUrl, stripHtml } from "@/lib/utils";
import { buildProductJsonLd } from "@/lib/seo";
import { PieceGallery } from "@/components/pieces/PieceGallery";
import { PieceInfo } from "@/components/pieces/PieceInfo";
import { PieceCard } from "@/components/pieces/PieceCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { getAlternates, getPath } from "@/lib/routes";
import { hasLocale, type Locale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const pieces = await getPieces({ category: "antiquite" });
  return pieces.map((piece) => ({ slug: piece.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const piece = await getPieceBySlug(slug, locale as "fr" | "en");

  if (!piece || piece.category !== "antiquite") {
    return { title: locale === "en" ? "Piece not found" : "Pi\u00E8ce introuvable" };
  }

  return {
    title: piece.title,
    description:
      piece.seoDescription ||
      stripHtml(piece.description).slice(0, 160) ||
      `${piece.title} \u2014 Daguet Antique`,
    openGraph: {
      images: piece.photos[0]
        ? [{ url: getStrapiMediaUrl(piece.photos[0].url) }]
        : [],
    },
    alternates: getAlternates("antiquites", slug),
  };
}

export default async function AntiquePiecePage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();

  const loc = locale as Locale;
  const isEn = locale === "en";

  const piece = await getPieceBySlug(slug, loc);
  if (!piece || piece.category !== "antiquite") notFound();

  const allPieces = await getPieces({ category: "antiquite" }, loc);
  const similarPieces = allPieces
    .filter((p) => p.id !== piece.id && p.subcategory?.slug === piece.subcategory?.slug)
    .slice(0, 3);

  const jsonLd = buildProductJsonLd(piece);

  return (
    <div className="pt-28 pb-20 md:pb-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: isEn ? "Home" : "Accueil", path: isEn ? "/en" : "/" },
          { name: isEn ? "Antiques" : "Antiquit\u00E9s", path: getPath(loc, "antiquites") },
          { name: piece.title, path: getPath(loc, "antiquites", piece.slug) },
        ]}
      />
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-8 lg:gap-14">
          <ScrollReveal>
            <PieceGallery photos={piece.photos} />
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <PieceInfo piece={piece} locale={loc} />
          </ScrollReveal>
        </div>

        {similarPieces.length > 0 && (
          <div className="mt-20 md:mt-28">
            <ScrollReveal>
              <h2 className="font-serif text-2xl md:text-3xl tracking-wide text-center">
                {isEn ? "Similar pieces" : "Pi\u00E8ces similaires"}
              </h2>
            </ScrollReveal>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {similarPieces.map((p, i) => (
                <ScrollReveal key={p.id} delay={i * 0.1}>
                  <PieceCard piece={p} locale={loc} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
