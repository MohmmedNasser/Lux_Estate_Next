"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Building2, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { useScrollState } from "@/hooks/useScrollState";
import { NavLink } from "@/components/layout/NavLink";
import { MobileNav, type NavItem } from "@/components/layout/MobileNav";
import { Container } from "@/components/layout/Container";

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isLinkActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

interface SiteHeaderProps {
  /**
   * `overlay` = transparent over a dark hero at the top of the page.
   * `solid`   = opaque light bar, mounted immediately (no transparent state).
   * Defaults to `overlay` on the homepage and `solid` everywhere else, so inner
   * pages can never render white text on a white bar.
   */
  variant?: "overlay" | "solid";
}

export function SiteHeader({ variant }: SiteHeaderProps) {
  const pathname = usePathname();
  const scrolled = useScrollState();
  const reduceMotion = useReducedMotion();

  const effectiveVariant = variant ?? (pathname === "/" ? "overlay" : "solid");

  // THE single source of truth. Background AND text colour both derive from
  // this one boolean — they cannot desync.
  const onDark = effectiveVariant === "overlay" && !scrolled;

  const t = onDark
    ? {
        logo: "text-white",
        link: "text-white/80 hover:text-white",
        active: "text-amber-400",
        login: "text-white/85 hover:text-white",
        cta: "bg-amber-600 hover:bg-amber-500",
        ringOffset: "focus-visible:ring-offset-transparent",
      }
    : {
        logo: "text-neutral-900",
        link: "text-neutral-600 hover:text-neutral-900",
        active: "text-amber-700",
        login: "text-neutral-700 hover:text-neutral-900",
        cta: "bg-amber-700 hover:bg-amber-800",
        ringOffset: "focus-visible:ring-offset-white",
      };

  const ctaMotion = reduceMotion
    ? {}
    : {
        whileHover: { scale: 1.03 },
        whileTap: { scale: 0.97 },
        transition: { type: "spring" as const, stiffness: 400, damping: 22 },
      };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only rounded bg-white px-4 py-2 font-medium text-neutral-900 ring-2 ring-amber-700 focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-[60]"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
          onDark
            ? "border-transparent bg-transparent"
            : "border-neutral-200/80 bg-white/85 shadow-[0_1px_3px_rgba(16,24,40,0.06)] backdrop-blur-xl",
        )}
      >
        {/* Legibility scrim over bright hero photos — State A only. */}
        {onDark && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-black/45 via-black/15 to-transparent"
          />
        )}

        <Container className="relative flex h-16 items-center justify-between gap-8 lg:h-[72px]">
          {/* Left — logo */}
          <Link
            href="/"
            aria-label="Lux Estate — home"
            className={cn(
              "inline-flex shrink-0 items-center gap-2.5 rounded-md transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2",
              t.ringOffset,
            )}
          >
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-amber-700">
              <Building2 className="size-4 text-white" aria-hidden="true" />
            </span>
            <span
              className={cn(
                "text-[19px] font-semibold tracking-[-0.02em] transition-colors lg:text-[21px]",
                t.logo,
              )}
            >
              Lux Estate
            </span>
          </Link>

          {/* Center — nav, optically centred on the container regardless of
              logo/CTA width asymmetry. */}
          <nav
            aria-label="Main"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={isLinkActive(pathname, item.href)}
                inactiveClassName={t.link}
                activeClassName={t.active}
                focusClassName={t.ringOffset}
              />
            ))}
          </nav>

          {/* Right — actions */}
          <div className="flex shrink-0 items-center gap-2 lg:gap-3">
            <Link
              href="/login"
              className={cn(
                "hidden items-center rounded-md px-3 py-2 text-[14.5px] font-medium transition-colors duration-200 lg:inline-flex",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2",
                t.login,
                t.ringOffset,
              )}
            >
              Login
            </Link>

            {/* CTA: full pill on lg+, icon-only on sm–lg, hidden < sm. */}
            <motion.div className="hidden sm:inline-flex" {...ctaMotion}>
              <Link
                href="/properties/add"
                className={cn(
                  "inline-flex h-10 items-center justify-center gap-2 rounded-full px-3 text-[14px] font-semibold text-white transition-colors duration-200 lg:px-5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2",
                  t.cta,
                  t.ringOffset,
                )}
              >
                <Plus className="size-4" aria-hidden="true" />
                <span className="hidden lg:inline">Add Property</span>
                <span className="sr-only lg:hidden">Add Property</span>
              </Link>
            </motion.div>

            <MobileNav
              items={NAV_ITEMS}
              isActive={(href) => isLinkActive(pathname, href)}
              triggerClassName={t.logo}
            />
          </div>
        </Container>
      </header>

      {/* Solid pages: in-flow spacer so content clears the fixed header.
          Overlay pages omit it so the hero sits under the transparent bar. */}
      {effectiveVariant === "solid" && (
        <div className="h-16 lg:h-[72px]" aria-hidden="true" />
      )}
    </>
  );
}
