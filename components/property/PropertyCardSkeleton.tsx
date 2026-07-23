export function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200/80">
      <div className="aspect-16/11 w-full animate-pulse bg-neutral-200" />
      <div className="flex flex-col p-5">
        <div className="h-4 w-3/5 animate-pulse rounded bg-neutral-200" />
        <div className="mt-2 h-3 w-2/5 animate-pulse rounded bg-neutral-200" />
        <div className="mt-4 h-px bg-neutral-100" />
        <div className="mt-3.5 h-4 w-full animate-pulse rounded bg-neutral-200" />
      </div>
    </div>
  );
}
