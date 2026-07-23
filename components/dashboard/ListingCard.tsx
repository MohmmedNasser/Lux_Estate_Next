"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, MapPin, Pencil, Ruler, Tag, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatPriceValue, formatPropertyType, formatSize } from "@/lib/format";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Property } from "@/types";

export function ListingCard({
  property,
  onDelete,
}: {
  property: Property;
  onDelete: (id: string) => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isRent = property.listingType === "rent";
  const isBareLand = property.bedrooms === 0 && property.bathrooms === 0;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200/80 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[box-shadow,transform,ring-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(16,24,40,0.16)] hover:ring-neutral-300">
      <Link
        href={`/properties/${property.id}`}
        className="relative block aspect-16/11 w-full overflow-hidden bg-neutral-100"
      >
        <Image
          src={property.images[0]}
          alt={`${property.title} in ${property.location}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-neutral-950/55 via-neutral-950/10 to-transparent"
        />

        <span
          className={cn(
            "absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white ring-1 backdrop-blur-md",
            isRent
              ? "bg-amber-700/85 ring-amber-300/25"
              : "bg-neutral-900/80 ring-white/15",
          )}
        >
          <span aria-hidden="true" className="size-1.5 rounded-full bg-white/90" />
          {isRent ? "For Rent" : "For Sale"}
        </span>

        <div className="absolute bottom-4 left-4 text-white">
          <span className="text-[22px] font-semibold tracking-[-0.02em] tabular-nums drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
            {formatPriceValue(property.price, property.currency)}
          </span>
          {isRent && (
            <span className="ml-0.5 text-[13px] font-normal text-white/75">
              /mo
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link
          href={`/properties/${property.id}`}
          className="line-clamp-1 text-[15.5px] font-medium leading-snug text-neutral-900 transition-colors hover:text-amber-800"
        >
          {property.title}
        </Link>

        <p className="mt-2 flex items-center gap-1.5 text-[13px] text-neutral-500">
          <MapPin
            aria-hidden="true"
            className="size-3.5 shrink-0 text-neutral-400"
          />
          <span className="line-clamp-1">{property.location}</span>
        </p>

        <div className="mt-4 h-px bg-neutral-100" />

        <div className="mt-3.5 flex items-center gap-x-5 text-[13px] text-neutral-600">
          {isBareLand ? (
            <span
              className="inline-flex shrink-0 items-center gap-1.5"
              aria-label={formatPropertyType(property.propertyType)}
            >
              <Tag
                aria-hidden="true"
                className="size-4 shrink-0 text-neutral-400"
                strokeWidth={1.75}
              />
              <span className="font-medium text-neutral-800">
                {formatPropertyType(property.propertyType)}
              </span>
            </span>
          ) : (
            <>
              {property.bedrooms > 0 && (
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
                  <span className="hidden text-neutral-500 xs:inline">
                    beds
                  </span>
                </span>
              )}

              {property.bathrooms > 0 && (
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
                  <span className="hidden text-neutral-500 xs:inline">
                    baths
                  </span>
                </span>
              )}
            </>
          )}

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

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href={`/properties/${property.id}/edit`}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg text-[13px] font-medium text-neutral-700 ring-1 ring-neutral-300 transition-colors hover:bg-neutral-50"
          >
            <Pencil className="size-3.5" aria-hidden="true" />
            Edit
          </Link>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg text-[13px] font-medium text-rose-600 ring-1 ring-rose-200 transition-colors hover:bg-rose-50"
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            Delete
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this listing?"
        description={`This will permanently remove "${property.title}" from Lux Estate. This can't be undone.`}
        confirmLabel="Confirm Delete"
        onConfirm={() => onDelete(property.id)}
      />
    </article>
  );
}
