"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Container } from "@/components/layout/Container";
import { fadeUp, stagger } from "@/lib/motion";

const stats = [
  { value: "12,400+", label: "listings" },
  { value: "3,200+", label: "owners" },
  { value: "48", label: "states" },
];

export function AboutHero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-neutral-950 py-24 sm:py-28 lg:py-36">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_50%_0%,rgba(180,83,9,0.22),transparent_70%)]"
      />

      <Container>
        <motion.div
          {...(reduce
            ? {}
            : {
                initial: "hidden",
                animate: "visible",
                variants: stagger(0.08),
              })}
          className="mx-auto max-w-[720px] text-center"
        >
          <motion.p
            variants={reduce ? undefined : fadeUp}
            className="mb-4 text-[11px] uppercase tracking-[0.22em] text-amber-500"
          >
            About Lux Estate
          </motion.p>

          <motion.h1
            variants={reduce ? undefined : fadeUp}
            className="text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-white"
          >
            Real estate, without the runaround
          </motion.h1>

          <motion.p
            variants={reduce ? undefined : fadeUp}
            className="mx-auto mt-5 max-w-[52ch] text-[17px] leading-relaxed text-white/65"
          >
            We built Lux Estate to make finding, listing, and renting a home
            refreshingly simple — no agents required, no hidden fees, no
            clutter.
          </motion.p>

          <motion.div
            variants={reduce ? undefined : fadeUp}
            className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-4 sm:gap-x-10"
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-semibold tabular-nums text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-[13px] text-white/50">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
