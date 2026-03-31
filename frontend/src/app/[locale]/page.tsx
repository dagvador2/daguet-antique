import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { LatestPieces } from "@/components/home/LatestPieces";
import { IntroBlock } from "@/components/home/IntroBlock";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { getAlternates } from "@/lib/routes";
import { hasLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: getAlternates("home"),
  };
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  return (
    <>
      <Hero locale={locale} />
      <LatestPieces locale={locale} />
      <IntroBlock locale={locale} />
      <InstagramFeed />
    </>
  );
}
