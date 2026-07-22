"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { FeaturedPropertyCard } from "@/components/property/FeaturedPropertyCard";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import type { Property } from "@/types";

export function FeaturedProperties({
  properties,
}: {
  properties: Property[];
}) {
  const reduce = useReducedMotion();

  return (
    <section className="pt-20 pb-20 sm:pt-24 sm:pb-24 lg:pt-32 lg:pb-32">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">
              Handpicked
            </p>
            <h2 className="mt-2 text-[clamp(1.6rem,3.2vw,2.5rem)] font-bold tracking-tight text-neutral-900">
              Featured Properties
            </h2>
          </div>
          <Link
            href="/properties"
            className="group inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full px-5 text-sm font-medium ring-1 ring-neutral-300 transition-colors hover:bg-neutral-900 hover:text-white hover:ring-neutral-900 sm:h-auto sm:w-auto sm:py-2.5"
          >
            View All Properties
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <motion.div
          {...(reduce
            ? {}
            : {
                initial: "hidden",
                whileInView: "visible",
                viewport: viewportOnce,
                variants: stagger(0.07),
              })}
          className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7"
        >
          {properties.map((property) => (
            <motion.div
              key={property.id}
              variants={reduce ? undefined : fadeUp}
              className="h-full"
            >
              <FeaturedPropertyCard property={property} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
