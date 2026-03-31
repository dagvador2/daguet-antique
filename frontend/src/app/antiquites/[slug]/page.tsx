import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPieceBySlug, getPieces } from "@/lib/strapi";
import { getStrapiMediaUrl } from "@/lib/utils";
import { PieceGallery } from "@/components/pieces/PieceGallery";
import { PieceInfo } from "@/components/pieces/PieceInfo";
import { PieceCard } from "@/components/pieces/PieceCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { Piece } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const pieces = await getPieces({ category: "antiquite" });
  return pieces.map((piece) => ({ slug: piece.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const piece = await getPieceBySlug(slug);

  if (!piece || piece.category !== "antiquite") {
    return { title: "Pi\u00E8ce introuvable" };
  }

  return {
    title: piece.title,
    description: piece.description
      ? piece.description.replace(/<[^>]*>/g, "").slice(0, 160)
      : `${piece.title} — Daguet Antique`,
    openGraph: {
      images: piece.photos[0]
        ? [{ url: getStrapiMediaUrl(piece.photos[0].url) }]
        : [],
    },
  };
}

export default async function AntiquePiecePage({ params }: PageProps) {
  const { slug } = await params;
  const piece = await getPieceBySlug(slug);

  if (!piece || piece.category !== "antiquite") {
    notFound();
  }

  // Get similar pieces (same subcategory, exclude current)
  const allPieces = await getPieces({ category: "antiquite" });
  const similarPieces = allPieces
    .filter(
      (p) =>
        p.id !== piece.id &&
        p.subcategory?.slug === piece.subcategory?.slug
    )
    .slice(0, 3);

  const jsonLd = buildJsonLd(piece);

  return (
    <div className="pt-28 pb-20 md:pb-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-6">
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-8 lg:gap-14">
          <ScrollReveal>
            <PieceGallery photos={piece.photos} />
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <PieceInfo piece={piece} />
          </ScrollReveal>
        </div>

        {/* Similar pieces */}
        {similarPieces.length > 0 && (
          <div className="mt-20 md:mt-28">
            <ScrollReveal>
              <h2 className="font-serif text-2xl md:text-3xl tracking-wide text-center">
                Pi&egrave;ces similaires
              </h2>
            </ScrollReveal>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {similarPieces.map((p, i) => (
                <ScrollReveal key={p.id} delay={i * 0.1}>
                  <PieceCard piece={p} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function buildJsonLd(piece: Piece) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: piece.title,
    description: piece.description?.replace(/<[^>]*>/g, "").slice(0, 300),
    image: piece.photos.map((p) => getStrapiMediaUrl(p.url)),
    brand: { "@type": "Brand", name: "Daguet Antique" },
    ...(piece.materials && { material: piece.materials }),
    ...(piece.showPrice &&
      piece.price && {
        offers: {
          "@type": "Offer",
          price: piece.price,
          priceCurrency: "EUR",
          availability:
            piece.status === "available"
              ? "https://schema.org/InStock"
              : "https://schema.org/SoldOut",
        },
      }),
  };
}
