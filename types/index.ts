export type ListingType = "buy" | "rent";

export type PropertyType =
  | "apartment"
  | "villa"
  | "house"
  | "land"
  | "office"
  | "shop";

export interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  listingType: ListingType;
  price: number;
  currency: string; // e.g. "USD"
  location: string; // city or area name
  address?: string;
  bedrooms: number;
  bathrooms: number;
  size: number; // in square meters
  amenities: string[]; // e.g. ["parking", "elevator", "garden"]
  images: string[]; // image URLs
  ownerId: string;
  createdAt: string; // ISO date string
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  propertyId: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  message: string;
  createdAt: string;
}

export interface PropertyFilters {
  listingType?: ListingType;
  propertyType?: PropertyType;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  sortBy?: "newest" | "price-asc" | "price-desc" | "beds-desc";
}
