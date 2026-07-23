import { Container } from "@/components/layout/Container";
import { PropertyCardSkeleton } from "@/components/property/PropertyCardSkeleton";

export default function Loading() {
  return (
    <>
      <div className="min-h-[640px] animate-pulse bg-neutral-950 lg:h-[88vh] lg:max-h-[88vh]" />

      <section className="pt-20 pb-20 sm:pt-24 sm:pb-24 lg:pt-32 lg:pb-32">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="h-3 w-24 animate-pulse rounded bg-neutral-200" />
              <div className="mt-3 h-8 w-56 animate-pulse rounded bg-neutral-200" />
            </div>
            <div className="h-11 w-full animate-pulse rounded-full bg-neutral-200 sm:w-44" />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
