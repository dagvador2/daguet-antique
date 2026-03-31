import type { Piece } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

interface PieceInfoProps {
  piece: Piece;
  locale?: Locale;
}

export function PieceInfo({ piece, locale = "fr" }: PieceInfoProps) {
  const isEn = locale === "en";
  const mailtoSubject = encodeURIComponent(
    isEn ? `Inquiry: ${piece.title}` : `Renseignement : ${piece.title}`
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <h1 className="font-serif text-3xl md:text-4xl tracking-wide leading-tight">
        {piece.title}
      </h1>

      {/* Price and status */}
      <div className="flex items-center gap-4">
        <span className="text-lg text-text-secondary">
          {formatPrice(piece.price, piece.showPrice, locale)}
        </span>
        {piece.status === "sold" && (
          <span className="inline-block px-3 py-1 bg-sold-badge/20 text-sold-badge text-xs tracking-wider uppercase font-sans">
            {isEn ? "Sold" : "Vendu"}
          </span>
        )}
        {piece.workInProgress && (
          <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs tracking-wider uppercase font-sans">
            {isEn ? "In progress" : "En cours"}
          </span>
        )}
      </div>

      {/* Description */}
      {piece.description && (
        <div
          className="text-text-secondary leading-relaxed [&_p]:mb-4"
          dangerouslySetInnerHTML={{ __html: piece.description }}
        />
      )}

      {/* Details */}
      <div className="border-t border-border-custom pt-6 space-y-3">
        {piece.period && (
          <DetailRow
            label={isEn ? "Period" : "\u00C9poque"}
            value={piece.period}
          />
        )}
        {piece.materials && (
          <DetailRow
            label={isEn ? "Materials" : "Mat\u00E9riaux"}
            value={piece.materials}
          />
        )}
        {piece.dimensions && (
          <DetailRow label="Dimensions" value={piece.dimensions} />
        )}
        {piece.provenance && (
          <DetailRow label="Provenance" value={piece.provenance} />
        )}
      </div>

      {/* Contact button */}
      {piece.status !== "sold" && (
        <a
          href={`mailto:contact@antiquedaguet.fr?subject=${mailtoSubject}`}
          className="inline-block w-full text-center py-3 bg-accent text-white text-sm tracking-widest uppercase hover:bg-accent-hover transition-colors"
        >
          {isEn
            ? "Contact us about this piece"
            : "Contacter pour cette pi\u00E8ce"}
        </a>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 text-sm">
      <span className="text-text-muted w-28 shrink-0">{label}</span>
      <span className="text-text-secondary">{value}</span>
    </div>
  );
}
