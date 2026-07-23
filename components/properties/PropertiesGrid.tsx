"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2, SearchX } from "lucide-react";

import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { FeaturedPropertyCard } from "@/components/property/FeaturedPropertyCard";
import { PropertyCardHorizontal } from "@/components/property/PropertyCardHorizontal";
import { PropertyCardSkeleton } from "@/components/property/PropertyCardSkeleton";
import type { Property } from "@/types";

const PAGE_SIZE = 9;
const LOAD_DELAY = 500;

export function PropertiesGrid({
  properties,
  view,
}: {
  properties: Property[];
  view: "grid" | "list";
}) {
  const reduce = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);

  if (properties.length === 0) {
    return (
      <motion.div
        {...(reduce
          ? {}
          : { initial: "hidden", animate: "visible", variants: fadeUp })}
        className="flex flex-col items-center py-20 text-center"
      >
        <div className="mb-5 grid size-14 place-items-center rounded-full bg-neutral-100 text-neutral-400">
          <SearchX className="size-6" aria-hidden="true" />
        </div>
        <h3 className="text-[17px] font-semibold text-neutral-900">
          No properties match your filters
        </h3>
        <p className="mt-2 max-w-[38ch] text-[14px] text-neutral-500">
          Try adjusting your price range or clearing a few filters to see
          more results.
        </p>
        <Link
          href="/properties"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-neutral-900 px-6 text-[14px] font-semibold text-white transition-colors hover:bg-neutral-800"
        >
          Clear all filters
        </Link>
      </motion.div>
    );
  }

  const visible = properties.slice(0, visibleCount);
  const initialBatch = visible.slice(0, PAGE_SIZE);
  const extraBatch = visible.slice(PAGE_SIZE);
  const hasMore = visibleCount < properties.length;

  function handleLoadMore() {
    setLoading(true);
    window.setTimeout(() => {
      setVisibleCount((count) => count + PAGE_SIZE);
      setLoading(false);
    }, LOAD_DELAY);
  }

  const CardComponent =
    view === "grid" ? FeaturedPropertyCard : PropertyCardHorizontal;
  const gridClass =
    view === "grid"
      ? "grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2 lg:gap-7 xl:grid-cols-3"
      : "flex flex-col gap-5";

  return (
    <div className="flex flex-col gap-8">
      <motion.div
        {...(reduce
          ? {}
          : {
              initial: "hidden",
              whileInView: "visible",
              viewport: viewportOnce,
              variants: stagger(0.06),
            })}
        className={gridClass}
      >
        {initialBatch.map((property) => (
          <motion.div
            key={property.id}
            variants={reduce ? undefined : fadeUp}
            className={view === "grid" ? "h-full" : undefined}
          >
            <CardComponent property={property} />
          </motion.div>
        ))}
      </motion.div>

      {extraBatch.length > 0 && (
        <motion.div
          initial={reduce ? false : "hidden"}
          animate="visible"
          variants={reduce ? undefined : stagger(0.05)}
          className={gridClass}
        >
          {extraBatch.map((property) => (
            <motion.div
              key={property.id}
              variants={reduce ? undefined : fadeUp}
              className={view === "grid" ? "h-full" : undefined}
            >
              <CardComponent property={property} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {loading && view === "grid" && (
        <div className={gridClass}>
          {Array.from({
            length: Math.min(PAGE_SIZE, properties.length - visibleCount),
          }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      )}

      {(hasMore || loading) && (
        <div className="mt-4 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loading}
            aria-busy={loading}
            className="flex h-11 w-40 items-center justify-center rounded-full px-8 text-[14px] font-semibold text-neutral-900 ring-1 ring-neutral-300 transition-colors hover:bg-neutral-50 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              "Load More"
            )}
          </button>
          <p className="text-[13px] text-neutral-500">
            Showing {visible.length} of {properties.length} properties
          </p>
        </div>
      )}
    </div>
  );
}
