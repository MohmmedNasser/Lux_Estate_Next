"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import { useScroll } from "framer-motion";

// Hysteresis thresholds: flip ON past 24px, OFF below 12px. The gap stops the
// state from flickering when the user hovers right around the boundary.
const ENTER = 24;
const EXIT = 12;

/**
 * Single source of truth for the header's scrolled state.
 *
 * Everything visual (background AND text colour) must derive from this one
 * boolean so the two can never desync into the invisible-text failure mode.
 *
 * Implemented with `useSyncExternalStore` so the server snapshot is always
 * `false` (matching first paint, no hydration mismatch) while the client reads
 * the real scroll position on subscribe — this guards a page restored
 * mid-scroll (browser scroll restoration, deep link with a hash).
 */
export function useScrollState(): boolean {
  const scrolledRef = useRef(false);
  const { scrollY } = useScroll();

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const evaluate = (latest: number) => {
        const prev = scrolledRef.current;
        let next = prev;
        if (!prev && latest > ENTER) next = true;
        else if (prev && latest < EXIT) next = false;

        if (next !== prev) {
          scrolledRef.current = next;
          onStoreChange();
        }
      };

      // Read the current position once so a mid-scroll mount starts correct.
      evaluate(scrollY.get());
      // MotionValue subscription is passive and rAF-batched — no per-frame
      // setState on a raw scroll handler.
      return scrollY.on("change", evaluate);
    },
    [scrollY],
  );

  return useSyncExternalStore(
    subscribe,
    () => scrolledRef.current,
    () => false,
  );
}
