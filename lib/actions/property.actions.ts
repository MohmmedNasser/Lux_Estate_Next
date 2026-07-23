"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth";
import { deleteCloudinaryImages, extractCloudinaryPublicId } from "@/lib/cloudinary";
import {
  toClientListingType,
  toClientPropertyType,
  toPrismaListingType,
  toPrismaPropertyType,
  toPropertyDto,
  toUserDto,
} from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import {
  createPropertySchema,
  propertyFilterSchema,
  updatePropertySchema,
  type CreatePropertyInput,
  type PropertyFilterInput,
  type UpdatePropertyInput,
} from "@/lib/validations/propertySchemas";
import type { Prisma } from "@/generated/prisma/client";
import type { Property, User } from "@/types";

const PROPERTIES_PATH = "/properties";
const DASHBOARD_PATH = "/dashboard";
const HOME_PATH = "/";

function propertyDetailPath(id: string) {
  return `/properties/${id}`;
}

function revalidatePropertyPaths(id: string) {
  revalidatePath(PROPERTIES_PATH);
  revalidatePath(DASHBOARD_PATH);
  revalidatePath(HOME_PATH);
  revalidatePath(propertyDetailPath(id));
}

export interface GetPropertiesResult {
  properties: Property[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getProperties(
  filters: PropertyFilterInput = {},
  page = 1,
  pageSize = 12,
): Promise<GetPropertiesResult> {
  const parsed = propertyFilterSchema.parse(filters);
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  const safePageSize = Number.isInteger(pageSize) && pageSize > 0 ? pageSize : 12;

  const where: Prisma.PropertyWhereInput = { status: "ACTIVE" };

  if (parsed.listingType) {
    where.listingType = toPrismaListingType(parsed.listingType);
  }
  if (parsed.propertyType) {
    where.propertyType = toPrismaPropertyType(parsed.propertyType);
  }
  if (parsed.location) {
    where.location = { contains: parsed.location, mode: "insensitive" };
  }
  if (parsed.minPrice !== undefined || parsed.maxPrice !== undefined) {
    where.price = {
      ...(parsed.minPrice !== undefined ? { gte: parsed.minPrice } : {}),
      ...(parsed.maxPrice !== undefined ? { lte: parsed.maxPrice } : {}),
    };
  }
  if (parsed.bedrooms !== undefined) {
    where.bedrooms = { gte: parsed.bedrooms };
  }
  if (parsed.bathrooms !== undefined) {
    where.bathrooms = { gte: parsed.bathrooms };
  }

  // PRD-BACKEND §8 names newest/price-asc/price-desc explicitly; beds-desc is
  // also part of PropertyFilters/propertyFilterSchema and already relied on
  // by ResultsToolbar's "Most Beds" sort, so it's handled here too rather
  // than silently dropped.
  const orderBy: Prisma.PropertyOrderByWithRelationInput =
    parsed.sortBy === "price-asc"
      ? { price: "asc" }
      : parsed.sortBy === "price-desc"
        ? { price: "desc" }
        : parsed.sortBy === "beds-desc"
          ? { bedrooms: "desc" }
          : { createdAt: "desc" };

  const [rows, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy,
      skip: (safePage - 1) * safePageSize,
      take: safePageSize,
    }),
    prisma.property.count({ where }),
  ]);

  return {
    properties: rows.map(toPropertyDto),
    total,
    page: safePage,
    totalPages: Math.max(1, Math.ceil(total / safePageSize)),
  };
}

export async function getPropertyById(
  id: string,
): Promise<{ property: Property; owner: User } | null> {
  const row = await prisma.property.findUnique({
    where: { id },
    include: { owner: true },
  });

  if (!row) return null;

  const { owner, ...propertyRow } = row;
  return {
    property: toPropertyDto(propertyRow),
    owner: toUserDto(owner),
  };
}

export async function getFeaturedProperties(limit = 6): Promise<Property[]> {
  const rows = await prisma.property.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return rows.map(toPropertyDto);
}

export async function getSimilarProperties(
  id: string,
  limit = 3,
): Promise<Property[]> {
  const current = await prisma.property.findUnique({ where: { id } });
  if (!current) return [];

  const rows = await prisma.property.findMany({
    where: {
      status: "ACTIVE",
      id: { not: id },
      OR: [
        { propertyType: current.propertyType },
        { location: current.location },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return rows.map(toPropertyDto);
}

export async function getMyProperties(): Promise<Property[]> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const rows = await prisma.property.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return rows.map(toPropertyDto);
}

export async function createProperty(data: CreatePropertyInput): Promise<Property> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const parsed = createPropertySchema.parse(data);
  const { propertyType, listingType, ...rest } = parsed;

  const row = await prisma.property.create({
    data: {
      ...rest,
      propertyType: toPrismaPropertyType(propertyType),
      listingType: toPrismaListingType(listingType),
      ownerId: user.id,
    },
  });

  revalidatePropertyPaths(row.id);

  return toPropertyDto(row);
}

export async function updateProperty(
  id: string,
  data: UpdatePropertyInput,
): Promise<Property> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) throw new Error("Property not found");
  if (existing.ownerId !== user.id) throw new Error("Forbidden");

  const parsed = updatePropertySchema.parse(data);
  const { propertyType, listingType, ...rest } = parsed;

  const row = await prisma.property.update({
    where: { id },
    data: {
      ...rest,
      ...(propertyType !== undefined
        ? { propertyType: toPrismaPropertyType(propertyType) }
        : {}),
      ...(listingType !== undefined
        ? { listingType: toPrismaListingType(listingType) }
        : {}),
    },
  });

  revalidatePropertyPaths(id);

  return toPropertyDto(row);
}

export async function deleteProperty(id: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) throw new Error("Property not found");
  if (existing.ownerId !== user.id) throw new Error("Forbidden");

  await prisma.property.delete({ where: { id } });

  try {
    const publicIds = existing.images
      .map(extractCloudinaryPublicId)
      .filter((publicId): publicId is string => publicId !== null);
    await deleteCloudinaryImages(publicIds);
  } catch {
    // The property row is already gone; a stray Cloudinary asset can be
    // cleaned up later and shouldn't fail the delete the user asked for.
  }

  revalidatePropertyPaths(id);
}
