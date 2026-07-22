"use client";

import { useRouter } from "next/navigation";

import { PropertyForm } from "@/components/forms/PropertyForm";
import type { Property } from "@/types";

export function EditPropertyForm({ property }: { property: Property }) {
  const router = useRouter();

  function handleDelete() {
    console.log("Property deleted", {
      id: property.id,
      title: property.title,
    });
    router.push("/dashboard");
  }

  return (
    <PropertyForm mode="edit" initialProperty={property} onDelete={handleDelete} />
  );
}
