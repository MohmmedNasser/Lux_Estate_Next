"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Container } from "@/components/layout/Container";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isLinkActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

// Two visual modes: `overHero` (transparent, sitting on the home hero photo)
// and the default solid bar. Every colour swap between the two lives here so
// the markup below stays free of inline ternaries.
const TONE = {
  overHero: {
    header:
      "border-transparent bg-linear-to-b from-black/75 via-black/45 to-black/10 [text-shadow:0_1px_2px_rgb(0_0_0/0.45)]",
    logo: "text-white",
    link: "text-white/85 hover:text-white",
    linkActive: "text-amber-300",
    ghost: "text-white hover:bg-white/10 hover:text-white",
  },
  solid: {
    header:
      "border-border bg-background/95 shadow-sm backdrop-blur supports-backdrop-filter:bg-background/80",
    logo: "text-foreground",
    link: "text-foreground/75 hover:text-primary",
    linkActive: "text-primary",
    ghost: "",
  },
} as const;

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setNavOpen(false);
  }

  const isHome = pathname === "/";
  const tone = isHome && !scrolled ? TONE.overHero : TONE.solid;

  useEffect(() => {
    if (!isHome) return;

    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors duration-300",
        tone.header,
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className={cn(
            "text-xl font-bold tracking-tight transition-colors",
            tone.logo,
          )}
        >
          Lux Estate
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isLinkActive(pathname, link.href) ? "page" : undefined}
              className={cn(
                "text-sm font-medium transition-colors",
                isLinkActive(pathname, link.href) ? tone.linkActive : tone.link,
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="ghost"
            render={<Link href="/login" />}
            className={tone.ghost}
          >
            Login
          </Button>
          <Button render={<Link href="/properties/add" />}>
            Add Property
          </Button>
        </div>

        <Sheet open={navOpen} onOpenChange={setNavOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className={cn("md:hidden", tone.ghost)}
              />
            }
          >
            <Menu />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Lux Estate</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={
                    isLinkActive(pathname, link.href) ? "page" : undefined
                  }
                  className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary aria-[current=page]:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-2 flex flex-col gap-2 px-4">
              <Link href="/login" className={buttonVariants({ variant: "outline" })}>
                Login
              </Link>
              <Link href="/properties/add" className={buttonVariants({ variant: "default" })}>
                Add Property
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </Container>
    </header>
  );
}
