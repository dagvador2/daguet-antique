import type { Metadata } from "next";
import { getContactPage } from "@/lib/strapi";
import { ContactForm } from "@/components/contact/ContactForm";
import { MapEmbed } from "@/components/contact/MapEmbed";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez Christophe Daguet pour toute demande de renseignement, commande sur mesure ou information sur une pi\u00E8ce.",
};

export default async function ContactPage() {
  const contact = await getContactPage();

  return (
    <div className="pt-28 pb-20 md:pb-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <h1 className="font-serif text-4xl md:text-5xl tracking-wide text-center">
            Contact
          </h1>
          <p className="mt-4 text-center text-text-muted text-sm tracking-wider uppercase">
            N&apos;h&eacute;sitez pas &agrave; nous contacter
          </p>
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: info + map */}
          <ScrollReveal>
            <div className="space-y-8">
              <div className="space-y-4">
                <div>
                  <h3 className="font-serif text-lg text-text-primary">
                    Adresse
                  </h3>
                  <p className="mt-1 text-text-secondary">{contact.address}</p>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-text-primary">
                    T&eacute;l&eacute;phone
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
                  <h3 className="font-serif text-lg text-text-primary">
                    Email
                  </h3>
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

          {/* Right: form */}
          <ScrollReveal delay={0.15}>
            <ContactForm />
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
