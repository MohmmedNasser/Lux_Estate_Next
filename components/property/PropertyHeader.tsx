"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  Heart,
  MapPin,
  MoreHorizontal,
  Share2,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface PropertyHeaderProps {
  title: string;
  typeLabel: string;
  location: string;
  isRent: boolean;
}

const pillClass =
  "inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13px] font-medium text-neutral-700 ring-1 ring-neutral-200 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600";

export function PropertyHeader({
  title,
  typeLabel,
  location,
  isRent,
}: PropertyHeaderProps) {
  const reduceMotion = useReducedMotion();
  const [saved, setSaved] = useState(false);
  const [shareLabel, setShareLabel] = useState("Share");

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareLabel("Copied!");
      window.setTimeout(() => setShareLabel("Share"), 1500);
    } catch {
      // Clipboard unavailable — nothing to recover, leave the label as-is.
    }
  }

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url: window.location.href });
        return;
      } catch {
        // User dismissed the share sheet, or it failed — fall through to copy.
      }
    }
    copyLink();
  }

  return (
    <div>
      {/* Breadcrumb — desktop */}
      <nav
        aria-label="Breadcrumb"
        className="hidden items-center gap-1.5 text-[13px] text-neutral-500 sm:flex"
      >
        <Link href="/" className="transition-colors hover:text-neutral-900">
          Home
        </Link>
        <ChevronRight className="size-3.5 shrink-0 text-neutral-300" aria-hidden="true" />
        <Link
          href="/properties"
          className="transition-colors hover:text-neutral-900"
        >
          Properties
        </Link>
        <ChevronRight className="size-3.5 shrink-0 text-neutral-300" aria-hidden="true" />
        <span aria-current="page" className="truncate font-medium text-neutral-900">
          {title}
        </span>
      </nav>

      {/* Breadcrumb — mobile */}
      <Link
        href="/properties"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-neutral-600 transition-colors hover:text-neutral-900 sm:hidden"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to Properties
      </Link>

      {/* Title row */}
      <div className="mt-4 flex items-start justify-between gap-6">
        <h1 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-neutral-900">
          {title}
        </h1>

        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <button type="button" onClick={handleShare} className={pillClass}>
            <Share2 className="size-4" aria-hidden="true" />
            {shareLabel}
          </button>

          <button
            type="button"
            onClick={() => setSaved((value) => !value)}
            aria-pressed={saved}
            className={pillClass}
          >
            <motion.span
              className="grid place-items-center"
              animate={
                reduceMotion || !saved ? undefined : { scale: [1, 1.25, 1] }
              }
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Heart
                className={cn("size-4", saved && "fill-rose-600 text-rose-600")}
                aria-hidden="true"
              />
            </motion.span>
            {saved ? "Saved" : "Save"}
          </button>

          <button
            type="button"
            onClick={copyLink}
            aria-label="More options"
            className={cn(pillClass, "px-2.5")}
          >
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Meta row */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-neutral-600">
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white",
            isRent ? "bg-amber-700" : "bg-neutral-900",
          )}
        >
          {isRent ? "For Rent" : "For Sale"}
        </span>
        <span>{typeLabel}</span>
        <span aria-hidden="true" className="text-neutral-300">
          ·
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-4 shrink-0 text-neutral-400" aria-hidden="true" />
          {location}
        </span>
      </div>
    </div>
  );
}
