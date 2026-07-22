"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { PropertyList } from "@/components/property/PropertyList";
import type { Property } from "@/types";

const PAGE_SIZE = 9;

export function PropertyResults({
  properties,
  view,
}: {
  properties: Property[];
  view: "grid" | "list";
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = properties.slice(0, visibleCount);
  const hasMore = visibleCount < properties.length;

  return (
    <div className="flex flex-col gap-8">
      {view === "list" ? (
        <PropertyList properties={visible} />
      ) : (
        <PropertyGrid properties={visible} />
      )}
      {hasMore && (
        <Button
          variant="outline"
          onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          className="mx-auto"
        >
          Load More
        </Button>
      )}
    </div>
  );
}
