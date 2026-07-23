"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Bath, BedDouble, Heart, MapPin, Ruler } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatPriceValue, formatSize } from "@/lib/format";
import type { Property } from "@/types";

export function PropertyCardHorizontal({ property }: { property: Property }) {
  const prefersReducedMotion = useReducedMotion();
  const [isFavorited, setIsFavorited] = useState(false);
  const isRent = property.listingType === "rent";
  const hasBedrooms = property.bedrooms > 0;

  function handleToggleFavorite(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    setIsFavorited((value) => !value);
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200/80 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[box-shadow,transform,ring-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(16,24,40,0.16)] hover:ring-neutral-300 sm:flex-row">
      <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden bg-neutral-100 sm:aspect-square sm:w-64">
        <Image
          src={property.images[0]}
          alt={`${property.title} in ${property.location}`}
          fill
          sizes="(min-width: 640px) 256px, 100vw"
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
        />

        <span
          className={cn(
            "absolute left-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white ring-1 backdrop-blur-md",
            isRent
              ? "bg-amber-700/85 ring-amber-300/25"
              : "bg-neutral-900/80 ring-white/15",
          )}
        >
          <span aria-hidden="true" className="size-1.5 rounded-full bg-white/90" />
          {isRent ? "For Rent" : "For Sale"}
        </span>

        <motion.button
          type="button"
          onClick={handleToggleFavorite}
          aria-pressed={isFavorited}
          aria-label={
            isFavorited ? "Remove from favorites" : "Save to favorites"
          }
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className={cn(
            "absolute right-3 top-3 z-20 grid size-9 place-items-center rounded-full bg-white/90 text-neutral-600 ring-1 ring-black/5 backdrop-blur-md transition-colors hover:bg-white hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500",
            isFavorited && "text-rose-600",
          )}
        >
          <motion.span
            key={isFavorited ? "favorited" : "unfavorited"}
            className="grid place-items-center"
            initial={prefersReducedMotion ? false : { scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 12 }}
          >
            <Heart
              aria-hidden="true"
              className={cn("size-4", isFavorited && "fill-rose-600")}
            />
          </motion.span>
        </motion.button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-[15.5px] font-medium leading-snug text-neutral-900 transition-colors group-hover:text-amber-800">
            {property.title}
          </h3>
          <span className="shrink-0 text-[16px] font-semibold tabular-nums tracking-[-0.01em] text-neutral-900">
            {formatPriceValue(property.price, property.currency)}
            {isRent && (
              <span className="ml-0.5 text-[12px] font-normal text-neutral-500">
                /mo
              </span>
            )}
          </span>
        </div>

        <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-neutral-500">
          <MapPin
            aria-hidden="true"
            className="size-3.5 shrink-0 text-neutral-400"
          />
          <span className="line-clamp-1">{property.location}</span>
        </p>

        <p className="mt-3 line-clamp-2 text-[13.5px] leading-relaxed text-neutral-600">
          {property.description}
        </p>

        <div className="mt-4 h-px bg-neutral-100" />

        <div className="mt-3.5 flex items-center gap-x-5 text-[13px] text-neutral-600">
          {hasBedrooms && (
            <span
              className="inline-flex shrink-0 items-center gap-1.5"
              aria-label={`${property.bedrooms} bedrooms`}
            >
              <BedDouble
                aria-hidden="true"
                className="size-4 shrink-0 text-neutral-400"
                strokeWidth={1.75}
              />
              <span className="font-medium tabular-nums text-neutral-800">
                {property.bedrooms}
              </span>
              <span className="hidden text-neutral-500 xs:inline">beds</span>
            </span>
          )}

          <span
            className="inline-flex shrink-0 items-center gap-1.5"
            aria-label={`${property.bathrooms} bathrooms`}
          >
            <Bath
              aria-hidden="true"
              className="size-4 shrink-0 text-neutral-400"
              strokeWidth={1.75}
            />
            <span className="font-medium tabular-nums text-neutral-800">
              {property.bathrooms}
            </span>
            <span className="hidden text-neutral-500 xs:inline">baths</span>
          </span>

          <span
            className="ml-auto inline-flex shrink-0 items-center gap-1.5"
            aria-label={`${formatSize(property.size)} of living space`}
          >
            <Ruler
              aria-hidden="true"
              className="size-4 shrink-0 text-neutral-400"
              strokeWidth={1.75}
            />
            <span className="font-medium tabular-nums text-neutral-800">
              {formatSize(property.size)}
            </span>
          </span>
        </div>
      </div>

      <Link
        href={`/properties/${property.id}`}
        className="absolute inset-0 z-10 rounded-2xl"
        aria-label={`View ${property.title} in ${property.location}`}
      />
    </article>
  );
}
