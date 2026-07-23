"use client";

import { motion, useReducedMotion } from "framer-motion";
import { KeyRound, MessageCircle, Search, type LucideIcon } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

const steps: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Browse Properties",
    description:
      "Search by location, price, and property type to find places that match what you're looking for.",
    icon: Search,
  },
  {
    title: "Contact the Owner",
    description:
      "Send an inquiry straight from the listing and ask about a viewing, pricing, or anything else.",
    icon: MessageCircle,
  },
  {
    title: "Move In",
    description:
      "Agree on the details with the owner and move into your new home or business space.",
    icon: KeyRound,
  },
];

export function HowItWorks() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-[#F5F3EF] py-20 sm:py-24 lg:py-32">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">
            How It Works
          </p>
          <h2 className="mt-2 text-[clamp(1.6rem,3.2vw,2.5rem)] font-bold tracking-tight text-neutral-900">
            Three simple steps to your next place
          </h2>
        </div>

        <motion.div
          {...(reduce
            ? {}
            : {
                initial: "hidden",
                whileInView: "visible",
                viewport: viewportOnce,
                variants: stagger(0.12),
              })}
          className="relative isolate mt-14 grid grid-cols-1 gap-10 lg:mt-16 lg:grid-cols-3 lg:gap-10"
        >
          <div
            aria-hidden="true"
            className="absolute left-[16%] right-[16%] top-[3.75rem] -z-10 hidden border-t border-dashed border-neutral-300 lg:block"
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              variants={reduce ? undefined : fadeUp}
              className="group relative flex flex-col items-start text-left lg:items-center lg:text-center"
            >
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="mb-6 h-6 w-px border-l border-dashed border-neutral-300 lg:hidden"
                />
              )}
              <span className="text-[11px] tracking-[0.22em] text-neutral-400 tabular-nums">
                0{i + 1}
              </span>
              <div className="mt-4 grid size-14 place-items-center rounded-full bg-white text-amber-700 shadow-sm ring-1 ring-amber-100 transition-[transform,box-shadow] duration-300 group-hover:scale-[1.08] group-hover:ring-amber-300">
                <step.icon className="size-6" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-neutral-900">
                {step.title}
              </h3>
              <p className="mt-2 max-w-[34ch] text-[14px] leading-relaxed text-neutral-600">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
