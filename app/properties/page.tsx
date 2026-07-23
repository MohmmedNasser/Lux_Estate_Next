import { Suspense } from "react";
import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { PropertiesHeader } from "@/components/properties/PropertiesHeader";
import { FilterSidebar } from "@/components/properties/FilterSidebar";
import { ResultsToolbar } from "@/components/properties/ResultsToolbar";
import { PropertiesGrid } from "@/components/properties/PropertiesGrid";
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
  const filtersKey = JSON.stringify(filters);

  return (
    <Container className="pb-16 sm:pb-20 lg:pb-24">
      <PropertiesHeader count={results.length} />

      <Suspense fallback={null}>
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr] lg:gap-10">
          <FilterSidebar
            key={filtersKey}
            locations={locations}
            initialFilters={filters}
          />

          <div className="min-w-0">
            <ResultsToolbar
              key={filtersKey}
              filters={filters}
              locations={locations}
              sortBy={filters.sortBy ?? "newest"}
              view={view}
            />
            <PropertiesGrid
              key={results.map((property) => property.id).join(",")}
              properties={results}
              view={view}
            />
          </div>
        </div>
      </Suspense>
    </Container>
  );
}
