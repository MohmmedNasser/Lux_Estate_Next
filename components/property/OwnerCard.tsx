"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, Heart, Mail, Phone } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatPriceValue, getInitials } from "@/lib/format";
import { InquiryModal } from "@/components/property/InquiryModal";
import type { Property } from "@/types";

interface Owner {
  name: string;
  avatar?: string;
  phone?: string;
  email: string;
}

interface OwnerCardProps {
  property: Property;
  owner: Owner;
}

export function OwnerCard({ property, owner }: OwnerCardProps) {
  const reduceMotion = useReducedMotion();
  const [modalOpen, setModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const ctaRef = useRef<HTMLButtonElement>(null);

  const isRent = property.listingType === "rent";
  const ctaLabel = isRent ? "Request to Rent" : "Request a Viewing";

  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-neutral-200 shadow-[0_8px_32px_-12px_rgba(16,24,40,0.14)]">
      {/* Price */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-semibold tabular-nums text-neutral-900">
          {formatPriceValue(property.price, property.currency)}
        </span>
        {isRent && <span className="text-[15px] text-neutral-500">/mo</span>}
      </div>

      <div className="my-5 h-px bg-neutral-200" />

      {/* Owner */}
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <span className="relative grid size-12 place-items-center overflow-hidden rounded-full bg-amber-50 text-[15px] font-semibold text-amber-700 shadow-sm ring-2 ring-white">
            {owner.avatar ? (
              <Image
                src={owner.avatar}
                alt={owner.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              getInitials(owner.name)
            )}
          </span>
          <BadgeCheck
            className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-white text-amber-700"
            aria-label="Verified owner"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-neutral-900">
            {owner.name}
          </p>
          <p className="text-[13px] text-neutral-500">Property owner</p>
        </div>
      </div>

      {/* Contact rows */}
      <div className="mt-4 flex flex-col gap-2.5">
        {owner.phone && (
          <a
            href={`tel:${owner.phone}`}
            className="inline-flex items-center gap-2.5 text-[14px] text-neutral-700 transition-colors hover:text-amber-800"
          >
            <Phone className="size-4 shrink-0 text-neutral-400" aria-hidden="true" />
            {owner.phone}
          </a>
        )}
        <a
          href={`mailto:${owner.email}`}
          className="inline-flex items-center gap-2.5 text-[14px] text-neutral-700 transition-colors hover:text-amber-800"
        >
          <Mail className="size-4 shrink-0 text-neutral-400" aria-hidden="true" />
          <span className="truncate">{owner.email}</span>
        </a>
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-col gap-3">
        <motion.button
          ref={ctaRef}
          type="button"
          onClick={() => setModalOpen(true)}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-amber-700 text-[15px] font-semibold text-white transition-colors hover:bg-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
        >
          {ctaLabel}
        </motion.button>

        <button
          type="button"
          onClick={() => setSaved((value) => !value)}
          aria-pressed={saved}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl text-[15px] font-medium text-neutral-900 ring-1 ring-neutral-300 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
        >
          <Heart
            className={cn("size-4", saved && "fill-rose-600 text-rose-600")}
            aria-hidden="true"
          />
          {saved ? "Saved" : "Save"}
        </button>
      </div>

      <p className="mt-4 text-center text-[12px] text-neutral-400">
        No agent fees · Direct from owner
      </p>

      <InquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        propertyId={property.id}
        title={property.title}
        returnFocusRef={ctaRef}
      />
    </div>
  );
}
