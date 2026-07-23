import { Container } from "@/components/layout/Container";
import { PropertyCardSkeleton } from "@/components/property/PropertyCardSkeleton";

export default function Loading() {
  return (
    <Container className="pb-16 sm:pb-20 lg:pb-24">
      <div className="flex flex-col gap-2 border-b border-neutral-200 pb-8 pt-10 sm:pt-12">
        <div className="h-3 w-32 animate-pulse rounded bg-neutral-200" />
        <div className="mt-1 h-8 w-52 animate-pulse rounded bg-neutral-200" />
        <div className="mt-1 h-3 w-40 animate-pulse rounded bg-neutral-200" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr] lg:gap-10">
        <div className="hidden lg:block">
          <div className="h-[560px] animate-pulse rounded-2xl bg-neutral-100 ring-1 ring-neutral-200" />
        </div>

        <div className="min-w-0">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="h-11 w-32 animate-pulse rounded-full bg-neutral-200 lg:hidden" />
            <div className="ml-auto h-10 w-36 animate-pulse rounded-lg bg-neutral-200" />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2 lg:gap-7 xl:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
