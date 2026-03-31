const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://antiquedaguet.fr";

const localBusinessData = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "FurnitureStore"],
  name: "Daguet Antique",
  description:
    "Ébéniste, designer et antiquaire. Mobilier ancien du XXe siècle et créations sur mesure.",
  url: SITE_URL,
  telephone: "+33123456789",
  email: "contact@antiquedaguet.fr",
  address: {
    "@type": "PostalAddress",
    streetAddress: "12 Rue de l'Atelier",
    addressLocality: "Paris",
    postalCode: "75011",
    addressRegion: "Île-de-France",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 48.8566,
    longitude: 2.3783,
  },
  areaServed: [
    { "@type": "Country", name: "France" },
    { "@type": "Country", name: "United States" },
    { "@type": "Country", name: "United Kingdom" },
  ],
  knowsLanguage: ["fr", "en"],
  priceRange: "€€-€€€€",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "10:00",
    closes: "18:00",
  },
};

export function LocalBusinessJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
    />
  );
}
