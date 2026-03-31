import type { Metadata } from "next";
import { getContactPage } from "@/lib/strapi";
import { ContactForm } from "@/components/contact/ContactForm";
import { MapEmbed } from "@/components/contact/MapEmbed";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getAlternates } from "@/lib/routes";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: "Contact",
    description: isEn
      ? "Contact Christophe Daguet for any inquiry, custom order or information about a piece."
      : "Contactez Christophe Daguet pour toute demande de renseignement, commande sur mesure ou information sur une pi\u00E8ce.",
    alternates: getAlternates("contact"),
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  const isEn = locale === "en";
  const contact = await getContactPage();

  return (
    <div className="pt-28 pb-20 md:pb-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <h1 className="font-serif text-4xl md:text-5xl tracking-wide text-center">
            Contact
          </h1>
          <p className="mt-4 text-center text-text-muted text-sm tracking-wider uppercase">
            {isEn ? "Feel free to get in touch" : "N\u2019h\u00E9sitez pas \u00E0 nous contacter"}
          </p>
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <ScrollReveal>
            <div className="space-y-8">
              <div className="space-y-4">
                <div>
                  <h3 className="font-serif text-lg text-text-primary">
                    {isEn ? "Address" : "Adresse"}
                  </h3>
                  <p className="mt-1 text-text-secondary">{contact.address}</p>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-text-primary">
                    {isEn ? "Phone" : "T\u00E9l\u00E9phone"}
                  </h3>
                  <p className="mt-1">
                    <a
                      href={`tel:${contact.phone.replace(/\s/g, "")}`}
                      className="text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {contact.phone}
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-text-primary">Email</h3>
                  <p className="mt-1">
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {contact.email}
                    </a>
                  </p>
                </div>
              </div>

              <MapEmbed embedUrl={contact.googleMapsEmbed} />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <ContactForm />
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
