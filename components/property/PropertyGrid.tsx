import { FeaturedPropertyCard } from "@/components/property/FeaturedPropertyCard";
import { PropertyCardSkeleton } from "@/components/property/PropertyCardSkeleton";
import { PropertyEmptyState } from "@/components/property/PropertyEmptyState";
import type { Property } from "@/types";

export function PropertyGrid({
  properties,
  loading = false,
  emptyTitle = "No properties found",
  emptyDescription = "Try adjusting your filters or check back later.",
}: {
  properties: Property[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <PropertyEmptyState title={emptyTitle} description={emptyDescription} />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <FeaturedPropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
