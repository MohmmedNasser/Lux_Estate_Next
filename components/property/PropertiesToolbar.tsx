"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";

import { cn } from "@/lib/utils";
import { NativeSelect } from "@/components/ui/native-select";

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function PropertiesToolbar({
  sortBy,
  view,
}: {
  sortBy: string;
  view: "grid" | "list";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <NativeSelect
        value={sortBy}
        onChange={(e) => updateParam("sortBy", e.target.value)}
        className="sm:w-56"
        aria-label="Sort properties"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </NativeSelect>

      <div className="inline-flex self-start rounded-lg bg-secondary p-1 sm:self-auto">
        <button
          type="button"
          onClick={() => updateParam("view", "grid")}
          aria-label="Grid view"
          aria-pressed={view === "grid"}
          className={cn(
            "flex size-8 items-center justify-center rounded-md transition-colors",
            view === "grid"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <LayoutGrid className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => updateParam("view", "list")}
          aria-label="List view"
          aria-pressed={view === "list"}
          className={cn(
            "flex size-8 items-center justify-center rounded-md transition-colors",
            view === "list"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <List className="size-4" />
        </button>
      </div>
    </div>
  );
}
