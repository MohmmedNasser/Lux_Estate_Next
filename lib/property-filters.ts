import type { Property, PropertyFilters, PropertyType } from "@/types";

const propertyTypeValues: PropertyType[] = [
  "apartment",
  "villa",
  "house",
  "land",
  "office",
  "shop",
];

function isPropertyType(value: string | undefined): value is PropertyType {
  return !!value && propertyTypeValues.includes(value as PropertyType);
}

export type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parsePropertyFilters(
  searchParams: RawSearchParams,
): PropertyFilters {
  const listingType = first(searchParams.listingType);
  const propertyType = first(searchParams.propertyType);
  const location = first(searchParams.location);
  const minPrice = first(searchParams.minPrice);
  const maxPrice = first(searchParams.maxPrice);
  const bedrooms = first(searchParams.bedrooms);
  const bathrooms = first(searchParams.bathrooms);
  const sortBy = first(searchParams.sortBy);

  return {
    listingType:
      listingType === "buy" || listingType === "rent"
        ? listingType
        : undefined,
    propertyType: isPropertyType(propertyType) ? propertyType : undefined,
    location: location || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    bedrooms: bedrooms ? Number(bedrooms) : undefined,
    bathrooms: bathrooms ? Number(bathrooms) : undefined,
    sortBy:
      sortBy === "price-asc" || sortBy === "price-desc" || sortBy === "newest"
        ? sortBy
        : "newest",
  };
}

export function filterProperties(
  properties: Property[],
  filters: PropertyFilters,
): Property[] {
  const filtered = properties.filter((property) => {
    if (filters.listingType && property.listingType !== filters.listingType)
      return false;
    if (
      filters.propertyType &&
      property.propertyType !== filters.propertyType
    )
      return false;
    if (filters.location && property.location !== filters.location)
      return false;
    if (filters.minPrice !== undefined && property.price < filters.minPrice)
      return false;
    if (filters.maxPrice !== undefined && property.price > filters.maxPrice)
      return false;
    if (
      filters.bedrooms !== undefined &&
      property.bedrooms < filters.bedrooms
    )
      return false;
    if (
      filters.bathrooms !== undefined &&
      property.bathrooms < filters.bathrooms
    )
      return false;
    return true;
  });

  const sorted = [...filtered];
  switch (filters.sortBy) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "newest":
    default:
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  return sorted;
}
