"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatAmenity } from "@/lib/format";

export function AmenityChips({
  amenities,
  selected,
  onToggle,
}: {
  amenities: string[];
  selected: string[];
  onToggle: (amenity: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {amenities.map((amenity) => {
        const checked = selected.includes(amenity);
        return (
          <button
            key={amenity}
            type="button"
            onClick={() => onToggle(amenity)}
            aria-pressed={checked}
            className={cn(
              "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-3.5 py-2.5 text-[14px] ring-1 transition-colors",
              checked
                ? "bg-amber-50 text-amber-800 ring-amber-300"
                : "text-neutral-700 ring-neutral-300 hover:ring-neutral-400",
            )}
          >
            <AnimatePresence initial={false}>
              {checked && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="grid place-items-center"
                >
                  <Check className="size-3.5" aria-hidden="true" />
                </motion.span>
              )}
            </AnimatePresence>
            <span className="truncate">{formatAmenity(amenity)}</span>
          </button>
        );
      })}
    </div>
  );
}
