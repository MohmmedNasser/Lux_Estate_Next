"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface FormStep {
  id: string;
  label: string;
}

export function useActiveStep(steps: FormStep[]): number {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const elements = steps
      .map((step) => document.getElementById(step.id))
      .filter((el): el is HTMLElement => !!el);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          const index = steps.findIndex((step) => step.id === visible[0].target.id);
          if (index !== -1) setActiveIndex(index);
        }
      },
      { rootMargin: "-140px 0px -55% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [steps]);

  return activeIndex;
}

export function Stepper({ steps }: { steps: FormStep[] }) {
  const reduce = useReducedMotion();
  const activeIndex = useActiveStep(steps);

  function scrollToStep(id: string) {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  return (
    <div className="sticky top-16 z-30 border-b border-neutral-200 bg-white/90 py-3 backdrop-blur lg:top-[72px]">
      {/* Desktop / tablet: full labeled stepper */}
      <div className="mx-auto hidden max-w-3xl items-center px-4 sm:flex sm:px-6 lg:px-8">
        {steps.map((step, i) => (
          <div
            key={step.id}
            className={cn(
              "flex items-center",
              i < steps.length - 1 && "flex-1",
            )}
          >
            <button
              type="button"
              onClick={() => scrollToStep(step.id)}
              aria-current={i === activeIndex ? "step" : undefined}
              className="flex shrink-0 items-center gap-2"
            >
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold transition-colors",
                  i <= activeIndex
                    ? "bg-amber-700 text-white"
                    : "bg-neutral-100 text-neutral-400",
                )}
              >
                {i < activeIndex ? (
                  <Check className="size-3.5" aria-hidden="true" />
                ) : (
                  i + 1
                )}
              </span>
              <span
                className={cn(
                  "text-[13px] font-medium transition-colors",
                  i <= activeIndex ? "text-amber-700" : "text-neutral-400",
                )}
              >
                {step.label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className="mx-3 h-px flex-1 bg-neutral-200"
              />
            )}
          </div>
        ))}
      </div>

      {/* Mobile: collapsed progress bar */}
      <div className="px-4 sm:hidden">
        <p className="text-[12px] font-medium text-neutral-600">
          Step {activeIndex + 1} of {steps.length} — {steps[activeIndex].label}
        </p>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-neutral-100">
          <motion.div
            className="h-full rounded-full bg-amber-700"
            animate={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
            transition={
              reduce
                ? { duration: 0 }
                : { type: "spring", stiffness: 300, damping: 30 }
            }
          />
        </div>
      </div>
    </div>
  );
}
