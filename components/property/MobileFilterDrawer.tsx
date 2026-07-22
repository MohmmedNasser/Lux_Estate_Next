import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterBar } from "@/components/property/FilterBar";
import type { PropertyFilters } from "@/types";

export function MobileFilterDrawer({
  locations,
  initialFilters,
}: {
  locations: string[];
  initialFilters?: PropertyFilters;
}) {
  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant="outline" className="w-full gap-2 lg:hidden" />}
      >
        <SlidersHorizontal className="size-4" />
        Filters
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Properties</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-6">
          <FilterBar
            variant="vertical"
            locations={locations}
            initialFilters={initialFilters}
            className="p-0 shadow-none ring-0"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
