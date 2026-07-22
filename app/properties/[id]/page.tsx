import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Bath,
  BedDouble,
  Building2,
  CheckCircle2,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Ruler,
} from "lucide-react";

import { Container } from "@/components/layout/Container";
import { buttonVariants } from "@/components/ui/button";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { InquiryForm } from "@/components/property/InquiryForm";
import { mockOwners, mockProperties } from "@/lib/mock-data";
import {
  formatAmenity,
  formatPrice,
  formatPropertyType,
  formatSize,
} from "@/lib/format";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const property = mockProperties.find((p) => p.id === id);

  if (!property) {
    return { title: "Property Not Found | Lux Estate" };
  }

  return {
    title: `${property.title} | Lux Estate`,
    description: property.description,
  };
}

export default async function PropertyDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const property = mockProperties.find((p) => p.id === id);

  if (!property) notFound();

  const owner = mockOwners[property.ownerId];
  const isRent = property.listingType === "rent";

  const similarProperties = mockProperties
    .filter((p) => p.id !== property.id)
    .sort((a, b) => {
      const score = (p: typeof a) =>
        (p.propertyType === property.propertyType ? 1 : 0) +
        (p.listingType === property.listingType ? 1 : 0);
      return score(b) - score(a);
    })
    .slice(0, 3);

  const specs = [
    { label: "Bedrooms", value: property.bedrooms, icon: BedDouble },
    { label: "Bathrooms", value: property.bathrooms, icon: Bath },
    { label: "Size", value: formatSize(property.size), icon: Ruler },
    {
      label: "Type",
      value: formatPropertyType(property.propertyType),
      icon: Building2,
    },
  ];

  return (
    <Container className="py-8 sm:py-12">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Link href="/" className="transition-colors hover:text-primary">
          Home
        </Link>
        <ChevronRight className="size-3.5 shrink-0" />
        <Link
          href="/properties"
          className="transition-colors hover:text-primary"
        >
          Properties
        </Link>
        <ChevronRight className="size-3.5 shrink-0" />
        <span className="truncate text-foreground">{property.title}</span>
      </nav>

      <div className="mt-6">
        <PropertyGallery images={property.images} title={property.title} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white",
                  isRent ? "bg-primary" : "bg-foreground",
                )}
              >
                {isRent ? "For Rent" : "For Sale"}
              </span>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-3.5 text-primary" />
                {property.address ?? property.location}
              </p>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {property.title}
            </h1>
            <p className="mt-3 text-3xl font-bold tabular-nums tracking-tight text-primary">
              {formatPrice(
                property.price,
                property.currency,
                property.listingType,
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-2xl bg-secondary/40 p-5 sm:grid-cols-4">
            {specs.map((spec) => (
              <div
                key={spec.label}
                className="flex flex-col items-center gap-1.5 text-center"
              >
                <spec.icon className="size-5 text-primary" />
                <span className="text-base font-bold tabular-nums text-foreground">
                  {spec.value}
                </span>
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  {spec.label}
                </span>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Description
            </h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              {property.description}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Amenities
            </h2>
            {property.amenities.length > 0 ? (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <CheckCircle2 className="size-4 shrink-0 text-primary" />
                    {formatAmenity(amenity)}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                No amenities listed for this property.
              </p>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Location
            </h2>
            <div className="mt-3 flex h-56 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-secondary/30 text-center">
              <MapPin className="size-6 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                {property.address ?? property.location}
              </p>
              <p className="text-xs text-muted-foreground">
                Interactive map coming soon
              </p>
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
            <div className="flex items-center gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-muted">
                <Image
                  src={owner.avatar}
                  alt={owner.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-foreground">{owner.name}</p>
                <p className="text-sm text-muted-foreground">
                  Property Owner
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 text-sm">
              <a
                href={`tel:${owner.phone}`}
                className="flex items-center gap-2 text-foreground transition-colors hover:text-primary"
              >
                <Phone className="size-4 text-primary" />
                {owner.phone}
              </a>
              <a
                href={`mailto:${owner.email}`}
                className="flex items-center gap-2 text-foreground transition-colors hover:text-primary"
              >
                <Mail className="size-4 text-primary" />
                {owner.email}
              </a>
            </div>

            <a
              href="#inquiry-form"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "mt-5 w-full",
              )}
            >
              {isRent ? "Rent Now" : "Buy Now"}
            </a>

            <div className="mt-6 border-t border-border pt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Send an Inquiry
              </h2>
              <div className="mt-3">
                <InquiryForm propertyId={property.id} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {similarProperties.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Similar Properties
          </h2>
          <div className="mt-6">
            <PropertyGrid properties={similarProperties} />
          </div>
        </div>
      )}
    </Container>
  );
}
