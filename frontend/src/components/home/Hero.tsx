import Image from "next/image";
import { getHomepage } from "@/lib/strapi";
import { getStrapiMediaUrl } from "@/lib/utils";

export async function Hero() {
  const homepage = await getHomepage();

  return (
    <section className="relative w-full h-[85vh] flex items-center justify-center">
      {homepage.heroImage && (
        <Image
          src={getStrapiMediaUrl(homepage.heroImage.url)}
          alt={homepage.heroImage.alternativeText || ""}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Text content */}
      <div className="relative z-10 text-center px-6">
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-[0.15em] text-white uppercase">
          {homepage.heroTitle}
        </h1>
        {homepage.heroSubtitle && (
          <p className="mt-4 md:mt-6 font-sans text-base md:text-lg tracking-[0.3em] text-white/80 uppercase">
            {homepage.heroSubtitle}
          </p>
        )}
      </div>
    </section>
  );
}
