"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Eye, ShieldCheck, Sparkles, Users, type LucideIcon } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

const values: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Transparency",
    description:
      "Every listing shows the real price, real photos, and real contact details — no surprises after you've fallen in love with the place.",
    icon: Eye,
  },
  {
    title: "Simplicity",
    description:
      "From your first search to publishing a listing, every flow takes a few steps, not a few days.",
    icon: Sparkles,
  },
  {
    title: "Direct Access",
    description:
      "Talk straight to property owners. No agent fees, no waiting on hold, no forwarded messages.",
    icon: Users,
  },
  {
    title: "Trust",
    description:
      "We built the platform around clear information, so you can make decisions with confidence.",
    icon: ShieldCheck,
  },
];

export function ValuesGrid() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-neutral-50 py-20 sm:py-24 lg:py-32">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">
            What We Stand For
          </p>
          <h2 className="mt-2 text-[clamp(1.6rem,3.2vw,2.5rem)] font-bold tracking-tight text-neutral-900">
            Values that shape every feature
          </h2>
        </div>

        <motion.div
          {...(reduce
            ? {}
            : {
                initial: "hidden",
                whileInView: "visible",
                viewport: viewportOnce,
                variants: stagger(0.08),
              })}
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
        >
          {values.map((value) => (
            <motion.article
              key={value.title}
              variants={reduce ? undefined : fadeUp}
              className="group relative rounded-2xl bg-white p-7 ring-1 ring-neutral-200/80 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(16,24,40,0.16)] hover:ring-amber-200"
            >
              <div className="grid size-11 place-items-center rounded-xl bg-neutral-900 text-amber-400 transition-colors group-hover:bg-amber-700 group-hover:text-white">
                <value.icon className="size-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-[16px] font-semibold text-neutral-900">
                {value.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">
                {value.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
