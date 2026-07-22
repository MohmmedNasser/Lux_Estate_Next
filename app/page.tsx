import { Hero } from "@/components/home/Hero";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CtaBanner } from "@/components/home/CtaBanner";
import { mockProperties } from "@/lib/mock-data";
import { locations } from "@/lib/locations";

const featuredProperties = mockProperties.slice(0, 6);
const heroFeaturedProperty =
  mockProperties.find((property) => property.id === "prop-3") ??
  mockProperties[0];

export default function Home() {
  return (
    <>
      <Hero locations={locations} featuredProperty={heroFeaturedProperty} />
      <FeaturedProperties properties={featuredProperties} />
      <HowItWorks />
      <CtaBanner />
    </>
  );
}
