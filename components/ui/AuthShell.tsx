"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { scaleIn } from "@/lib/motion";

export function AuthShell({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-neutral-50 px-4 py-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(45%_55%_at_50%_0%,rgba(180,83,9,0.10),transparent_70%)]"
      />

      <motion.div
        {...(reduce
          ? {}
          : { initial: "hidden", animate: "visible", variants: scaleIn })}
        className="w-full max-w-[420px]"
      >
        <Link
          href="/"
          aria-label="Lux Estate — home"
          className="mb-6 flex items-center justify-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-700">
            <Building2 className="size-4 text-white" aria-hidden="true" />
          </span>
          <span className="text-[19px] font-semibold tracking-[-0.02em] text-neutral-900">
            Lux Estate
          </span>
        </Link>

        <div className="rounded-2xl bg-white p-8 shadow-[0_8px_32px_-12px_rgba(16,24,40,0.12)] ring-1 ring-neutral-200">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
