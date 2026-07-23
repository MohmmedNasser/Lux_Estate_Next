"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatPriceValue, formatPropertyType } from "@/lib/format";
import type { PropertyFilters } from "@/types";

interface Chip {
  key: keyof PropertyFilters;
  label: string;
}

function buildChips(filters: PropertyFilters): Chip[] {
  const chips: Chip[] = [];

  if (filters.listingType) {
    chips.push({
      key: "listingType",
      label: filters.listingType === "buy" ? "Buy" : "Rent",
    });
  }
  if (filters.propertyType) {
    chips.push({
      key: "propertyType",
      label: formatPropertyType(filters.propertyType),
    });
  }
  if (filters.location) {
    chips.push({ key: "location", label: filters.location });
  }
  if (filters.minPrice !== undefined) {
    chips.push({
      key: "minPrice",
      label: `From ${formatPriceValue(filters.minPrice, "USD")}`,
    });
  }
  if (filters.maxPrice !== undefined) {
    chips.push({
      key: "maxPrice",
      label: `Up to ${formatPriceValue(filters.maxPrice, "USD")}`,
    });
  }
  if (filters.bedrooms !== undefined) {
    chips.push({ key: "bedrooms", label: `${filters.bedrooms}+ beds` });
  }
  if (filters.bathrooms !== undefined) {
    chips.push({ key: "bathrooms", label: `${filters.bathrooms}+ baths` });
  }

  return chips;
}

export function FilterChips({
  filters,
  className,
}: {
  filters: PropertyFilters;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chips = buildChips(filters);

  if (chips.length === 0) return null;

  function removeChip(key: keyof PropertyFilters) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    const qs = params.toString();
    router.push(qs ? `/properties?${qs}` : "/properties");
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <AnimatePresence initial={false} mode="popLayout">
        {chips.map((chip) => (
          <motion.span
            key={chip.key}
            layout={!reduce}
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 py-1.5 pl-3 pr-2 text-[12.5px] font-medium text-amber-800 ring-1 ring-amber-200"
          >
            {chip.label}
            <button
              type="button"
              onClick={() => removeChip(chip.key)}
              aria-label={`Remove ${chip.label} filter`}
              className="grid size-3.5 place-items-center rounded-full text-amber-700 transition-colors hover:bg-amber-100 hover:text-amber-900"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
