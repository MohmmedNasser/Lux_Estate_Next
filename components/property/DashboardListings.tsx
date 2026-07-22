"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DashboardListingCard } from "@/components/property/DashboardListingCard";
import type { Property } from "@/types";

export function DashboardListings({
  initialListings,
}: {
  initialListings: Property[];
}) {
  const [listings, setListings] = useState(initialListings);

  function handleDelete(id: string) {
    console.log("Property deleted", { id });
    setListings((current) => current.filter((property) => property.id !== id));
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-secondary/30 px-6 py-20 text-center">
        <h3 className="text-lg font-semibold text-foreground">
          You have no listings yet
        </h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Publish your first property to start reaching buyers and renters.
        </p>
        <Button className="mt-2" render={<Link href="/properties/add" />}>
          Add Your First Property
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((property) => (
        <DashboardListingCard
          key={property.id}
          property={property}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
