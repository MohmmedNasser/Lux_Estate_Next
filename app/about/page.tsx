import type { Metadata } from "next";

import { AboutHero } from "@/components/about/AboutHero";
import { WhyWeStarted } from "@/components/about/WhyWeStarted";
import { ValuesGrid } from "@/components/about/ValuesGrid";
import { TeamGrid } from "@/components/about/TeamGrid";
import { CtaBanner } from "@/components/home/CtaBanner";

export const metadata: Metadata = {
  title: "About | Lux Estate",
  description:
    "Learn about Lux Estate's mission to make buying, renting, and listing property refreshingly simple.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <WhyWeStarted />
      <ValuesGrid />
      <TeamGrid />
      <CtaBanner />
    </>
  );
}
