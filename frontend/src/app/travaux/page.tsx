import type { Metadata } from "next";
import { getPiecesByCategory, getSubcategories } from "@/lib/strapi";
import { CatalogueClient } from "@/components/pieces/CatalogueClient";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Travaux & Cr\u00E9ations",
  description:
    "D\u00E9couvrez nos cr\u00E9ations sur mesure : consoles, tables, miroirs et pi\u00E8ces uniques r\u00E9alis\u00E9es dans notre atelier.",
};

export default async function TravauxPage() {
  const [pieces, subcategories] = await Promise.all([
    getPiecesByCategory("creation"),
    getSubcategories("creation"),
  ]);

  return (
    <div className="pt-28 pb-20 md:pb-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <h1 className="font-serif text-4xl md:text-5xl tracking-wide text-center">
            Travaux &amp; Cr&eacute;ations
          </h1>
          <p className="mt-4 text-center text-text-muted text-sm tracking-wider uppercase">
            Pi&egrave;ces uniques, fa&ccedil;onn&eacute;es &agrave; la main dans notre atelier
          </p>
        </ScrollReveal>

        <div className="mt-12 md:mt-16">
          <CatalogueClient pieces={pieces} subcategories={subcategories} />
        </div>
      </div>
    </div>
  );
}
