import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPiecesByCategory, getSubcategories } from "@/lib/strapi";
import { CatalogueClient } from "@/components/pieces/CatalogueClient";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { getAlternates, getPath } from "@/lib/routes";
import { hasLocale, getDictionary, type Locale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "Antiques" : "Antiquit\u00E9s",
    description: isEn
      ? "Discover our collection of antiques: 20th century furniture, chairs, tables, storage, mirrors and decorative objects."
      : "D\u00E9couvrez notre collection d\u2019antiquit\u00E9s : mobilier du XXe si\u00E8cle, si\u00E8ges, tables, rangements, miroirs et objets d\u00E9coratifs.",
    alternates: getAlternates("antiquites"),
  };
}

export default async function AntiquitesPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const loc = locale as Locale;
  const dict = await getDictionary(loc);
  const [pieces, subcategories] = await Promise.all([
    getPiecesByCategory("antiquite"),
    getSubcategories("antiquite"),
  ]);

  return (
    <div className="pt-28 pb-20 md:pb-28">
      <BreadcrumbJsonLd
        items={[
          { name: loc === "en" ? "Home" : "Accueil", path: loc === "en" ? "/en" : "/" },
          { name: dict.catalogue.antiquitesTitle, path: getPath(loc, "antiquites") },
        ]}
      />
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <h1 className="font-serif text-4xl md:text-5xl tracking-wide text-center">
            {dict.catalogue.antiquitesTitle}
          </h1>
          <p className="mt-4 text-center text-text-muted text-sm tracking-wider uppercase">
            {dict.catalogue.antiquitesSubtitle}
          </p>
        </ScrollReveal>

        <div className="mt-12 md:mt-16">
          <CatalogueClient
            pieces={pieces}
            subcategories={subcategories}
            locale={loc}
            allLabel={dict.common.all}
          />
        </div>
      </div>
    </div>
  );
}
