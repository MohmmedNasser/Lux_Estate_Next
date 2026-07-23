"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { Container } from "@/components/layout/Container";
import { scaleIn, viewportOnce } from "@/lib/motion";

export function CtaBanner() {
  const reduce = useReducedMotion();

  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <Container>
        <motion.div
          {...(reduce
            ? {}
            : {
                initial: "hidden",
                whileInView: "visible",
                viewport: viewportOnce,
                variants: scaleIn,
              })}
          className="relative isolate overflow-hidden rounded-3xl bg-neutral-900 px-6 py-16 text-center ring-1 ring-white/10 sm:px-12 sm:py-20 lg:py-24"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(180,83,9,0.22),transparent_70%)]"
          />

          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-tight text-white">
            Have a property to list?
          </h2>
          <p className="mx-auto mt-4 max-w-[52ch] text-white/65">
            Publish your listing in minutes and reach buyers and renters
            actively searching in your area.
          </p>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="mt-8 inline-block"
          >
            <Link
              href="/properties/add"
              className="flex h-11 items-center justify-center rounded-full bg-amber-700 px-7 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
            >
              Add Your Property
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
