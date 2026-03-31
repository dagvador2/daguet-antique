import type { Metadata } from "next";
import Image from "next/image";
import { getAboutPage } from "@/lib/strapi";
import { getStrapiMediaUrl } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "\u00C0 propos",
  description:
    "D\u00E9couvrez le parcours de Christophe Daguet, \u00E9b\u00E9niste, designer et antiquaire install\u00E9 \u00E0 Paris.",
};

export default async function AboutPage() {
  const about = await getAboutPage();

  return (
    <div className="pt-28 pb-20 md:pb-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <h1 className="font-serif text-4xl md:text-5xl tracking-wide text-center">
            {about.title}
          </h1>
        </ScrollReveal>

        {/* Portrait + Biography */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-12 md:gap-16 items-start">
          <ScrollReveal>
            {about.portraitImage && (
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={getStrapiMediaUrl(about.portraitImage.url)}
                  alt={
                    about.portraitImage.alternativeText ||
                    "Portrait de Christophe Daguet"
                  }
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            )}
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div
              className="prose prose-lg max-w-none text-text-secondary leading-relaxed [&_p]:mb-6"
              dangerouslySetInnerHTML={{ __html: about.biography }}
            />
          </ScrollReveal>
        </div>

        {/* Atelier section */}
        {about.atelierImages.length > 0 && (
          <div className="mt-20 md:mt-28">
            <ScrollReveal>
              <h2 className="font-serif text-3xl md:text-4xl tracking-wide text-center">
                L&apos;atelier
              </h2>
            </ScrollReveal>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              {about.atelierImages.map((img, i) => (
                <ScrollReveal key={img.id} delay={i * 0.1}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={getStrapiMediaUrl(img.url)}
                      alt={img.alternativeText || "Atelier"}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {about.atelierDescription && (
              <ScrollReveal className="mt-8 max-w-3xl mx-auto">
                <div
                  className="text-text-secondary leading-relaxed text-center"
                  dangerouslySetInnerHTML={{
                    __html: about.atelierDescription,
                  }}
                />
              </ScrollReveal>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
