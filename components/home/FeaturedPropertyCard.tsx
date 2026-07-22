import Image from "next/image";
import { Bath, BedDouble, MapPin, Ruler } from "lucide-react";

import { formatPrice, formatSize } from "@/lib/format";
import type { Property } from "@/types";

export function FeaturedPropertyCard({ property }: { property: Property }) {
  return (
    <div className="w-72 rounded-2xl border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-xl">
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl">
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          sizes="288px"
          className="object-cover"
        />
        <span className="absolute left-2 top-2 rounded-full bg-amber-500/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-950">
          Featured
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-1 px-1 pb-1">
        <p className="text-lg font-bold tabular-nums tracking-tight text-white">
          {formatPrice(property.price, property.currency, property.listingType)}
        </p>
        <p className="flex items-center gap-1 text-xs text-white/70">
          <MapPin className="size-3.5 shrink-0 text-amber-500" />
          {property.location}
        </p>
        <div className="mt-1 flex items-center gap-3 text-xs text-white/70">
          <span className="flex items-center gap-1">
            <BedDouble className="size-3.5" />
            {property.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="size-3.5" />
            {property.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <Ruler className="size-3.5" />
            {formatSize(property.size)}
          </span>
        </div>
      </div>
    </div>
  );
}
