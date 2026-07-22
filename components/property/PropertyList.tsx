import { PropertyEmptyState } from "@/components/property/PropertyEmptyState";
import { PropertyListItem } from "@/components/property/PropertyListItem";
import type { Property } from "@/types";

export function PropertyList({
  properties,
  emptyTitle,
  emptyDescription,
}: {
  properties: Property[];
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (properties.length === 0) {
    return (
      <PropertyEmptyState title={emptyTitle} description={emptyDescription} />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {properties.map((property) => (
        <PropertyListItem key={property.id} property={property} />
      ))}
    </div>
  );
}
