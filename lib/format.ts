import type { ListingType, PropertyType } from "@/types";

export function formatPriceValue(price: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatPrice(
  price: number,
  currency: string,
  listingType: ListingType,
): string {
  const formatted = formatPriceValue(price, currency);
  return listingType === "rent" ? `${formatted}/mo` : formatted;
}

export function formatSize(size: number): string {
  return `${new Intl.NumberFormat("en-US").format(size)} m²`;
}

const propertyTypeLabels: Record<PropertyType, string> = {
  apartment: "Apartment",
  villa: "Villa",
  house: "House",
  land: "Land",
  office: "Office",
  shop: "Shop",
};

export function formatPropertyType(type: PropertyType): string {
  return propertyTypeLabels[type];
}

export function formatAmenity(amenity: string): string {
  return amenity
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(new Date(iso));
}
