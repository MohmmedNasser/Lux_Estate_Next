import Image from "next/image";
import { Bath, BedDouble, Building2, Ruler } from "lucide-react";

import { formatPriceValue, formatSize, getInitials } from "@/lib/format";
import type { Property } from "@/types";

interface PropertyOverviewProps {
  property: Property;
  ownerName: string;
  ownerAvatar?: string;
  typeLabel: string;
}

export function PropertyOverview({
  property,
  ownerName,
  ownerAvatar,
  typeLabel,
}: PropertyOverviewProps) {
  const isRent = property.listingType === "rent";

  const specs: { label: string; value: string; node: React.ReactNode; icon: typeof Ruler }[] =
    [];
  if (property.bedrooms > 0) {
    specs.push({
      label: "Bedrooms",
      value: `${property.bedrooms} bedrooms`,
      node: (
        <>
          <b className="font-medium text-neutral-900">{property.bedrooms}</b>{" "}
          bedrooms
        </>
      ),
      icon: BedDouble,
    });
  }
  if (property.bathrooms > 0) {
    specs.push({
      label: "Bathrooms",
      value: `${property.bathrooms} bathrooms`,
      node: (
        <>
          <b className="font-medium text-neutral-900">{property.bathrooms}</b>{" "}
          bathrooms
        </>
      ),
      icon: Bath,
    });
  }
  specs.push({
    label: "Size",
    value: formatSize(property.size),
    node: (
      <>
        <b className="font-medium text-neutral-900">{formatSize(property.size)}</b>
      </>
    ),
    icon: Ruler,
  });
  specs.push({
    label: "Property type",
    value: typeLabel,
    node: <b className="font-medium text-neutral-900">{typeLabel}</b>,
    icon: Building2,
  });

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tabular-nums tracking-tight text-neutral-900">
          {formatPriceValue(property.price, property.currency)}
        </span>
        {isRent && <span className="text-base text-neutral-500">/mo</span>}
      </div>

      <div className="mt-3 flex items-center gap-2.5">
        <span className="relative grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-amber-50 text-[11px] font-semibold text-amber-700">
          {ownerAvatar ? (
            <Image
              src={ownerAvatar}
              alt=""
              fill
              sizes="32px"
              className="object-cover"
            />
          ) : (
            getInitials(ownerName)
          )}
        </span>
        <p className="text-[14px] text-neutral-600">
          Listed by <span className="font-medium text-neutral-900">{ownerName}</span>
        </p>
      </div>

      <dl className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[15px] text-neutral-700">
        {specs.map((spec) => (
          <div key={spec.label} className="flex items-center gap-2">
            <dt className="sr-only">{spec.label}</dt>
            <spec.icon
              className="h-[18px] w-[18px] shrink-0 text-neutral-400"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <dd>{spec.node}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
