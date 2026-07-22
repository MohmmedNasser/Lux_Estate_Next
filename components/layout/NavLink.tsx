"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  label: string;
  active: boolean;
  /** Colour classes for the resting (inactive) state — flips with header theme. */
  inactiveClassName: string;
  /** Colour classes for the active state — flips with header theme. */
  activeClassName: string;
  /** focus-visible ring-offset colour, flips with header theme. */
  focusClassName: string;
}

export function NavLink({
  href,
  label,
  active,
  inactiveClassName,
  activeClassName,
  focusClassName,
}: NavLinkProps) {
  const reduceMotion = useReducedMotion();

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative rounded-md px-1 py-2 text-[14.5px] font-medium transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2",
        focusClassName,
        active ? activeClassName : inactiveClassName,
      )}
    >
      {label}
      {active && (
        <motion.span
          layoutId="nav-underline"
          aria-hidden="true"
          className="absolute -bottom-1.5 inset-x-1 h-[2px] rounded-full bg-current"
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 500, damping: 34 }
          }
        />
      )}
    </Link>
  );
}
