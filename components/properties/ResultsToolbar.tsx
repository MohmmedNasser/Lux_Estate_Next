"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { LayoutGrid, List } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MobileFilterSheet } from "@/components/properties/MobileFilterSheet";
import { FilterChips } from "@/components/properties/FilterChips";
import type { PropertyFilters } from "@/types";

const sortItems = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "beds-desc", label: "Most Beds" },
];

export function ResultsToolbar({
  filters,
  locations,
  sortBy,
  view,
  total,
}: {
  filters: PropertyFilters;
  locations: string[];
  sortBy: string;
  view: "grid" | "list";
  total: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function toggleQuickListingType(value: "buy" | "rent") {
    const params = new URLSearchParams(searchParams.toString());
    if (filters.listingType === value) {
      params.delete("listingType");
    } else {
      params.set("listingType", value);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="mb-6 flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex min-w-0 items-center gap-3 overflow-x-auto lg:hidden">
          <MobileFilterSheet
            locations={locations}
            initialFilters={filters}
            total={total}
          />
          <QuickChip
            active={filters.listingType === "buy"}
            onClick={() => toggleQuickListingType("buy")}
          >
            Buy
          </QuickChip>
          <QuickChip
            active={filters.listingType === "rent"}
            onClick={() => toggleQuickListingType("rent")}
          >
            Rent
          </QuickChip>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <Select
            items={sortItems}
            value={sortBy}
            onValueChange={(value) => updateParam("sortBy", value ?? "newest")}
          >
            <SelectTrigger className="h-10 rounded-lg bg-white px-3.5 pr-2 text-[13.5px] text-neutral-700 ring-1 ring-neutral-300 outline-none transition-colors hover:ring-neutral-400 data-popup-open:ring-2 data-popup-open:ring-amber-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="inline-flex rounded-lg bg-neutral-50 p-0.5 ring-1 ring-neutral-300">
            <ViewToggleButton
              active={view === "grid"}
              onClick={() => updateParam("view", "grid")}
              label="Grid view"
            >
              <LayoutGrid className="size-4" />
            </ViewToggleButton>
            <ViewToggleButton
              active={view === "list"}
              onClick={() => updateParam("view", "list")}
              label="List view"
            >
              <List className="size-4" />
            </ViewToggleButton>
          </div>
        </div>
      </div>

      <FilterChips filters={filters} className="lg:hidden" />
    </div>
  );
}

function QuickChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-9 shrink-0 rounded-full px-3.5 text-[13px] font-medium ring-1 transition-colors",
        active
          ? "bg-neutral-900 text-white ring-neutral-900"
          : "text-neutral-600 ring-neutral-300 hover:ring-neutral-400",
      )}
    >
      {children}
    </button>
  );
}

function ViewToggleButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className="relative grid size-9 place-items-center rounded-md"
    >
      {active && (
        <motion.span
          layoutId="view-toggle-pill"
          className="absolute inset-0 rounded-md bg-white shadow-sm"
          transition={
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 500, damping: 35 }
          }
        />
      )}
      <span
        className={cn(
          "relative z-10",
          active
            ? "text-neutral-900"
            : "text-neutral-400 hover:text-neutral-600",
        )}
      >
        {children}
      </span>
    </button>
  );
}
