import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { PropertyForm } from "@/components/forms/PropertyForm";

export const metadata: Metadata = {
    title: "Add Property | Lux Estate",
    description: "Publish a new property listing on Lux Estate.",
};

export default function AddPropertyPage() {
    return (
        <Container className="max-w-4xl">
            <div className="pb-6 pt-10 sm:pt-12">
                <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-tight text-neutral-900">
                    Add Property
                </h1>
                <p className="mt-2 text-[15px] text-neutral-500">
                    Fill in the details below to publish your listing.
                </p>
            </div>

            <PropertyForm mode="add" />
        </Container>
    );
}
