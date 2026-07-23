"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Menu, Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";

export interface NavItem {
  href: string;
  label: string;
}

interface MobileNavProps {
  items: NavItem[];
  isActive: (href: string) => boolean;
  /** Colour class for the hamburger icon in the header (flips with header theme). */
  triggerClassName: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function MobileNav({ items, isActive, triggerClassName }: MobileNavProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hasOpened = useRef(false);

  // `false` on the server, `true` once mounted on the client — lets us portal
  // to document.body without an effect (and without a hydration mismatch).
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Close on route change (render-phase reconciliation, no effect needed).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  // Lock body scroll while the overlay is open.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.classList.add("overflow-hidden");
    return () => root.classList.remove("overflow-hidden");
  }, [open]);

  // Esc to close + focus trap inside the panel.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Move focus into the panel on open; restore it to the trigger on close.
  useEffect(() => {
    if (open) {
      hasOpened.current = true;
      const id = requestAnimationFrame(() => {
        panelRef.current
          ?.querySelector<HTMLElement>("a[href], button")
          ?.focus();
      });
      return () => cancelAnimationFrame(id);
    }
    if (hasOpened.current) {
      triggerRef.current?.focus();
    }
  }, [open]);

  const panelVariants: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : -8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25,
        ease: EASE,
        when: "beforeChildren",
        staggerChildren: reduceMotion ? 0 : 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: reduceMotion ? 0 : -8,
      transition: { duration: 0.2, ease: EASE },
    },
  };

  const linkVariants: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: EASE } },
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        className={cn(
          "relative -mr-2 grid h-11 w-11 place-items-center rounded-md lg:hidden",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
          // While open the panel is white behind the icon, so the icon must be
          // dark regardless of the header's transparent/solid theme.
          open ? "text-neutral-900" : triggerClassName,
        )}
      >
        <AnimatePresence initial={false} mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={reduceMotion ? false : { rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="grid place-items-center"
            >
              <X className="size-6" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={reduceMotion ? false : { rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="grid place-items-center"
            >
              <Menu className="size-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Portalled to <body> so the panel escapes the header's containing
          block — the header's backdrop-filter would otherwise trap a fixed
          descendant, collapsing the overlay on inner/scrolled pages. */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                id="mobile-nav-panel"
                ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 flex flex-col bg-white lg:hidden"
          >
            {/* Spacer matching the header so the panel content clears it. */}
            <div className="h-16 shrink-0" aria-hidden="true" />

            <nav
              aria-label="Mobile"
              className="flex flex-1 flex-col gap-1 px-6 pt-4"
            >
              {items.map((item) => {
                const active = isActive(item.href);
                return (
                  <motion.div key={item.href} variants={linkVariants}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block rounded-lg py-2 text-[22px] font-medium transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                        active
                          ? "text-amber-700"
                          : "text-neutral-900 hover:text-amber-700",
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <motion.div
              variants={linkVariants}
              className="mt-auto flex flex-col gap-3 border-t border-neutral-200 px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            >
              <Link
                href={session ? "/dashboard" : "/login"}
                className="truncate rounded-lg px-1 py-2 text-[15px] font-medium text-neutral-700 transition-colors hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                {session ? session.user.name : "Login"}
              </Link>
              <Link
                href="/properties/add"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-amber-700 px-5 text-[15px] font-semibold text-white transition-colors hover:bg-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <Plus className="size-4" />
                Add Property
              </Link>
            </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
