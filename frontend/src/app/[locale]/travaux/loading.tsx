export default function Loading() {
  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-12 w-48 bg-bg-secondary animate-pulse mx-auto rounded" />
        <div className="mt-4 h-5 w-72 bg-bg-secondary animate-pulse mx-auto rounded" />
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[4/5] bg-bg-secondary animate-pulse rounded" />
              <div className="h-5 w-3/4 bg-bg-secondary animate-pulse rounded" />
              <div className="h-4 w-1/2 bg-bg-secondary animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
