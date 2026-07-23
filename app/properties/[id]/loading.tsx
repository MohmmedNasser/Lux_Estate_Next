import { Container } from "@/components/layout/Container";

export default function Loading() {
  return (
    <Container className="pt-6 pb-24 sm:pt-8 lg:pb-16">
      <div className="flex flex-col gap-3">
        <div className="h-3 w-40 animate-pulse rounded bg-neutral-200" />
        <div className="h-8 w-2/3 max-w-md animate-pulse rounded bg-neutral-200" />
        <div className="h-3 w-48 animate-pulse rounded bg-neutral-200" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:mt-8 lg:grid-cols-4 lg:grid-rows-2">
        <div className="aspect-4/3 animate-pulse rounded-2xl bg-neutral-200 sm:col-span-2 lg:col-span-2 lg:row-span-2 lg:aspect-auto" />
        <div className="hidden aspect-4/3 animate-pulse rounded-2xl bg-neutral-200 lg:block" />
        <div className="hidden aspect-4/3 animate-pulse rounded-2xl bg-neutral-200 lg:block" />
        <div className="hidden aspect-4/3 animate-pulse rounded-2xl bg-neutral-200 lg:block" />
        <div className="hidden aspect-4/3 animate-pulse rounded-2xl bg-neutral-200 lg:block" />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:mt-14 lg:grid-cols-[1fr_380px] lg:gap-12 xl:grid-cols-[1fr_400px]">
        <div className="flex flex-col gap-8">
          <div className="border-b border-neutral-200 pb-8">
            <div className="h-8 w-40 animate-pulse rounded bg-neutral-200" />
            <div className="mt-4 h-4 w-56 animate-pulse rounded bg-neutral-200" />
            <div className="mt-6 h-4 w-full max-w-md animate-pulse rounded bg-neutral-200" />
          </div>
          <div className="border-b border-neutral-200 pb-8">
            <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
            <div className="mt-2 h-4 w-full animate-pulse rounded bg-neutral-200" />
            <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-neutral-200" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-5 animate-pulse rounded bg-neutral-200" />
            ))}
          </div>
        </div>

        <div className="h-[420px] animate-pulse rounded-2xl bg-neutral-100 ring-1 ring-neutral-200" />
      </div>
    </Container>
  );
}
