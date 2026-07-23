import type { Metadata } from "next";
import Link from "next/link";
import { Home as HomeIcon, KeyRound, ListChecks } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { ProfileHeader } from "@/components/dashboard/ProfileHeader";
import { StatsGrid } from "@/components/dashboard/StatCard";
import { DashboardListings } from "@/components/dashboard/DashboardListings";
import { mockProperties, mockUser } from "@/lib/mock-data";

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
    {
      label: "Total Listings",
      value: myListings.length,
      icon: <ListChecks className="size-5" aria-hidden="true" />,
    },
    {
      label: "For Sale",
      value: forSale,
      icon: <HomeIcon className="size-5" aria-hidden="true" />,
    },
    {
      label: "For Rent",
      value: forRent,
      icon: <KeyRound className="size-5" aria-hidden="true" />,
    },
  ];

  return (
    <Container className="py-10 sm:py-14">
      <ProfileHeader user={mockUser} />

      <StatsGrid stats={stats} />

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-[clamp(1.4rem,2.6vw,1.9rem)] font-semibold tracking-tight text-neutral-900">
          My Listings
        </h2>
        <Link
          href="/properties/add"
          className="hidden h-10 items-center justify-center rounded-full bg-amber-700 px-5 text-[14px] font-semibold text-white transition-colors hover:bg-amber-800 sm:inline-flex"
        >
          Add Property
        </Link>
      </div>

      <div className="mt-6">
        <DashboardListings initialListings={myListings} />
      </div>
    </Container>
  );
}
