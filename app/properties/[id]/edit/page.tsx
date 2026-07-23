import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { EditPropertyForm } from "@/components/property/EditPropertyForm";
import { mockProperties } from "@/lib/mock-data";

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

    return { title: `Edit ${property.title} | Lux Estate` };
}

export default async function EditPropertyPage({ params }: PageProps) {
    const { id } = await params;
    const property = mockProperties.find((p) => p.id === id);

    if (!property) notFound();

    return (
        <Container className="max-w-4xl">
            <div className="pb-6 pt-10 sm:pt-12">
                <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-tight text-neutral-900">
                    Edit Property
                </h1>
                <p className="mt-2 text-[15px] text-neutral-500">
                    Update the details for &quot;{property.title}&quot;.
                </p>
            </div>

            <EditPropertyForm property={property} />
        </Container>
    );
}
