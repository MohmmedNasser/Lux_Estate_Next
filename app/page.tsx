import Link from "next/link";
import { Building2 } from "lucide-react";

import { Hero } from "@/components/home/Hero";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CtaBanner } from "@/components/home/CtaBanner";
import { Container } from "@/components/layout/Container";
import { getFeaturedProperties } from "@/lib/actions/property.actions";
import { locations } from "@/lib/locations";

export default async function Home() {
  const properties = await getFeaturedProperties(6);
  const heroFeaturedProperty = properties[0];

  return (
    <>
      <Hero locations={locations} featuredProperty={heroFeaturedProperty} />
      {properties.length > 0 ? (
        <FeaturedProperties properties={properties} />
      ) : (
        <section className="pt-20 pb-20 sm:pt-24 sm:pb-24 lg:pt-32 lg:pb-32">
          <Container>
            <div className="flex flex-col items-center py-8 text-center">
              <div className="mb-5 grid size-14 place-items-center rounded-full bg-neutral-100 text-neutral-400">
                <Building2 className="size-6" aria-hidden="true" />
              </div>
              <h3 className="text-[17px] font-semibold text-neutral-900">
                No properties listed yet
              </h3>
              <p className="mt-2 max-w-[38ch] text-[14px] text-neutral-500">
                Be the first to list a property and reach interested buyers
                and renters.
              </p>
              <Link
                href="/properties/add"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-neutral-900 px-6 text-[14px] font-semibold text-white transition-colors hover:bg-neutral-800"
              >
                Add Your Property
              </Link>
            </div>
          </Container>
        </section>
      )}
      <HowItWorks />
      <CtaBanner />
    </>
  );
}
