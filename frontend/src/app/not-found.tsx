import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <h1 className="font-serif text-6xl text-text-primary">404</h1>
      <p className="mt-4 text-text-secondary text-lg">
        Page introuvable
      </p>
      <Link
        href="/"
        className="mt-8 inline-block font-sans text-sm tracking-widest uppercase text-text-secondary hover:text-text-primary transition-colors border-b border-text-muted hover:border-text-primary pb-1"
      >
        Retour &agrave; l&apos;accueil &rarr;
      </Link>
    </div>
  );
}
