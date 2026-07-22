"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ChevronDown, MapPin, Search, SlidersHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatPropertyType } from "@/lib/format";
import { Container } from "@/components/layout/Container";
import { NativeSelect } from "@/components/ui/native-select";
import { FormField, formInputClass } from "@/components/ui/form-field";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FeaturedPropertyCard } from "@/components/home/FeaturedPropertyCard";
import type { Property, PropertyType } from "@/types";

const propertyTypes: PropertyType[] = [
  "apartment",
  "villa",
  "house",
  "land",
  "office",
  "shop",
];
const bedroomOptions = [1, 2, 3, 4, 5];
const bathroomOptions = [1, 2, 3, 4, 5];

type ListingFilter = "all" | "buy" | "rent";

const EASE = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export function Hero({
  locations,
  featuredProperty,
}: {
  locations: string[];
  featuredProperty: Property;
}) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, 80]);

  const [listingType, setListingType] = useState<ListingFilter>("all");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyType | "">("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  function runSearch() {
    const params = new URLSearchParams();
    if (listingType !== "all") params.set("listingType", listingType);
    if (propertyType) params.set("propertyType", propertyType);
    if (location) params.set("location", location);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (bathrooms) params.set("bathrooms", bathrooms);
    const qs = params.toString();
    router.push(qs ? `/properties?${qs}` : "/properties");
  }

  function handleDesktopSubmit(e: React.FormEvent) {
    e.preventDefault();
    runSearch();
  }

  function handleMobileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMobileSheetOpen(false);
    runSearch();
  }

  return (
    <section className="relative isolate flex max-h-[92vh] min-h-[640px] flex-col justify-center overflow-hidden bg-neutral-950 py-20 sm:py-24 lg:h-[88vh] lg:max-h-[88vh] lg:py-0">
      <motion.div
        className="absolute inset-0 -z-20"
        initial={prefersReducedMotion ? false : { scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        style={{ y: prefersReducedMotion ? 0 : parallaxY }}
      >
        <Image
          src="https://picsum.photos/seed/lux-estate-hero/1920/1080"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(105deg, rgba(20,16,13,0.82) 0%, rgba(20,16,13,0.45) 55%, rgba(20,16,13,0.15) 100%)",
        }}
      />

      <Container className="relative">
        <motion.div
          variants={containerVariants}
          initial={prefersReducedMotion ? false : "hidden"}
          animate="visible"
        >
          <div className="flex max-w-2xl flex-col gap-6">
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3"
            >
              <span className="h-px w-8 bg-amber-500/90" aria-hidden="true" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-500/90">
                Lux Estate
              </p>
            </motion.div>

            <h1 className="text-[clamp(2.75rem,5.5vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-white">
              <motion.span variants={itemVariants} className="block">
                Find the address
              </motion.span>
              <motion.span variants={itemVariants} className="block">
                that feels like{" "}
                <span className="bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                  home
                </span>
              </motion.span>
            </h1>

            <motion.p
              variants={itemVariants}
              className="max-w-[46ch] text-[17px] leading-relaxed text-white/70"
            >
              Browse thousands of properties for sale and for rent, and
              connect directly with the people who own them.
            </motion.p>

            <motion.form
              variants={itemVariants}
              onSubmit={handleDesktopSubmit}
              className="hidden w-full max-w-3xl flex-col rounded-2xl bg-white p-2 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] lg:flex"
            >
              <div className="flex items-stretch divide-x divide-neutral-200">
                <div className="flex shrink-0 items-center pr-2">
                  <div className="inline-flex h-14 items-center rounded-xl bg-neutral-100 p-1">
                    {(["all", "buy", "rent"] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setListingType(option)}
                        className={cn(
                          "h-full rounded-lg px-4 text-sm font-medium capitalize transition-colors",
                          listingType === option
                            ? "bg-amber-700 text-white shadow-sm"
                            : "text-neutral-500 hover:text-neutral-900",
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex h-14 min-w-0 flex-1 flex-col justify-center gap-0.5 px-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                    Location
                  </span>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full truncate border-0 bg-transparent p-0 text-sm text-neutral-900 focus:outline-none focus:ring-0"
                  >
                    <option value="">Any location</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex h-14 min-w-0 flex-1 flex-col justify-center gap-0.5 px-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                    Property Type
                  </span>
                  <select
                    value={propertyType}
                    onChange={(e) =>
                      setPropertyType(e.target.value as PropertyType | "")
                    }
                    className="w-full truncate border-0 bg-transparent p-0 text-sm text-neutral-900 focus:outline-none focus:ring-0"
                  >
                    <option value="">Any type</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {formatPropertyType(type)}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="flex shrink-0 items-center pl-2">
                  <button
                    type="submit"
                    className="flex h-12 items-center gap-2 rounded-xl bg-amber-700 px-7 text-sm font-semibold text-white transition-colors hover:bg-amber-800"
                  >
                    <Search className="size-4" />
                    Search
                  </button>
                </div>
              </div>

              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  onClick={() => setMoreFiltersOpen((open) => !open)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-900"
                >
                  <SlidersHorizontal className="size-3.5" />
                  {moreFiltersOpen ? "Fewer filters" : "More filters"}
                  <ChevronDown
                    className={cn(
                      "size-3.5 transition-transform duration-200",
                      moreFiltersOpen && "rotate-180",
                    )}
                  />
                </button>
              </div>

              <motion.div
                initial={false}
                animate={{
                  height: moreFiltersOpen ? "auto" : 0,
                  opacity: moreFiltersOpen ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-3 gap-4 border-t border-neutral-100 px-4 pb-4 pt-4">
                  <label className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                      Price Range
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        inputMode="numeric"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="h-10 w-full min-w-0 rounded-lg border border-neutral-200 px-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-700/40"
                      />
                      <span className="text-neutral-400">–</span>
                      <input
                        type="number"
                        min={0}
                        inputMode="numeric"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="h-10 w-full min-w-0 rounded-lg border border-neutral-200 px-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-700/40"
                      />
                    </div>
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                      Bedrooms
                    </span>
                    <select
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="h-10 rounded-lg border border-neutral-200 px-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-700/40"
                    >
                      <option value="">Any</option>
                      {bedroomOptions.map((n) => (
                        <option key={n} value={n}>
                          {n}+
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                      Bathrooms
                    </span>
                    <select
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      className="h-10 rounded-lg border border-neutral-200 px-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-700/40"
                    >
                      <option value="">Any</option>
                      {bathroomOptions.map((n) => (
                        <option key={n} value={n}>
                          {n}+
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </motion.div>
            </motion.form>

            <motion.div variants={itemVariants} className="w-full lg:hidden">
              <div className="rounded-2xl bg-white p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)]">
                <div className="inline-flex w-full rounded-xl bg-neutral-100 p-1">
                  {(["all", "buy", "rent"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setListingType(option)}
                      className={cn(
                        "h-10 flex-1 rounded-lg text-sm font-medium capitalize transition-colors",
                        listingType === option
                          ? "bg-amber-700 text-white"
                          : "text-neutral-500",
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setMobileSheetOpen(true)}
                  className="mt-3 flex h-14 w-full items-center gap-2 rounded-xl border border-neutral-200 px-4 text-left"
                >
                  <MapPin className="size-4 shrink-0 text-neutral-400" />
                  <span className="truncate text-sm text-neutral-500">
                    Where are you looking?
                  </span>
                </button>
              </div>
            </motion.div>

            <motion.p variants={itemVariants} className="text-sm text-white/50">
              12,400+ listings
              <span className="mx-2 text-white/30">·</span>
              Direct from owners
              <span className="mx-2 text-white/30">·</span>
              4.9★ rated
            </motion.p>
          </div>

          <motion.div
            variants={itemVariants}
            className="absolute bottom-10 right-0 z-10 hidden lg:block"
          >
            <FeaturedPropertyCard property={featuredProperty} />
          </motion.div>
        </motion.div>
      </Container>

      <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[85vh] overflow-y-auto rounded-t-3xl"
        >
          <SheetHeader>
            <SheetTitle>Filter Properties</SheetTitle>
          </SheetHeader>
          <form
            onSubmit={handleMobileSubmit}
            className="flex flex-col gap-4 px-4 pb-6"
          >
            <FormField id="hero-sheet-location" label="Location">
              <NativeSelect
                id="hero-sheet-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">Any location</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </NativeSelect>
            </FormField>

            <FormField id="hero-sheet-property-type" label="Property Type">
              <NativeSelect
                id="hero-sheet-property-type"
                value={propertyType}
                onChange={(e) =>
                  setPropertyType(e.target.value as PropertyType | "")
                }
              >
                <option value="">Any type</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {formatPropertyType(type)}
                  </option>
                ))}
              </NativeSelect>
            </FormField>

            <FormField id="hero-sheet-price" label="Price Range">
              <div className="flex items-center gap-2">
                <input
                  id="hero-sheet-price"
                  type="number"
                  min={0}
                  inputMode="numeric"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className={formInputClass(false)}
                />
                <span className="text-muted-foreground">–</span>
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className={formInputClass(false)}
                />
              </div>
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField id="hero-sheet-bedrooms" label="Bedrooms">
                <NativeSelect
                  id="hero-sheet-bedrooms"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                >
                  <option value="">Any</option>
                  {bedroomOptions.map((n) => (
                    <option key={n} value={n}>
                      {n}+
                    </option>
                  ))}
                </NativeSelect>
              </FormField>

              <FormField id="hero-sheet-bathrooms" label="Bathrooms">
                <NativeSelect
                  id="hero-sheet-bathrooms"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                >
                  <option value="">Any</option>
                  {bathroomOptions.map((n) => (
                    <option key={n} value={n}>
                      {n}+
                    </option>
                  ))}
                </NativeSelect>
              </FormField>
            </div>

            <button
              type="submit"
              className="mt-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-amber-700 text-sm font-semibold text-white transition-colors hover:bg-amber-800"
            >
              <Search className="size-4" />
              Search
            </button>
          </form>
        </SheetContent>
      </Sheet>
    </section>
  );
}
