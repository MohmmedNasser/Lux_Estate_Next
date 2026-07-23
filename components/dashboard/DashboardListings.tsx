"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { PlusCircle, SearchX } from "lucide-react";

import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { ListingCard } from "@/components/dashboard/ListingCard";
import type { Property } from "@/types";

export function DashboardListings({
  initialListings,
}: {
  initialListings: Property[];
}) {
  const reduce = useReducedMotion();
  const [listings, setListings] = useState(initialListings);

  function handleDelete(id: string) {
    console.log("Property deleted", { id });
    setListings((current) => current.filter((property) => property.id !== id));
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <div className="mb-5 grid size-14 place-items-center rounded-full bg-neutral-100 text-neutral-400">
          <SearchX className="size-6" aria-hidden="true" />
        </div>
        <h3 className="text-[17px] font-semibold text-neutral-900">
          You haven&apos;t listed anything yet
        </h3>
        <p className="mt-2 max-w-[38ch] text-[14px] text-neutral-500">
          Publish your first property to start reaching buyers and renters.
        </p>
        <Link
          href="/properties/add"
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 text-[14px] font-semibold text-white transition-colors hover:bg-neutral-800"
        >
          <PlusCircle className="size-4" aria-hidden="true" />
          Add Property
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      {...(reduce
        ? {}
        : {
            initial: "hidden",
            whileInView: "visible",
            viewport: viewportOnce,
            variants: stagger(0.08),
          })}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
    >
      {listings.map((property) => (
        <motion.div
          key={property.id}
          variants={reduce ? undefined : fadeUp}
          className="h-full"
        >
          <ListingCard property={property} onDelete={handleDelete} />
        </motion.div>
      ))}
    </motion.div>
  );
}
