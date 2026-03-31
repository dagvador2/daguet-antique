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
    title: isEn ? "Creations" : "Travaux & Cr\u00E9ations",
    description: isEn
      ? "Discover our custom creations: consoles, tables, mirrors and unique pieces handcrafted in our workshop."
      : "D\u00E9couvrez nos cr\u00E9ations sur mesure : consoles, tables, miroirs et pi\u00E8ces uniques r\u00E9alis\u00E9es dans notre atelier.",
    alternates: getAlternates("travaux"),
  };
}

export default async function TravauxPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const loc = locale as Locale;
  const dict = await getDictionary(loc);
  const [pieces, subcategories] = await Promise.all([
    getPiecesByCategory("creation"),
    getSubcategories("creation"),
  ]);

  return (
    <div className="pt-28 pb-20 md:pb-28">
      <BreadcrumbJsonLd
        items={[
          { name: loc === "en" ? "Home" : "Accueil", path: loc === "en" ? "/en" : "/" },
          { name: dict.catalogue.travauxTitle, path: getPath(loc, "travaux") },
        ]}
      />
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <h1 className="font-serif text-4xl md:text-5xl tracking-wide text-center">
            {dict.catalogue.travauxTitle}
          </h1>
          <p className="mt-4 text-center text-text-muted text-sm tracking-wider uppercase">
            {dict.catalogue.travauxSubtitle}
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
