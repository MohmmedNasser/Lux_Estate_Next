import Image from "next/image";
import Link from "next/link";
import { KeyRound, MessageCircle, Search } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/property/FilterBar";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { mockProperties } from "@/lib/mock-data";
import { locations } from "@/lib/locations";

const featuredProperties = mockProperties.slice(0, 6);

const steps = [
  {
    title: "Browse Properties",
    description:
      "Search by location, price, and property type to find places that match what you're looking for.",
    icon: Search,
  },
  {
    title: "Contact the Owner",
    description:
      "Send an inquiry straight from the listing and ask about a viewing, pricing, or anything else.",
    icon: MessageCircle,
  },
  {
    title: "Move In",
    description:
      "Agree on the details with the owner and move into your new home or business space.",
    icon: KeyRound,
  },
];

export default function Home() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-foreground">
        <div className="absolute inset-0">
          <Image
            src="https://picsum.photos/seed/lux-estate-hero/1920/1080"
            alt=""
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/45 to-black/20" />
        </div>

        <Container className="relative flex flex-col gap-6 pb-36 pt-24 sm:pb-44 sm:pt-32 lg:pb-52 lg:pt-40">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Lux Estate
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find the address that feels like home
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/80">
              Browse thousands of properties for sale and for rent, and
              connect directly with the people who own them.
            </p>
          </div>
        </Container>
      </section>

      <Container className="relative z-10 -mt-28 sm:-mt-32 lg:-mt-36">
        <FilterBar variant="horizontal" locations={locations} />
      </Container>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Handpicked
              </p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                Featured Properties
              </h2>
            </div>
            <Button variant="outline" render={<Link href="/properties" />}>
              View All Properties
            </Button>
          </div>

          <div className="mt-10">
            <PropertyGrid properties={featuredProperties} />
          </div>
        </Container>
      </section>

      <section className="bg-secondary/40 py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              How It Works
            </p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
              Three simple steps to your next place
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="flex flex-col items-center text-center"
              >
                <span className="text-sm font-bold tabular-nums text-primary/50">
                  0{i + 1}
                </span>
                <div className="mt-3 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <step.icon className="size-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="flex flex-col items-center gap-6 rounded-3xl bg-foreground px-6 py-14 text-center sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight text-background sm:text-4xl">
              Have a property to list?
            </h2>
            <p className="max-w-xl text-background/70">
              Publish your listing in minutes and reach buyers and renters
              actively searching in your area.
            </p>
            <Button
              size="lg"
              render={<Link href="/properties/add" />}
              className="mt-1"
            >
              Add Your Property
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
