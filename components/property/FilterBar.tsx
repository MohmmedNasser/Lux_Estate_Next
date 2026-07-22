"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { formatPropertyType } from "@/lib/format";
import type { PropertyFilters, PropertyType } from "@/types";

const propertyTypes: PropertyType[] = [
  "apartment",
  "villa",
  "house",
  "land",
  "office",
  "shop",
];

const bedroomOptions = [1, 2, 3, 4, 5];
const bathroomOptions = [1, 2, 3, 4, 5];

type ListingFilter = "all" | "buy" | "rent";

const inputClassName =
  "h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

interface FilterBarProps {
  variant: "horizontal" | "vertical";
  locations: string[];
  initialFilters?: PropertyFilters;
  className?: string;
}

export function FilterBar({
  variant,
  locations,
  initialFilters,
  className,
}: FilterBarProps) {
  const router = useRouter();
  const isVertical = variant === "vertical";

  const [listingType, setListingType] = useState<ListingFilter>(
    initialFilters?.listingType ?? "all",
  );
  const [propertyType, setPropertyType] = useState<PropertyType | "">(
    initialFilters?.propertyType ?? "",
  );
  const [location, setLocation] = useState(initialFilters?.location ?? "");
  const [minPrice, setMinPrice] = useState(
    initialFilters?.minPrice?.toString() ?? "",
  );
  const [maxPrice, setMaxPrice] = useState(
    initialFilters?.maxPrice?.toString() ?? "",
  );
  const [bedrooms, setBedrooms] = useState(
    initialFilters?.bedrooms?.toString() ?? "",
  );
  const [bathrooms, setBathrooms] = useState(
    initialFilters?.bathrooms?.toString() ?? "",
  );

  const hasActiveFilters =
    listingType !== "all" ||
    !!propertyType ||
    !!location ||
    !!minPrice ||
    !!maxPrice ||
    !!bedrooms ||
    !!bathrooms;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (listingType !== "all") params.set("listingType", listingType);
    if (propertyType) params.set("propertyType", propertyType);
    if (location) params.set("location", location);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (bathrooms) params.set("bathrooms", bathrooms);
    const qs = params.toString();
    router.push(qs ? `/properties?${qs}` : "/properties");
  }

  function handleReset() {
    setListingType("all");
    setPropertyType("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("");
    setBathrooms("");
    router.push("/properties");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "rounded-2xl bg-card p-4 shadow-lg ring-1 ring-border sm:p-6",
        isVertical
          ? "flex flex-col gap-5"
          : "flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end",
        className,
      )}
    >
      <div className="flex flex-col gap-1.5">
        <FieldLabel>Looking to</FieldLabel>
        <div className="inline-flex rounded-lg bg-secondary p-1">
          {(["all", "buy", "rent"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setListingType(option)}
              className={cn(
                "rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-colors",
                listingType === option
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <Field label="Location" className={isVertical ? undefined : "lg:w-40"}>
        <NativeSelect
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">Any location</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </NativeSelect>
      </Field>

      <Field
        label="Property Type"
        className={isVertical ? undefined : "lg:w-40"}
      >
        <NativeSelect
          value={propertyType}
          onChange={(e) =>
            setPropertyType(e.target.value as PropertyType | "")
          }
        >
          <option value="">Any type</option>
          {propertyTypes.map((type) => (
            <option key={type} value={type}>
              {formatPropertyType(type)}
            </option>
          ))}
        </NativeSelect>
      </Field>

      <Field
        label="Price Range"
        className={isVertical ? undefined : "lg:w-48"}
      >
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className={inputClassName}
            aria-label="Minimum price"
          />
          <span className="text-muted-foreground">–</span>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className={inputClassName}
            aria-label="Maximum price"
          />
        </div>
      </Field>

      <Field label="Bedrooms" className={isVertical ? undefined : "lg:w-32"}>
        <NativeSelect
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
        >
          <option value="">Any</option>
          {bedroomOptions.map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </NativeSelect>
      </Field>

      <Field label="Bathrooms" className={isVertical ? undefined : "lg:w-32"}>
        <NativeSelect
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
        >
          <option value="">Any</option>
          {bathroomOptions.map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </NativeSelect>
      </Field>

      <div
        className={cn(
          "flex items-center gap-2",
          isVertical ? "flex-col" : "lg:ml-auto",
        )}
      >
        <Button type="submit" className={cn("gap-2", isVertical && "w-full")}>
          <Search className="size-4" />
          Search
        </Button>
        {isVertical && hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            className="w-full gap-2 text-muted-foreground"
          >
            <RotateCcw className="size-3.5" />
            Clear filters
          </Button>
        )}
      </div>
    </form>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </span>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <FieldLabel>{label}</FieldLabel>
      {children}
    </div>
  );
}
