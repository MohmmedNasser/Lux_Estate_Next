import type { Metadata } from "next";
import Image from "next/image";
import { Eye, ShieldCheck, Sparkles, Users } from "lucide-react";

import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "About | Lux Estate",
  description:
    "Learn about Lux Estate's mission to make buying, renting, and listing property refreshingly simple.",
};

const values = [
  {
    title: "Transparency",
    description:
      "Every listing shows the real price, real photos, and real contact details — no surprises after you've fallen in love with the place.",
    icon: Eye,
  },
  {
    title: "Simplicity",
    description:
      "From your first search to publishing a listing, every flow takes a few steps, not a few days.",
    icon: Sparkles,
  },
  {
    title: "Direct Access",
    description:
      "Talk straight to property owners. No agent fees, no waiting on hold, no forwarded messages.",
    icon: Users,
  },
  {
    title: "Trust",
    description:
      "We built the platform around clear information, so you can make decisions with confidence.",
    icon: ShieldCheck,
  },
];

const team = [
  {
    name: "Maya Torres",
    role: "Founder & CEO",
    avatar: "https://picsum.photos/seed/maya-torres/300/300",
  },
  {
    name: "Elliot Park",
    role: "Head of Product",
    avatar: "https://picsum.photos/seed/elliot-park/300/300",
  },
  {
    name: "Priya Nandakumar",
    role: "Lead Engineer",
    avatar: "https://picsum.photos/seed/priya-nandakumar/300/300",
  },
  {
    name: "Jordan Blake",
    role: "Customer Success Lead",
    avatar: "https://picsum.photos/seed/jordan-blake/300/300",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-secondary/40 py-16 sm:py-20">
        <Container className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            About Lux Estate
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Real estate, without the runaround
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            We built Lux Estate to make finding, listing, and renting a home
            refreshingly simple — no agents required, no hidden fees, no
            clutter.
          </p>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Why we started this
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Most real estate sites bury the listing you actually want
              behind logins, pop-ups, and pushy agent forms. We wanted
              something simpler: browse freely, see real details up front,
              and talk directly to the person who owns the place.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Lux Estate connects buyers, renters, and property owners
              directly. List a property in minutes. Search by exactly what
              matters to you. Reach out with one message — no middleman
              required.
            </p>
          </div>
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl">
            <Image
              src="https://picsum.photos/seed/lux-estate-about/1200/900"
              alt="A bright, modern living space"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      <section className="bg-secondary/40 py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              What We Stand For
            </p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
              Values that shape every feature
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border"
              >
                <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <value.icon className="size-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Our Team
            </p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
              The people building Lux Estate
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {team.map((member) => (
              <div
                key={member.name}
                className="flex flex-col items-center text-center"
              >
                <div className="relative size-24 overflow-hidden rounded-full bg-muted sm:size-28">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
