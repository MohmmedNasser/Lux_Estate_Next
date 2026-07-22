"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { FeaturedPropertyCard } from "@/components/property/FeaturedPropertyCard";
import type { Property } from "@/types";

export function SimilarProperties({ properties }: { properties: Property[] }) {
  const reduceMotion = useReducedMotion();

  if (properties.length === 0) return null;

  return (
    <section className="pt-16 lg:pt-20">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-[-0.02em] text-neutral-900">
          Similar properties
        </h2>
        <Link
          href="/properties"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
        >
          View all
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <motion.div
        variants={reduceMotion ? undefined : stagger(0.07)}
        initial={reduceMotion ? false : "hidden"}
        whileInView={reduceMotion ? undefined : "visible"}
        viewport={viewportOnce}
        className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
      >
        {properties.map((property) => (
          <motion.div key={property.id} variants={reduceMotion ? undefined : fadeUp}>
            <FeaturedPropertyCard property={property} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
