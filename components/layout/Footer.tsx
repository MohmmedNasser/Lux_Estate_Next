import Link from "next/link";
import { Bird, Camera, Globe, Share2 } from "lucide-react";

import { Container } from "@/components/layout/Container";

const quickLinks = [
  { href: "/properties", label: "Properties" },
  { href: "/properties?listingType=buy", label: "Buy" },
  { href: "/properties?listingType=rent", label: "Rent" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  { href: "#", label: "Facebook", icon: Globe },
  { href: "#", label: "Instagram", icon: Camera },
  { href: "#", label: "Twitter", icon: Bird },
  { href: "#", label: "LinkedIn", icon: Share2 },
];

export function Footer() {
  return (
    <footer className="border-t border-neutral-200">
      <Container className="grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:py-20">
        <div className="flex flex-col gap-3">
          <span className="text-xl font-bold tracking-tight text-foreground">
            Lux Estate
          </span>
          <p className="text-sm text-muted-foreground">
            Find your next home or list a property in just a few simple
            steps. Simple, transparent real estate for everyone.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-[13px] font-semibold text-neutral-900">
            Quick Links
          </h3>
          <ul className="flex flex-col">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="block py-1 text-[14px] text-neutral-600 transition-colors hover:text-amber-800"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-[13px] font-semibold text-neutral-900">
            Contact
          </h3>
          <ul className="flex flex-col gap-2 text-[14px] text-neutral-600">
            <li>123 Congress Ave, Austin, TX</li>
            <li>+1 (512) 555-0100</li>
            <li>hello@luxestate.com</li>
            <li>Mon – Fri, 9am – 6pm</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-[13px] font-semibold text-neutral-900">
            Follow Us
          </h3>
          <div className="flex gap-3">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="grid size-10 place-items-center rounded-full text-neutral-500 ring-1 ring-neutral-200 transition-all duration-300 hover:bg-amber-50 hover:text-amber-700 hover:ring-amber-700"
              >
                <Icon className="size-4" />
              </Link>
            ))}
          </div>
        </div>
      </Container>

      <Container>
        <div className="flex flex-col items-center gap-2 border-t border-neutral-200 pt-8 pb-10 text-center text-[13px] text-neutral-500 sm:flex-row sm:justify-between sm:pb-8 sm:text-left">
          <p>© {new Date().getFullYear()} Lux Estate. All rights reserved.</p>
          <p>Owner-direct listings, no agent fees.</p>
        </div>
      </Container>
    </footer>
  );
}
