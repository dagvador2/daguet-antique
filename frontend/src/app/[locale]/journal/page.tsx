import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticles } from "@/lib/strapi";
import { ArticleCatalogueClient } from "@/components/blog/ArticleCatalogueClient";
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
    title: "Journal",
    description: isEn
      ? "Articles, guides and behind the scenes. Expertise in antique furniture, craftsmanship and antiques market trends."
      : "Articles, guides et coulisses de l'atelier. Expertise en mobilier ancien, savoir-faire artisanal et tendances du march\u00E9 de l'antiquit\u00E9.",
    alternates: getAlternates("journal"),
  };
}

export default async function JournalPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const loc = locale as Locale;
  const dict = await getDictionary(loc);
  const articles = await getArticles(undefined, loc);

  return (
    <div className="pt-28 pb-20 md:pb-28">
      <BreadcrumbJsonLd
        items={[
          { name: loc === "en" ? "Home" : "Accueil", path: loc === "en" ? "/en" : "/" },
          { name: dict.journal.title, path: getPath(loc, "journal") },
        ]}
      />
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <h1 className="font-serif text-4xl md:text-5xl tracking-wide text-center">
            {dict.journal.title}
          </h1>
          <p className="mt-4 text-center text-text-secondary max-w-2xl mx-auto">
            {dict.journal.subtitle}
          </p>
        </ScrollReveal>

        <div className="mt-14">
          <ArticleCatalogueClient
            articles={articles}
            locale={loc}
            categoryLabels={dict.journal.categories}
          />
        </div>
      </div>
    </div>
  );
}
