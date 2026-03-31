import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { LatestPieces } from "@/components/home/LatestPieces";
import { IntroBlock } from "@/components/home/IntroBlock";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { getAlternates } from "@/lib/routes";

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: getAlternates("home"),
  };
}

export default function Home() {
  return (
    <>
      <Hero />
      <LatestPieces />
      <IntroBlock />
      <InstagramFeed />
    </>
  );
}
