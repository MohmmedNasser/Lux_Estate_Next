import type {
  ListingType as PrismaListingType,
  Property as PrismaProperty,
  PropertyType as PrismaPropertyType,
  User as PrismaUser,
} from "@/generated/prisma/client";
import type { ListingType, Property, PropertyType, User } from "@/types";

const listingTypeToPrisma: Record<ListingType, PrismaListingType> = {
  buy: "BUY",
  rent: "RENT",
};

const listingTypeToClient: Record<PrismaListingType, ListingType> = {
  BUY: "buy",
  RENT: "rent",
};

const propertyTypeToPrisma: Record<PropertyType, PrismaPropertyType> = {
  apartment: "APARTMENT",
  villa: "VILLA",
  house: "HOUSE",
  land: "LAND",
  office: "OFFICE",
  shop: "SHOP",
};

const propertyTypeToClient: Record<PrismaPropertyType, PropertyType> = {
  APARTMENT: "apartment",
  VILLA: "villa",
  HOUSE: "house",
  LAND: "land",
  OFFICE: "office",
  SHOP: "shop",
};

export function toPrismaListingType(value: ListingType): PrismaListingType {
  return listingTypeToPrisma[value];
}

export function toClientListingType(value: PrismaListingType): ListingType {
  return listingTypeToClient[value];
}

export function toPrismaPropertyType(value: PropertyType): PrismaPropertyType {
  return propertyTypeToPrisma[value];
}

export function toClientPropertyType(value: PrismaPropertyType): PropertyType {
  return propertyTypeToClient[value];
}

// Prisma's Property row carries `status`/`updatedAt`, which aren't part of
// the frontend contract (types/index.ts) — this mapper is also where those
// get dropped.
export function toPropertyDto(property: PrismaProperty): Property {
  return {
    id: property.id,
    title: property.title,
    description: property.description,
    propertyType: toClientPropertyType(property.propertyType),
    listingType: toClientListingType(property.listingType),
    price: property.price,
    currency: property.currency,
    location: property.location,
    address: property.address ?? undefined,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    size: property.size,
    amenities: property.amenities,
    images: property.images,
    ownerId: property.ownerId,
    createdAt: property.createdAt.toISOString(),
  };
}

export function toUserDto(user: PrismaUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.image ?? undefined,
    createdAt: user.createdAt.toISOString(),
  };
}
