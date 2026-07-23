"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterChips } from "@/components/properties/FilterChips";
import {
  FilterFieldGroups,
  useFilterFormState,
  type FilterDraft,
} from "@/components/properties/FilterSidebar";
import { getProperties } from "@/lib/actions/property.actions";
import type { PropertyFilters } from "@/types";

const PREVIEW_DEBOUNCE_MS = 300;

function draftToFilters(draft: FilterDraft): PropertyFilters {
  return {
    listingType: draft.listingType === "all" ? undefined : draft.listingType,
    propertyType: draft.propertyType || undefined,
    location: draft.location || undefined,
    minPrice: draft.minPrice ? Number(draft.minPrice) : undefined,
    maxPrice: draft.maxPrice ? Number(draft.maxPrice) : undefined,
    bedrooms: draft.bedrooms ? Number(draft.bedrooms) : undefined,
    bathrooms: draft.bathrooms ? Number(draft.bathrooms) : undefined,
  };
}

function usePreviewCount(draft: FilterDraft, initialCount: number) {
  const [count, setCount] = useState(initialCount);
  const draftKey = JSON.stringify(draft);

  useEffect(() => {
    let cancelled = false;

    const timeout = window.setTimeout(async () => {
      try {
        const result = await getProperties(draftToFilters(draft), 1, 1);
        if (!cancelled) setCount(result.total);
      } catch {
        // Keep showing the last known count rather than an error inside the
        // sheet footer — the user can still tap the button and see a proper
        // error/empty state on the results page itself.
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, PREVIEW_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey]);

  return count;
}

export function MobileFilterSheet({
  locations,
  initialFilters,
  total,
}: {
  locations: string[];
  initialFilters?: PropertyFilters;
  total: number;
}) {
  const [open, setOpen] = useState(false);
  const { draft, update, apply } = useFilterFormState(initialFilters);

  const activeCount = [
    initialFilters?.listingType,
    initialFilters?.propertyType,
    initialFilters?.location,
    initialFilters?.minPrice,
    initialFilters?.maxPrice,
    initialFilters?.bedrooms,
    initialFilters?.bathrooms,
  ].filter((value) => value !== undefined && value !== "").length;

  const previewCount = usePreviewCount(draft, total);

  function handleApply() {
    apply();
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="relative inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-[14px] font-medium text-neutral-700 ring-1 ring-neutral-300 transition-colors hover:bg-neutral-50">
        <SlidersHorizontal className="size-4" aria-hidden="true" />
        Filters
        {activeCount > 0 && (
          <span className="grid size-5 place-items-center rounded-full bg-amber-700 text-[11px] font-semibold text-white">
            {activeCount}
          </span>
        )}
      </SheetTrigger>

      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="max-h-[85vh] rounded-t-2xl border-none p-0"
      >
        <div
          aria-hidden="true"
          className="mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full bg-neutral-200"
        />

        <SheetHeader className="px-6 pb-2 pt-2">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6">
          <FilterChips filters={initialFilters ?? {}} className="mb-4" />
          <FilterFieldGroups
            draft={draft}
            update={update}
            locations={locations}
            layoutIdPrefix="mobile"
          />
        </div>

        <SheetFooter className="border-t border-neutral-100 px-6 py-4">
          <button
            type="button"
            onClick={handleApply}
            className="h-11 w-full rounded-xl bg-amber-700 text-[14px] font-semibold text-white transition-colors hover:bg-amber-800"
          >
            Show {previewCount} results
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
