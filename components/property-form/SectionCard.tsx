"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { fadeUp, viewportOnce } from "@/lib/motion";

export function SectionCard({
  id,
  number,
  title,
  highlight,
  children,
}: {
  id: string;
  number: string;
  title: string;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.section
      id={id}
      {...(reduce
        ? {}
        : {
            initial: "hidden",
            whileInView: "visible",
            viewport: viewportOnce,
            variants: fadeUp,
          })}
      className={cn(
        "scroll-mt-32 rounded-2xl bg-white p-6 ring-1 transition-shadow duration-500 sm:p-8",
        highlight ? "ring-2 ring-rose-400" : "ring-neutral-200",
      )}
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-amber-50 text-[13px] font-semibold text-amber-700">
          {number}
        </span>
        <h2 className="text-[16px] font-semibold text-neutral-900">{title}</h2>
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </motion.section>
  );
}
