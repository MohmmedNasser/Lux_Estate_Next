import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyOverview } from "@/components/property/PropertyOverview";
import { AmenitiesGrid } from "@/components/property/AmenitiesGrid";
import { LocationMap } from "@/components/property/LocationMap";
import { OwnerCard } from "@/components/property/OwnerCard";
import { MobileActionBar } from "@/components/property/MobileActionBar";
import { SimilarProperties } from "@/components/property/SimilarProperties";
import { mockOwners, mockProperties } from "@/lib/mock-data";
import { formatPropertyType } from "@/lib/format";

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
  const typeLabel = formatPropertyType(property.propertyType);

  const similarProperties = mockProperties
    .filter((p) => p.id !== property.id)
    .sort((a, b) => {
      const score = (p: (typeof mockProperties)[number]) =>
        (p.propertyType === property.propertyType ? 1 : 0) +
        (p.listingType === property.listingType ? 1 : 0);
      return score(b) - score(a);
    })
    .slice(0, 3);

  const sectionDivider = "border-b border-neutral-200 pb-8";

  return (
    <>
      <Container className="pt-6 pb-24 sm:pt-8 lg:pb-16">
        <PropertyHeader
          id={property.id}
          title={property.title}
          typeLabel={typeLabel}
          location={property.location}
          isRent={property.listingType === "rent"}
        />

        <div className="mt-6 lg:mt-8">
          <PropertyGallery images={property.images} title={property.title} />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:mt-14 lg:grid-cols-[1fr_380px] lg:gap-12 xl:grid-cols-[1fr_400px]">
          {/* A — Price & overview */}
          <section
            className={`order-1 ${sectionDivider} lg:col-start-1 lg:row-start-1`}
          >
            <PropertyOverview
              property={property}
              ownerName={owner.name}
              ownerAvatar={owner.avatar}
              typeLabel={typeLabel}
            />
          </section>

          {/* B — Description */}
          <section
            className={`order-2 ${sectionDivider} lg:col-start-1 lg:row-start-2`}
          >
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">
              Description
            </h2>
            <p className="max-w-[68ch] text-[15.5px] leading-[1.75] text-neutral-600">
              {property.description}
            </p>
          </section>

          {/* Sticky owner card — renders after the description on mobile */}
          <aside className="order-3 lg:col-start-2 lg:row-start-1 lg:row-span-4 lg:self-start lg:sticky lg:top-24">
            <OwnerCard property={property} owner={owner} />
          </aside>

          {/* C — Amenities */}
          <section
            className={`order-4 ${sectionDivider} lg:col-start-1 lg:row-start-3`}
          >
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">
              Amenities
            </h2>
            <AmenitiesGrid amenities={property.amenities} />
          </section>

          {/* D — Location */}
          <section className="order-5 lg:col-start-1 lg:row-start-4">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">
              Location
            </h2>
            <LocationMap
              address={property.address ?? ""}
              location={property.location}
            />
          </section>
        </div>

        <SimilarProperties properties={similarProperties} />
      </Container>

      <MobileActionBar property={property} />
    </>
  );
}
