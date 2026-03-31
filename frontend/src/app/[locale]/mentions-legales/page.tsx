import type { Metadata } from "next";
import { getAlternates } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Mentions l\u00E9gales",
  description: "Mentions l\u00E9gales du site Daguet Antique.",
  alternates: getAlternates("legal"),
};

export default function MentionsLegales() {
  return (
    <div className="pt-28 pb-20 md:pb-28">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="font-serif text-4xl md:text-5xl tracking-wide text-center">
          Mentions l&eacute;gales
        </h1>

        <div className="mt-16 space-y-10 text-text-secondary leading-relaxed text-sm">
          <section>
            <h2 className="font-serif text-xl text-text-primary mb-4">
              &Eacute;diteur du site
            </h2>
            <p>
              Daguet Antique
              <br />
              Christophe Daguet — Entrepreneur individuel
              <br />
              12 Rue de l&apos;Atelier, 75011 Paris
              <br />
              T&eacute;l&eacute;phone : 01 23 45 67 89
              <br />
              Email : contact@antiquedaguet.fr
              <br />
              SIRET : [En attente]
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-text-primary mb-4">
              H&eacute;bergeur
            </h2>
            <p>
              Vercel Inc.
              <br />
              440 N Barranca Avenue #4133
              <br />
              Covina, CA 91723, &Eacute;tats-Unis
              <br />
              Site web : vercel.com
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-text-primary mb-4">
              Propri&eacute;t&eacute; intellectuelle
            </h2>
            <p>
              L&apos;ensemble du contenu de ce site (textes, images, photographies,
              illustrations, vid&eacute;os) est la propri&eacute;t&eacute; exclusive de Daguet
              Antique ou de ses partenaires. Toute reproduction, repr&eacute;sentation,
              modification, publication ou adaptation de tout ou partie des
              &eacute;l&eacute;ments du site est interdite sans l&apos;autorisation &eacute;crite
              pr&eacute;alable de Daguet Antique.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-text-primary mb-4">
              Donn&eacute;es personnelles
            </h2>
            <p>
              Les informations recueillies via le formulaire de contact sont
              destin&eacute;es exclusivement &agrave; Christophe Daguet pour le traitement de
              votre demande. Conform&eacute;ment au R&egrave;glement G&eacute;n&eacute;ral sur la
              Protection des Donn&eacute;es (RGPD), vous disposez d&apos;un droit
              d&apos;acc&egrave;s, de rectification et de suppression de vos donn&eacute;es
              personnelles. Pour exercer ce droit, contactez-nous &agrave;
              l&apos;adresse : contact@antiquedaguet.fr
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-text-primary mb-4">
              Cookies
            </h2>
            <p>
              Ce site n&apos;utilise pas de cookies de suivi ou de publicit&eacute;. Seuls
              des cookies strictement n&eacute;cessaires au fonctionnement technique du
              site peuvent &ecirc;tre utilis&eacute;s.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-text-primary mb-4">
              Cr&eacute;dits
            </h2>
            <p>
              Site con&ccedil;u et d&eacute;velopp&eacute; avec Next.js et h&eacute;berg&eacute; sur
              Vercel. Photographies : Christophe Daguet, sauf mention contraire.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
