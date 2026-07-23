"use server";

import { getCurrentUser } from "@/lib/auth";
import { toInquiryDto } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import {
  createInquirySchema,
  type CreateInquiryInput,
} from "@/lib/validations/inquirySchemas";
import type { Inquiry } from "@/types";

export async function createInquiry(data: CreateInquiryInput): Promise<Inquiry> {
  const parsed = createInquirySchema.parse(data);

  const property = await prisma.property.findUnique({
    where: { id: parsed.propertyId },
    select: { id: true },
  });
  if (!property) throw new Error("Property not found");

  const row = await prisma.inquiry.create({ data: parsed });

  return toInquiryDto(row);
}

export async function getMyInquiries(): Promise<Inquiry[]> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const rows = await prisma.inquiry.findMany({
    where: { property: { ownerId: user.id } },
    orderBy: { createdAt: "desc" },
  });

  return rows.map(toInquiryDto);
}
