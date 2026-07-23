"use client";

import { motion, useReducedMotion } from "framer-motion";

import { fadeUp, stagger } from "@/lib/motion";

interface Stat {
  label: string;
  value: number;
  // A pre-rendered icon element, not a component reference — component
  // references aren't serializable across the server/client boundary
  // when this array is built in a Server Component (see dashboard/page.tsx).
  icon: React.ReactNode;
}

export function StatsGrid({ stats }: { stats: Stat[] }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      {...(reduce
        ? {}
        : { initial: "hidden", animate: "visible", variants: stagger(0.08) })}
      className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3"
    >
      {stats.map((stat) => (
        <motion.div key={stat.label} variants={reduce ? undefined : fadeUp}>
          <StatCard {...stat} />
        </motion.div>
      ))}
    </motion.div>
  );
}

export function StatCard({ label, value, icon }: Stat) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-neutral-200">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-neutral-900 text-amber-400">
        {icon}
      </span>
      <div>
        <p className="text-2xl font-semibold tabular-nums text-neutral-900">
          {value}
        </p>
        <p className="text-[12px] uppercase tracking-wide text-neutral-500">
          {label}
        </p>
      </div>
    </div>
  );
}
