"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth";
import { toUserDto } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/lib/validations/userSchemas";
import type { User } from "@/types";

export async function updateProfile(data: UpdateProfileInput): Promise<User> {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Unauthorized");

  const parsed = updateProfileSchema.parse(data);

  const row = await prisma.user.update({
    where: { id: currentUser.id },
    data: parsed,
  });

  revalidatePath("/dashboard");

  return toUserDto(row);
}

export interface DashboardStats {
  totalListings: number;
  forSale: number;
  forRent: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const [totalListings, forSale, forRent] = await Promise.all([
    prisma.property.count({ where: { ownerId: user.id } }),
    prisma.property.count({ where: { ownerId: user.id, listingType: "BUY" } }),
    prisma.property.count({ where: { ownerId: user.id, listingType: "RENT" } }),
  ]);

  return { totalListings, forSale, forRent };
}
