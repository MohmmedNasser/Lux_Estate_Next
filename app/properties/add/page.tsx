import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { PropertyForm } from "@/components/forms/PropertyForm";

export const metadata: Metadata = {
  title: "Add Property | Lux Estate",
  description: "Publish a new property listing on Lux Estate.",
};

export default function AddPropertyPage() {
  return (
    <Container className="max-w-3xl py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Add Property
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Fill in the details below to publish your listing.
        </p>
      </div>

      <PropertyForm mode="add" />
    </Container>
  );
}
