"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { fadeUp } from "@/lib/motion";

export function PropertiesHeader({ count }: { count: number }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      {...(reduce
        ? {}
        : { initial: "hidden", animate: "visible", variants: fadeUp })}
      className="flex flex-col gap-2 border-b border-neutral-200 pb-8 pt-10 sm:pt-12"
    >
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-[13px] text-neutral-500"
      >
        <Link href="/" className="transition-colors hover:text-neutral-900">
          Home
        </Link>
        <span aria-hidden="true" className="text-neutral-300">
          /
        </span>
        <span aria-current="page" className="font-medium text-neutral-900">
          Properties
        </span>
      </nav>

      <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-tight text-neutral-900">
        All Properties
      </h1>

      <p
        className="text-[14px] text-neutral-500"
        role="status"
        aria-live="polite"
      >
        <span className="font-medium text-neutral-900">{count}</span>{" "}
        {count === 1 ? "property" : "properties"} found
      </p>
    </motion.div>
  );
}
