import Image from "next/image";
import Link from "next/link";
import type { Piece } from "@/lib/types";
import { formatPrice, getStrapiMediaUrl } from "@/lib/utils";
import { SoldBadge } from "./SoldBadge";

interface PieceCardProps {
  piece: Piece;
}

export function PieceCard({ piece }: PieceCardProps) {
  const href =
    piece.category === "antiquite"
      ? `/antiquites/${piece.slug}`
      : `/travaux/${piece.slug}`;

  const photo = piece.photos[0];

  return (
    <Link href={href} className="group block">
      {/* Image container with 4:5 aspect ratio */}
      <div className="relative aspect-[4/5] overflow-hidden bg-bg-secondary">
        {photo && (
          <Image
            src={getStrapiMediaUrl(photo.url)}
            alt={photo.alternativeText || piece.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}
        {piece.status === "sold" && <SoldBadge />}
        {piece.workInProgress && (
          <div className="absolute top-3 left-3 z-10 bg-accent px-3 py-1">
            <span className="text-white text-xs tracking-wider uppercase font-sans">
              En cours
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1">
        <h3 className="font-serif text-lg text-text-primary leading-tight">
          {piece.title}
        </h3>
        {piece.period && (
          <p className="text-sm text-text-muted">{piece.period}</p>
        )}
        <p className="text-sm text-text-secondary">
          {formatPrice(piece.price, piece.showPrice)}
        </p>
      </div>
    </Link>
  );
}
