import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Home as HomeIcon, KeyRound, ListChecks } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { EditProfileButton } from "@/components/property/EditProfileButton";
import { DashboardListings } from "@/components/property/DashboardListings";
import { mockProperties, mockUser } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Dashboard | Lux Estate",
  description: "Manage your Lux Estate profile and property listings.",
};

export default function DashboardPage() {
  const myListings = mockProperties.filter(
    (property) => property.ownerId === mockUser.id,
  );
  const forSale = myListings.filter(
    (property) => property.listingType === "buy",
  ).length;
  const forRent = myListings.filter(
    (property) => property.listingType === "rent",
  ).length;

  const stats = [
    { label: "Total Listings", value: myListings.length, icon: ListChecks },
    { label: "For Sale", value: forSale, icon: HomeIcon },
    { label: "For Rent", value: forRent, icon: KeyRound },
  ];

  return (
    <Container className="py-10 sm:py-14">
      <div className="flex flex-col gap-6 rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-center gap-4">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-muted">
            <Image
              src={mockUser.avatar ?? ""}
              alt={mockUser.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {mockUser.name}
            </h1>
            <p className="text-sm text-muted-foreground">{mockUser.email}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Member since {formatDate(mockUser.createdAt)}
            </p>
          </div>
        </div>
        <EditProfileButton />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <stat.icon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            My Listings
          </h2>
          <Button
            render={<Link href="/properties/add" />}
            className="hidden sm:inline-flex"
          >
            Add Property
          </Button>
        </div>
        <div className="mt-6">
          <DashboardListings initialListings={myListings} />
        </div>
      </div>
    </Container>
  );
}
