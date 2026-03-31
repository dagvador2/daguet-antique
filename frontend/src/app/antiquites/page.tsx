import type { Metadata } from "next";
import { getPiecesByCategory, getSubcategories } from "@/lib/strapi";
import { CatalogueClient } from "@/components/pieces/CatalogueClient";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Antiquit\u00E9s",
  description:
    "D\u00E9couvrez notre collection d\u2019antiquit\u00E9s : mobilier du XXe si\u00E8cle, si\u00E8ges, tables, rangements, miroirs et objets d\u00E9coratifs.",
};

export default async function AntiquitesPage() {
  const [pieces, subcategories] = await Promise.all([
    getPiecesByCategory("antiquite"),
    getSubcategories("antiquite"),
  ]);

  return (
    <div className="pt-28 pb-20 md:pb-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <h1 className="font-serif text-4xl md:text-5xl tracking-wide text-center">
            Antiquit&eacute;s
          </h1>
          <p className="mt-4 text-center text-text-muted text-sm tracking-wider uppercase">
            Mobilier du XXe si&egrave;cle, chin&eacute; et restaur&eacute; avec soin
          </p>
        </ScrollReveal>

        <div className="mt-12 md:mt-16">
          <CatalogueClient pieces={pieces} subcategories={subcategories} />
        </div>
      </div>
    </div>
  );
}
