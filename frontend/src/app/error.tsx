"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <h1 className="font-serif text-4xl text-text-primary">
        Une erreur est survenue
      </h1>
      <p className="mt-4 text-text-secondary">
        Nous nous excusons pour la g&ecirc;ne occasionn&eacute;e.
      </p>
      <button
        onClick={reset}
        className="mt-8 px-6 py-3 bg-accent text-white text-sm tracking-widest uppercase hover:bg-accent-hover transition-colors"
      >
        R&eacute;essayer
      </button>
    </div>
  );
}
