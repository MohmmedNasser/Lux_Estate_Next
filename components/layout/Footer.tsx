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
    <footer className="border-t border-border bg-secondary/40">
      <Container className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
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
          <h3 className="text-sm font-semibold text-foreground">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-2">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-foreground">Contact</h3>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li>123 Congress Ave, Austin, TX</li>
            <li>+1 (512) 555-0100</li>
            <li>hello@luxestate.com</li>
            <li>Mon – Fri, 9am – 6pm</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-foreground">Follow Us</h3>
          <div className="flex gap-3">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Icon className="size-4" />
              </Link>
            ))}
          </div>
        </div>
      </Container>

      <div className="border-t border-border py-6">
        <Container>
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Lux Estate. All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
}
