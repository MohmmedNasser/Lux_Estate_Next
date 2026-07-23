"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { LayoutGrid } from "lucide-react";

import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";
import { GalleryLightbox } from "@/components/property/GalleryLightbox";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

const scrollHide =
  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

// Desktop mosaic: true outer corners are rounded; interior tile corners stay
// square so the gap grid reads as one panel (Airbnb style).
function desktopLayout(n: number): { grid: string; tiles: string[] } {
  if (n <= 1) return { grid: "grid-cols-1 grid-rows-1", tiles: ["rounded-2xl"] };
  if (n === 2)
    return {
      grid: "grid-cols-2 grid-rows-1",
      tiles: ["rounded-l-2xl", "rounded-r-2xl"],
    };
  if (n === 3)
    return {
      grid: "grid-cols-4 grid-rows-2",
      tiles: [
        "col-span-2 row-span-2 rounded-l-2xl",
        "col-span-2 rounded-tr-2xl",
        "col-span-2 rounded-br-2xl",
      ],
    };
  if (n === 4)
    return {
      grid: "grid-cols-4 grid-rows-2",
      tiles: [
        "col-span-2 row-span-2 rounded-l-2xl",
        "col-span-2 rounded-tr-2xl",
        "",
        "rounded-br-2xl",
      ],
    };
  return {
    grid: "grid-cols-4 grid-rows-2",
    tiles: [
      "col-span-2 row-span-2 rounded-l-2xl",
      "",
      "rounded-tr-2xl",
      "",
      "rounded-br-2xl",
    ],
  };
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const reduceMotion = useReducedMotion();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const count = images.length;

  function openAt(index: number, trigger: HTMLElement) {
    triggerRef.current = trigger;
    setLightboxIndex(index);
    setLightboxOpen(true);
  }

  function handleScroll() {
    const el = scrollerRef.current;
    if (!el || count === 0) return;
    const slide = el.scrollWidth / count;
    setActiveSlide(Math.min(count - 1, Math.round(el.scrollLeft / slide)));
  }

  const desktop = desktopLayout(Math.min(count, 5));
  const desktopImages = images.slice(0, desktop.tiles.length);
  const tabletImages = images.slice(0, Math.min(count, 3));

  const tileImage = (src: string, index: number) => (
    <Image
      src={src}
      alt={`${title} — photo ${index + 1} of ${count}`}
      fill
      priority={index === 0}
      sizes="(min-width: 1024px) 66vw, (min-width: 640px) 100vw, 88vw"
      className="object-cover transition duration-300 [@media(hover:hover)]:hover:brightness-[0.92]"
    />
  );

  const entrance = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.97 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.7, ease: EASE },
      };

  return (
    <motion.div className="relative" {...entrance}>
      {/* MOBILE (< sm): full-bleed snap carousel */}
      <div className="sm:hidden">
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          aria-roledescription="carousel"
          aria-label={`${title} photos`}
          className={cn(
            "-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4",
            scrollHide,
          )}
        >
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={(e) => openAt(i, e.currentTarget)}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count} — open photo`}
              className="relative aspect-[4/3] w-[88vw] shrink-0 snap-center overflow-hidden rounded-xl bg-neutral-100"
            >
              {tileImage(src, i)}
            </button>
          ))}
        </div>

        {count > 1 && (
          <div className="mt-3 flex justify-center gap-1.5">
            {images.map((src, i) => (
              <span
                key={src}
                aria-hidden="true"
                className={cn(
                  "h-1.5 rounded-full bg-neutral-300 transition-all",
                  i === activeSlide ? "w-5 bg-neutral-900" : "w-1.5",
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* TABLET (sm–lg): wide top image + a pair below */}
      <div className="hidden gap-2 sm:grid sm:grid-cols-2 lg:hidden">
        {tabletImages.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={(e) => openAt(i, e.currentTarget)}
            className={cn(
              "relative overflow-hidden bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2",
              i === 0
                ? cn(
                    "col-span-2 aspect-[16/9]",
                    tabletImages.length === 1
                      ? "rounded-2xl"
                      : "rounded-t-2xl",
                  )
                : "aspect-[4/3]",
              tabletImages.length === 2 && i === 1 && "col-span-2 rounded-b-2xl",
              tabletImages.length === 3 && i === 1 && "rounded-bl-2xl",
              tabletImages.length === 3 && i === 2 && "rounded-br-2xl",
            )}
          >
            {tileImage(src, i)}
          </button>
        ))}
      </div>

      {/* DESKTOP (lg+): mosaic */}
      <div
        className={cn(
          "hidden h-[clamp(380px,46vw,520px)] gap-2 lg:grid",
          desktop.grid,
        )}
      >
        {desktopImages.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={(e) => openAt(i, e.currentTarget)}
            className={cn(
              "relative overflow-hidden bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2",
              desktop.tiles[i],
            )}
          >
            {tileImage(src, i)}
          </button>
        ))}
      </div>

      {/* Show all photos */}
      <button
        type="button"
        onClick={(e) => openAt(0, e.currentTarget)}
        className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-lg bg-white/95 px-4 py-2.5 text-[13px] font-medium text-neutral-900 shadow-sm ring-1 ring-black/10 backdrop-blur transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 sm:left-auto sm:right-4"
      >
        <LayoutGrid className="size-4" aria-hidden="true" />
        Show all {count} photos
      </button>

      <GalleryLightbox
        images={images}
        title={title}
        open={lightboxOpen}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        onClose={() => setLightboxOpen(false)}
        returnFocusRef={triggerRef}
      />
    </motion.div>
  );
}
