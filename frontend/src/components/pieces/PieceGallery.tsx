"use client";

import { useState } from "react";
import Image from "next/image";
import type { StrapiMedia } from "@/lib/types";
import { getStrapiMediaUrl, cn } from "@/lib/utils";
import { Lightbox } from "@/components/ui/Lightbox";

interface PieceGalleryProps {
  photos: StrapiMedia[];
}

export function PieceGallery({ photos }: PieceGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (photos.length === 0) return null;

  const selected = photos[selectedIndex];

  return (
    <>
      <div className="space-y-4">
        {/* Main image */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="block w-full relative aspect-[4/5] overflow-hidden bg-bg-secondary cursor-zoom-in"
          aria-label="Agrandir la photo"
        >
          <Image
            src={getStrapiMediaUrl(selected.url)}
            alt={selected.alternativeText || ""}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
            priority
          />
        </button>

        {/* Thumbnails */}
        {photos.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  "relative shrink-0 w-20 h-20 overflow-hidden transition-opacity",
                  index === selectedIndex
                    ? "ring-2 ring-accent opacity-100"
                    : "opacity-60 hover:opacity-100"
                )}
              >
                <Image
                  src={getStrapiMediaUrl(photo.url)}
                  alt={photo.alternativeText || ""}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={photos}
          initialIndex={selectedIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
