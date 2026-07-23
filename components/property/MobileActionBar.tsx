"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { formatPriceValue, formatSize } from "@/lib/format";
import { InquiryModal } from "@/components/property/InquiryModal";
import type { Property } from "@/types";

export function MobileActionBar({ property }: { property: Property }) {
  const reduceMotion = useReducedMotion();
  const [modalOpen, setModalOpen] = useState(false);
  const ctaRef = useRef<HTMLButtonElement>(null);

  const isRent = property.listingType === "rent";
  const detail =
    property.bedrooms > 0
      ? `${property.bedrooms} bd · ${property.bathrooms} ba`
      : formatSize(property.size);

  return (
    <motion.div
      initial={reduceMotion ? false : { y: "100%" }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-neutral-200 bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden"
    >
      <div className="min-w-0">
        <p className="flex items-baseline gap-1 text-lg font-semibold tabular-nums text-neutral-900">
          {formatPriceValue(property.price, property.currency)}
          {isRent && <span className="text-[13px] font-normal text-neutral-500">/mo</span>}
        </p>
        <p className="truncate text-[12px] text-neutral-500">{detail}</p>
      </div>

      <button
        ref={ctaRef}
        type="button"
        onClick={() => setModalOpen(true)}
        className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-amber-700 px-6 text-[14px] font-semibold text-white transition-colors hover:bg-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
      >
        {isRent ? "Request to Rent" : "Request Viewing"}
      </button>

      <InquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        propertyId={property.id}
        title={property.title}
        returnFocusRef={ctaRef}
      />
    </motion.div>
  );
}
