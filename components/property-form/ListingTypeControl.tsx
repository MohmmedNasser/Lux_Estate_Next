"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import type { ListingType } from "@/types";

const options: { value: ListingType; label: string }[] = [
  { value: "buy", label: "For Sale" },
  { value: "rent", label: "For Rent" },
];

export function ListingTypeControl({
  value,
  onChange,
}: {
  value: ListingType;
  onChange: (value: ListingType) => void;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="grid grid-cols-2 rounded-lg bg-neutral-100 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={cn(
            "relative z-10 rounded-md px-4 py-2 text-[13px] font-medium transition-colors",
            value === option.value
              ? "text-neutral-900"
              : "text-neutral-500 hover:text-neutral-700",
          )}
        >
          {value === option.value && (
            <motion.span
              layoutId="pf-listing-type-pill"
              className="absolute inset-0 -z-10 rounded-md bg-white shadow-sm"
              transition={
                reduce
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 500, damping: 35 }
              }
            />
          )}
          {option.label}
        </button>
      ))}
    </div>
  );
}
