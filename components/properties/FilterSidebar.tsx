"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion";
import { formatPropertyType } from "@/lib/format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterChips } from "@/components/properties/FilterChips";
import type { PropertyFilters, PropertyType } from "@/types";

const propertyTypes: PropertyType[] = [
  "apartment",
  "villa",
  "house",
  "land",
  "office",
  "shop",
];
const bedroomOptions = [1, 2, 3, 4];
const bathroomOptions = [1, 2, 3, 4];

export type ListingFilter = "all" | "buy" | "rent";

export interface FilterDraft {
  listingType: ListingFilter;
  propertyType: PropertyType | "";
  location: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
}

function emptyDraft(): FilterDraft {
  return {
    listingType: "all",
    propertyType: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
  };
}

function draftFromFilters(initialFilters?: PropertyFilters): FilterDraft {
  return {
    listingType: initialFilters?.listingType ?? "all",
    propertyType: initialFilters?.propertyType ?? "",
    location: initialFilters?.location ?? "",
    minPrice: initialFilters?.minPrice?.toString() ?? "",
    maxPrice: initialFilters?.maxPrice?.toString() ?? "",
    bedrooms: initialFilters?.bedrooms?.toString() ?? "",
    bathrooms: initialFilters?.bathrooms?.toString() ?? "",
  };
}

export function useFilterFormState(initialFilters?: PropertyFilters) {
  const router = useRouter();
  const [draft, setDraft] = useState<FilterDraft>(() =>
    draftFromFilters(initialFilters),
  );

  function update<K extends keyof FilterDraft>(
    key: K,
    value: FilterDraft[K],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function buildUrl(overrideDraft: FilterDraft = draft) {
    const params = new URLSearchParams();
    if (overrideDraft.listingType !== "all")
      params.set("listingType", overrideDraft.listingType);
    if (overrideDraft.propertyType)
      params.set("propertyType", overrideDraft.propertyType);
    if (overrideDraft.location) params.set("location", overrideDraft.location);
    if (overrideDraft.minPrice) params.set("minPrice", overrideDraft.minPrice);
    if (overrideDraft.maxPrice) params.set("maxPrice", overrideDraft.maxPrice);
    if (overrideDraft.bedrooms) params.set("bedrooms", overrideDraft.bedrooms);
    if (overrideDraft.bathrooms)
      params.set("bathrooms", overrideDraft.bathrooms);
    const qs = params.toString();
    return qs ? `/properties?${qs}` : "/properties";
  }

  function apply() {
    router.push(buildUrl());
  }

  function resetDraft() {
    setDraft(emptyDraft());
  }

  return { draft, update, apply, resetDraft, buildUrl };
}

export function LookingToControl({
  layoutId,
  value,
  onChange,
}: {
  layoutId: string;
  value: ListingFilter;
  onChange: (value: ListingFilter) => void;
}) {
  const reduce = useReducedMotion();
  const options: { value: ListingFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "buy", label: "Buy" },
    { value: "rent", label: "Rent" },
  ];

  return (
    <div className="grid grid-cols-3 rounded-lg bg-neutral-100 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={cn(
            "relative z-10 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
            value === option.value
              ? "text-neutral-900"
              : "text-neutral-500 hover:text-neutral-700",
          )}
        >
          {value === option.value && (
            <motion.span
              layoutId={layoutId}
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

function PillButton({
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
        "h-9 rounded-lg px-3.5 text-[13px] font-medium ring-1 transition-colors",
        active
          ? "bg-neutral-900 text-white ring-neutral-900"
          : "text-neutral-600 ring-neutral-300 hover:ring-neutral-400",
      )}
    >
      {children}
    </button>
  );
}

function RangePillGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: number[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[13px] font-medium text-neutral-700">{label}</p>
      <div className="flex flex-wrap gap-2">
        <PillButton active={value === ""} onClick={() => onChange("")}>
          Any
        </PillButton>
        {options.map((n) => (
          <PillButton
            key={n}
            active={value === String(n)}
            onClick={() => onChange(String(n))}
          >
            {n}+
          </PillButton>
        ))}
      </div>
    </div>
  );
}

const selectTriggerClass =
  "h-11 w-full rounded-lg bg-white px-3.5 text-[14px] text-neutral-700 ring-1 ring-neutral-300 outline-none transition-colors hover:ring-neutral-400 data-popup-open:ring-2 data-popup-open:ring-amber-600";

export function FilterFieldGroups({
  draft,
  update,
  locations,
  layoutIdPrefix,
}: {
  draft: FilterDraft;
  update: <K extends keyof FilterDraft>(key: K, value: FilterDraft[K]) => void;
  locations: string[];
  layoutIdPrefix: string;
}) {
  const locationItems = [
    { value: "", label: "Any location" },
    ...locations.map((loc) => ({ value: loc, label: loc })),
  ];
  const propertyTypeItems = [
    { value: "", label: "Any type" },
    ...propertyTypes.map((type) => ({
      value: type,
      label: formatPropertyType(type),
    })),
  ];

  return (
    <div className="divide-y divide-neutral-100">
      <div className="py-5 first:pt-0">
        <p className="mb-2 text-[13px] font-medium text-neutral-700">
          Looking to
        </p>
        <LookingToControl
          layoutId={`${layoutIdPrefix}-looking-to`}
          value={draft.listingType}
          onChange={(value) => update("listingType", value)}
        />
      </div>

      <div className="py-5">
        <p className="mb-2 text-[13px] font-medium text-neutral-700">
          Location
        </p>
        <Select
          items={locationItems}
          value={draft.location}
          onValueChange={(value) => update("location", value ?? "")}
        >
          <SelectTrigger className={selectTriggerClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {locationItems.map((item) => (
              <SelectItem key={item.label} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="py-5">
        <p className="mb-2 text-[13px] font-medium text-neutral-700">
          Property Type
        </p>
        <Select
          items={propertyTypeItems}
          value={draft.propertyType}
          onValueChange={(value) =>
            update("propertyType", (value ?? "") as PropertyType | "")
          }
        >
          <SelectTrigger className={selectTriggerClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {propertyTypeItems.map((item) => (
              <SelectItem key={item.label} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="py-5">
        <p className="mb-2 text-[13px] font-medium text-neutral-700">
          Price Range
        </p>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Min"
            value={draft.minPrice}
            onChange={(e) => update("minPrice", e.target.value)}
            aria-label="Minimum price"
            className="h-11 w-full min-w-0 rounded-lg px-3.5 text-[14px] text-neutral-700 ring-1 ring-neutral-300 outline-none transition-colors placeholder:text-neutral-400 hover:ring-neutral-400 focus:ring-2 focus:ring-amber-600"
          />
          <input
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Max"
            value={draft.maxPrice}
            onChange={(e) => update("maxPrice", e.target.value)}
            aria-label="Maximum price"
            className="h-11 w-full min-w-0 rounded-lg px-3.5 text-[14px] text-neutral-700 ring-1 ring-neutral-300 outline-none transition-colors placeholder:text-neutral-400 hover:ring-neutral-400 focus:ring-2 focus:ring-amber-600"
          />
        </div>
      </div>

      <div className="py-5">
        <RangePillGroup
          label="Bedrooms"
          value={draft.bedrooms}
          options={bedroomOptions}
          onChange={(value) => update("bedrooms", value)}
        />
      </div>

      <div className="py-5 last:pb-0">
        <RangePillGroup
          label="Bathrooms"
          value={draft.bathrooms}
          options={bathroomOptions}
          onChange={(value) => update("bathrooms", value)}
        />
      </div>
    </div>
  );
}

export function FilterSidebar({
  locations,
  initialFilters,
}: {
  locations: string[];
  initialFilters?: PropertyFilters;
}) {
  const reduce = useReducedMotion();
  const router = useRouter();
  const { draft, update, apply } = useFilterFormState(initialFilters);

  const hasAppliedFilters = !!(
    initialFilters?.listingType ||
    initialFilters?.propertyType ||
    initialFilters?.location ||
    initialFilters?.minPrice !== undefined ||
    initialFilters?.maxPrice !== undefined ||
    initialFilters?.bedrooms !== undefined ||
    initialFilters?.bathrooms !== undefined
  );

  return (
    <motion.aside
      {...(reduce
        ? {}
        : {
            initial: "hidden",
            animate: "visible",
            variants: fadeUp,
            transition: { duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] },
          })}
      className="hidden lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto"
    >
      <div className="rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)] ring-1 ring-neutral-200">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-[15px] font-semibold text-neutral-900">
            Filters
          </p>
          {hasAppliedFilters && (
            <button
              type="button"
              onClick={() => router.push("/properties")}
              className="text-[13px] font-medium text-amber-700 transition-colors hover:text-amber-800"
            >
              Clear all
            </button>
          )}
        </div>

        {hasAppliedFilters && (
          <FilterChips filters={initialFilters ?? {}} className="mb-6" />
        )}

        <FilterFieldGroups
          draft={draft}
          update={update}
          locations={locations}
          layoutIdPrefix="desktop"
        />

        <div className="sticky bottom-0 -mx-6 -mb-6 mt-6 rounded-b-2xl border-t border-neutral-100 bg-white px-6 py-4">
          <button
            type="button"
            onClick={apply}
            className="h-11 w-full rounded-xl bg-amber-700 text-[14px] font-semibold text-white transition-colors hover:bg-amber-800"
          >
            Show Results
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
