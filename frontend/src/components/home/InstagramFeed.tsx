import { ScrollReveal } from "@/components/ui/ScrollReveal";

const INSTAGRAM_URL = "https://instagram.com/daguet_antiques";

export function InstagramFeed() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <ScrollReveal>
          <h2 className="font-serif text-3xl md:text-4xl tracking-wide">
            Suivez-nous
          </h2>
          <p className="mt-4 text-text-muted text-sm tracking-wider">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-primary transition-colors"
            >
              @daguet_antiques
            </a>
          </p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block font-sans text-sm tracking-widest uppercase text-text-secondary hover:text-text-primary transition-colors border-b border-text-muted hover:border-text-primary pb-1"
          >
            Voir sur Instagram &rarr;
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
