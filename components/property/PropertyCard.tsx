import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, MapPin, Ruler } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatPrice, formatSize } from "@/lib/format";
import type { Property } from "@/types";

export function PropertyCard({ property }: { property: Property }) {
  const isRent = property.listingType === "rent";

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:-translate-y-1 focus-visible:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white",
            isRent ? "bg-primary" : "bg-foreground",
          )}
        >
          {isRent ? "For Rent" : "For Sale"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-lg font-bold tabular-nums tracking-tight text-foreground">
          {formatPrice(property.price, property.currency, property.listingType)}
        </p>
        <h3 className="truncate text-base font-semibold text-foreground">
          {property.title}
        </h3>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0 text-primary" />
          <span className="truncate">{property.location}</span>
        </p>

        <div className="mt-auto flex items-center gap-2 pt-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <BedDouble className="size-4" />
            {property.bedrooms}
          </span>
          <span className="size-1 shrink-0 rounded-full bg-primary/50" />
          <span className="flex items-center gap-1">
            <Bath className="size-4" />
            {property.bathrooms}
          </span>
          <span className="size-1 shrink-0 rounded-full bg-primary/50" />
          <span className="flex items-center gap-1">
            <Ruler className="size-4" />
            {formatSize(property.size)}
          </span>
        </div>
      </div>
    </Link>
  );
}
