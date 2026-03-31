import { Hero } from "@/components/home/Hero";
import { LatestPieces } from "@/components/home/LatestPieces";
import { IntroBlock } from "@/components/home/IntroBlock";
import { InstagramFeed } from "@/components/home/InstagramFeed";

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
