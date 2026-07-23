import { mockProperties } from "@/lib/mock-data";

export const locations = Array.from(
  new Set(mockProperties.map((property) => property.location)),
).sort();
