import Image from "next/image";
import Link from "next/link";
import { getHomepage } from "@/lib/strapi";
import { getStrapiMediaUrl } from "@/lib/utils";
import { getPath } from "@/lib/routes";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export async function IntroBlock({ locale = "fr" }: { locale?: string }) {
  const homepage = await getHomepage(locale);
  const isEn = locale === "en";

  return (
    <section className="py-20 md:py-28 bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Text */}
          <ScrollReveal>
            <div className="space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl tracking-wide">
                {isEn ? "The workshop" : "L\u2019atelier"}
              </h2>
              <p className="text-text-secondary leading-relaxed text-base md:text-lg">
                {homepage.introText}
              </p>
              <Link
                href={getPath(locale as "fr" | "en", "about")}
                className="inline-block font-sans text-sm tracking-widest uppercase text-text-secondary hover:text-text-primary transition-colors border-b border-text-muted hover:border-text-primary pb-1"
              >
                {isEn ? "Learn more" : "En savoir plus"} &rarr;
              </Link>
            </div>
          </ScrollReveal>

          {/* Image */}
          <ScrollReveal delay={0.2}>
            {homepage.introImage && (
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={getStrapiMediaUrl(homepage.introImage.url)}
                  alt={homepage.introImage.alternativeText || "L'atelier"}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
