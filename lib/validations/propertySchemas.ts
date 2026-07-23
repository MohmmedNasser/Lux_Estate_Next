import { z } from "zod";

import type { ListingType, PropertyFilters, PropertyType } from "@/types";

const propertyTypeValues = [
  "apartment",
  "villa",
  "house",
  "land",
  "office",
  "shop",
] as const satisfies readonly PropertyType[];

const listingTypeValues = [
  "buy",
  "rent",
] as const satisfies readonly ListingType[];

const sortByValues = [
  "newest",
  "price-asc",
  "price-desc",
  "beds-desc",
] as const satisfies readonly NonNullable<PropertyFilters["sortBy"]>[];

export const createPropertySchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters.")
    .max(100, "Title must be at most 100 characters."),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters.")
    .max(2000, "Description must be at most 2000 characters."),
  propertyType: z.enum(propertyTypeValues),
  listingType: z.enum(listingTypeValues),
  price: z.number().int().positive("Price must be a positive number."),
  currency: z.string().trim().min(1, "Currency is required.").default("USD"),
  location: z.string().trim().min(1, "Location is required."),
  address: z.string().trim().min(1).optional(),
  bedrooms: z
    .number()
    .int()
    .min(0, "Bedrooms must be between 0 and 20.")
    .max(20, "Bedrooms must be between 0 and 20."),
  bathrooms: z
    .number()
    .int()
    .min(0, "Bathrooms must be between 0 and 20.")
    .max(20, "Bathrooms must be between 0 and 20."),
  size: z.number().int().positive("Size must be a positive number."),
  amenities: z.array(z.string()).default([]),
  images: z
    .array(z.url("Each image must be a valid URL."))
    .min(1, "Add at least one image.")
    .max(10, "You can add up to 10 images."),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;

export const updatePropertySchema = createPropertySchema.partial();

export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;

export const propertyFilterSchema = z.object({
  listingType: z.enum(listingTypeValues).optional(),
  propertyType: z.enum(propertyTypeValues).optional(),
  location: z.string().trim().min(1).optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  sortBy: z.enum(sortByValues).optional(),
});

export type PropertyFilterInput = z.infer<typeof propertyFilterSchema>;
