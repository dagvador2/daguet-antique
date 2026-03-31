import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const instagramImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
    alt: "Fauteuil vintage",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400&h=400&fit=crop",
    alt: "Table basse mid-century",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1618220048045-10a6dbdf83e0?w=400&h=400&fit=crop",
    alt: "Miroir vintage",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=400&fit=crop",
    alt: "Meuble restaur\u00E9",
  },
];

export function InstagramFeed() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <h2 className="font-serif text-3xl md:text-4xl tracking-wide text-center">
            Suivez-nous
          </h2>
          <p className="mt-3 text-center text-text-muted text-sm tracking-wider">
            <a
              href="https://instagram.com/daguet_antique"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-primary transition-colors"
            >
              @daguet_antique
            </a>
          </p>
        </ScrollReveal>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {instagramImages.map((img, i) => (
            <ScrollReveal key={img.id} delay={i * 0.08}>
              <a
                href="https://instagram.com/daguet_antique"
                target="_blank"
                rel="noopener noreferrer"
                className="block relative aspect-square overflow-hidden group"
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
