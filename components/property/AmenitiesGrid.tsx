import {
  ArrowUpDown,
  Car,
  Check,
  Snowflake,
  Sofa,
  ShieldCheck,
  Trees,
  Waves,
  Wind,
  type LucideIcon,
} from "lucide-react";

import { formatAmenity } from "@/lib/format";

// Real icons per amenity — never a generic check for everything.
const amenityIcons: Record<string, LucideIcon> = {
  parking: Car,
  garden: Trees,
  balcony: Wind,
  "air conditioning": Snowflake,
  elevator: ArrowUpDown,
  security: ShieldCheck,
  pool: Waves,
  furnished: Sofa,
};

export function AmenitiesGrid({ amenities }: { amenities: string[] }) {
  if (amenities.length === 0) {
    return (
      <p className="text-[14.5px] text-neutral-500">
        No amenities listed for this property.
      </p>
    );
  }

  return (
    // The mock data caps amenities at 5, so the full set always fits; a
    // "show all N" modal would be unreachable dead code and is intentionally
    // omitted until listings can carry more than 8 amenities.
    <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
      {amenities.map((amenity) => {
        const Icon = amenityIcons[amenity] ?? Check;
        return (
          <div key={amenity} className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-neutral-100 text-neutral-700">
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <span className="text-[14.5px] text-neutral-700">
              {formatAmenity(amenity)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
