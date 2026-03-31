import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Daguet Antique \u2014 \u00C9b\u00E9niste, Designer, Antiquaire",
    template: "%s | Daguet Antique",
  },
  description:
    "Christophe Daguet, \u00E9b\u00E9niste et antiquaire. D\u00E9couvrez notre collection d\u2019antiquit\u00E9s du XXe si\u00E8cle et nos cr\u00E9ations sur mesure.",
  other: {
    "geo.region": "FR-75",
    "geo.placename": "Paris",
    "geo.position": "48.8566;2.3783",
    ICBM: "48.8566, 2.3783",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "fr";

  return (
    <html lang={locale} className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <LocalBusinessJsonLd />
        {children}
      </body>
    </html>
  );
}
