"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { Container } from "@/components/layout/Container";
import { fadeUp, scaleIn, stagger, viewportOnce } from "@/lib/motion";

export function WhyWeStarted() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-white py-20 sm:py-24 lg:py-32">
      <Container>
        <motion.div
          {...(reduce
            ? {}
            : {
                initial: "hidden",
                whileInView: "visible",
                viewport: viewportOnce,
                variants: stagger(0.15),
              })}
          className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16"
        >
          <motion.div
            variants={reduce ? undefined : fadeUp}
            className="order-2 lg:order-1"
          >
            <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-amber-700">
              Why we started this
            </p>
            <h2 className="text-[clamp(1.6rem,3vw,2.25rem)] font-semibold tracking-tight text-neutral-900">
              Most listings bury what you actually need to know
            </h2>

            <div className="mt-5 space-y-4 text-[15.5px] leading-[1.75] text-neutral-600">
              <p>
                Most real estate sites bury the listing you actually want
                behind logins, pop-ups, and pushy agent forms. We wanted
                something simpler: browse freely, see real details up front,
                and talk directly to the person who owns the place.
              </p>
              <p>
                Lux Estate connects buyers, renters, and property owners
                directly. List a property in minutes. Search by exactly what
                matters to you. Reach out with one message.
              </p>
            </div>

            <blockquote className="mt-6 border-l-2 border-amber-700 pl-4 text-[15px] italic text-neutral-700">
              &ldquo;No middleman required.&rdquo;
            </blockquote>
          </motion.div>

          <motion.div
            variants={reduce ? undefined : scaleIn}
            className="relative order-1 aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-[0_24px_48px_-16px_rgba(16,24,40,0.18)] lg:order-2 lg:aspect-[3/4]"
          >
            <Image
              src="https://picsum.photos/seed/lux-estate-about/1200/1600"
              alt="A bright, modern living space"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />

            <div className="absolute -bottom-6 -left-6 hidden rounded-xl bg-white p-4 shadow-lg ring-1 ring-neutral-100 sm:block">
              <p className="text-[13px] font-medium text-neutral-900">
                Founded 2024 · Austin, TX
              </p>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
