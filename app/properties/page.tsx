import { Suspense } from "react";
import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { FilterBar } from "@/components/property/FilterBar";
import { MobileFilterDrawer } from "@/components/property/MobileFilterDrawer";
import { PropertiesToolbar } from "@/components/property/PropertiesToolbar";
import { PropertyResults } from "@/components/property/PropertyResults";
import { mockProperties } from "@/lib/mock-data";
import { locations } from "@/lib/locations";
import {
  filterProperties,
  parsePropertyFilters,
  type RawSearchParams,
} from "@/lib/property-filters";

export const metadata: Metadata = {
  title: "All Properties | Lux Estate",
  description: "Browse every property for sale or rent on Lux Estate.",
};

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  const filters = parsePropertyFilters(params);
  const view = params.view === "list" ? "list" : "grid";
  const results = filterProperties(mockProperties, filters);

  return (
    <Container className="py-10 sm:py-14">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          All Properties
        </h1>
        <p className="text-sm text-muted-foreground">
          {results.length} {results.length === 1 ? "property" : "properties"}{" "}
          found
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
        <aside className="flex flex-col gap-4 lg:w-72 lg:shrink-0">
          <MobileFilterDrawer locations={locations} initialFilters={filters} />
          <div className="hidden lg:sticky lg:top-24 lg:block">
            <FilterBar
              variant="vertical"
              locations={locations}
              initialFilters={filters}
            />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <Suspense fallback={null}>
            <PropertiesToolbar
              sortBy={filters.sortBy ?? "newest"}
              view={view}
            />
          </Suspense>
          <div className="mt-6">
            <PropertyResults
              key={results.map((property) => property.id).join(",")}
              properties={results}
              view={view}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
