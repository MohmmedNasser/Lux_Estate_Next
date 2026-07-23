"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import { locations } from "@/lib/locations";
import { formatPropertyType } from "@/lib/format";
import { fadeUp } from "@/lib/motion";
import {
  FormField,
  formInputClass,
  formTextareaClass,
} from "@/components/ui/form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Stepper, type FormStep } from "@/components/property-form/Stepper";
import { SectionCard } from "@/components/property-form/SectionCard";
import { ListingTypeControl } from "@/components/property-form/ListingTypeControl";
import { NumberStepperInput } from "@/components/property-form/NumberStepperInput";
import { AmenityChips } from "@/components/property-form/AmenityChips";
import {
  ImageDropzone,
  type ImagePreview,
} from "@/components/property-form/ImageDropzone";
import { FormActionBar } from "@/components/property-form/FormActionBar";
import type { ListingType, Property, PropertyType } from "@/types";

const propertyTypes: PropertyType[] = [
  "apartment",
  "villa",
  "house",
  "land",
  "office",
  "shop",
];

const currencies = ["USD", "EUR", "GBP", "AED"];

const amenitiesList = [
  "parking",
  "elevator",
  "garden",
  "pool",
  "balcony",
  "furnished",
  "air conditioning",
  "security",
];

const steps: FormStep[] = [
  { id: "pf-section-basic", label: "Basic Info" },
  { id: "pf-section-pricing", label: "Pricing & Location" },
  { id: "pf-section-details", label: "Details" },
  { id: "pf-section-amenities", label: "Amenities" },
  { id: "pf-section-images", label: "Images" },
];

interface PropertyFormValues {
  title: string;
  description: string;
  propertyType: PropertyType | "";
  listingType: ListingType;
  price: string;
  currency: string;
  location: string;
  address: string;
  bedrooms: string;
  bathrooms: string;
  size: string;
  amenities: string[];
}

type FieldErrors = Partial<Record<keyof PropertyFormValues | "images", string>>;

const fieldSection: Record<string, string> = {
  title: "pf-section-basic",
  description: "pf-section-basic",
  propertyType: "pf-section-basic",
  price: "pf-section-pricing",
  location: "pf-section-pricing",
  bedrooms: "pf-section-details",
  bathrooms: "pf-section-details",
  size: "pf-section-details",
  images: "pf-section-images",
};

function valuesFromProperty(property?: Property): PropertyFormValues {
  if (!property) {
    return {
      title: "",
      description: "",
      propertyType: "",
      listingType: "buy",
      price: "",
      currency: "USD",
      location: "",
      address: "",
      bedrooms: "",
      bathrooms: "",
      size: "",
      amenities: [],
    };
  }

  return {
    title: property.title,
    description: property.description,
    propertyType: property.propertyType,
    listingType: property.listingType,
    price: property.price.toString(),
    currency: property.currency,
    location: property.location,
    address: property.address ?? "",
    bedrooms: property.bedrooms.toString(),
    bathrooms: property.bathrooms.toString(),
    size: property.size.toString(),
    amenities: property.amenities,
  };
}

const selectTriggerClass =
  "h-11 w-full rounded-lg bg-white px-3.5 text-[14px] text-neutral-700 ring-1 ring-neutral-300 outline-none transition-colors hover:ring-neutral-400 data-popup-open:ring-2 data-popup-open:ring-amber-600";

export function PropertyForm({
  mode,
  initialProperty,
  onDelete,
}: {
  mode: "add" | "edit";
  initialProperty?: Property;
  onDelete?: () => void;
}) {
  const isEdit = mode === "edit";
  const reduce = useReducedMotion();

  const [values, setValues] = useState<PropertyFormValues>(() =>
    valuesFromProperty(initialProperty),
  );
  const [images, setImages] = useState<ImagePreview[]>(() =>
    (initialProperty?.images ?? []).map((url, i) => ({
      id: `existing-${i}`,
      url,
    })),
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [highlightedSection, setHighlightedSection] = useState<string | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function set<K extends keyof PropertyFormValues>(
    field: K,
    value: PropertyFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function toggleAmenity(amenity: string) {
    setValues((current) => ({
      ...current,
      amenities: current.amenities.includes(amenity)
        ? current.amenities.filter((a) => a !== amenity)
        : [...current.amenities, amenity],
    }));
  }

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const newImages = Array.from(fileList)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
        url: URL.createObjectURL(file),
      }));

    if (newImages.length > 0) {
      setImages((prev) => [...prev, ...newImages]);
      setErrors((current) => ({ ...current, images: undefined }));
    }
  }

  function removeImage(id: string) {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  function validate(): boolean {
    const nextErrors: FieldErrors = {};

    if (values.title.trim().length < 5)
      nextErrors.title = "Title must be at least 5 characters.";
    if (values.description.trim().length < 20)
      nextErrors.description = "Description must be at least 20 characters.";
    if (!values.propertyType)
      nextErrors.propertyType = "Select a property type.";
    if (!values.price || Number(values.price) <= 0)
      nextErrors.price = "Enter a price greater than 0.";
    if (!values.location) nextErrors.location = "Select a location.";
    if (values.bedrooms === "" || Number(values.bedrooms) < 0)
      nextErrors.bedrooms = "Enter the number of bedrooms.";
    if (values.bathrooms === "" || Number(values.bathrooms) < 0)
      nextErrors.bathrooms = "Enter the number of bathrooms.";
    if (!values.size || Number(values.size) <= 0)
      nextErrors.size = "Enter a size greater than 0.";
    if (images.length === 0) nextErrors.images = "Add at least one photo.";

    setErrors(nextErrors);

    const errorFields = Object.keys(nextErrors);
    if (errorFields.length > 0) {
      const firstInvalidSection = steps
        .map((step) => step.id)
        .find((sectionId) =>
          errorFields.some((field) => fieldSection[field] === sectionId),
        );
      if (firstInvalidSection) {
        document
          .getElementById(firstInvalidSection)
          ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        setHighlightedSection(firstInvalidSection);
        window.setTimeout(() => setHighlightedSection(null), 1000);
      }
    }

    return errorFields.length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    window.setTimeout(() => {
      console.log(isEdit ? "Property updated" : "Property published", {
        ...values,
        price: Number(values.price),
        bedrooms: Number(values.bedrooms),
        bathrooms: Number(values.bathrooms),
        size: Number(values.size),
        images: images.map((image) => image.url),
      });
      setSubmitting(false);
      setSubmitted(true);
    }, 700);
  }

  if (submitted) {
    return (
      <motion.div
        {...(reduce
          ? {}
          : { initial: "hidden", animate: "visible", variants: fadeUp })}
        className="flex flex-col items-center rounded-2xl bg-white p-10 text-center ring-1 ring-neutral-200"
      >
        <CheckCircle2 className="size-12 text-amber-700" aria-hidden="true" />
        <h2 className="mt-4 text-xl font-semibold text-neutral-900">
          {isEdit ? "Changes saved" : "Listing published"}
        </h2>
        <p className="mt-2 text-[14px] text-neutral-500">
          {isEdit
            ? "Your property details have been updated (demo only)."
            : "Your property is now live on Lux Estate (demo only)."}
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-amber-700 px-6 text-[14px] font-semibold text-white transition-colors hover:bg-amber-800"
        >
          Go to Dashboard
        </Link>
      </motion.div>
    );
  }

  const locationItems = locations.map((loc) => ({ value: loc, label: loc }));
  const propertyTypeItems = propertyTypes.map((type) => ({
    value: type,
    label: formatPropertyType(type),
  }));
  const currencyItems = currencies.map((currency) => ({
    value: currency,
    label: currency,
  }));

  return (
    <>
      <Stepper steps={steps} />

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-6 pb-24 pt-6"
      >
        <SectionCard
          id="pf-section-basic"
          number="01"
          title="Basic Info"
          highlight={highlightedSection === "pf-section-basic"}
        >
          <FormField id="pf-title" label="Title" error={errors.title}>
            <input
              id="pf-title"
              value={values.title}
              onChange={(e) => set("title", e.target.value)}
              className={formInputClass(!!errors.title, "h-11")}
              placeholder="e.g. Modern Downtown Apartment"
            />
          </FormField>

          <FormField
            id="pf-description"
            label="Description"
            error={errors.description}
          >
            <textarea
              id="pf-description"
              value={values.description}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
              className={formTextareaClass(!!errors.description)}
              placeholder="Describe the property..."
            />
          </FormField>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              id="pf-property-type"
              label="Property Type"
              error={errors.propertyType}
            >
              <Select
                items={propertyTypeItems}
                value={values.propertyType}
                onValueChange={(value) =>
                  set("propertyType", (value ?? "") as PropertyType | "")
                }
              >
                <SelectTrigger
                  id="pf-property-type"
                  aria-invalid={!!errors.propertyType || undefined}
                  aria-describedby={
                    errors.propertyType ? "pf-property-type-error" : undefined
                  }
                  className={selectTriggerClass}
                >
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypeItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <div className="flex flex-col gap-1.5">
              <span className="text-[12px] font-medium uppercase tracking-wide text-neutral-500">
                Listing Type
              </span>
              <ListingTypeControl
                value={values.listingType}
                onChange={(value) => set("listingType", value)}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          id="pf-section-pricing"
          number="02"
          title="Pricing & Location"
          highlight={highlightedSection === "pf-section-pricing"}
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField id="pf-price" label="Price" error={errors.price}>
              <div className="flex gap-2">
                <input
                  id="pf-price"
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={values.price}
                  onChange={(e) => set("price", e.target.value)}
                  aria-invalid={!!errors.price || undefined}
                  aria-describedby={errors.price ? "pf-price-error" : undefined}
                  className={formInputClass(!!errors.price, "h-11 flex-1")}
                  placeholder="e.g. 350000"
                />
                <Select
                  items={currencyItems}
                  value={values.currency}
                  onValueChange={(value) => set("currency", value ?? "USD")}
                >
                  <SelectTrigger
                    id="pf-currency"
                    aria-label="Currency"
                    className={`${selectTriggerClass} w-24 shrink-0 px-2.5`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </FormField>

            <FormField
              id="pf-location"
              label="Location"
              error={errors.location}
            >
              <Select
                items={locationItems}
                value={values.location}
                onValueChange={(value) => set("location", value ?? "")}
              >
                <SelectTrigger
                  id="pf-location"
                  aria-invalid={!!errors.location || undefined}
                  aria-describedby={
                    errors.location ? "pf-location-error" : undefined
                  }
                  className={selectTriggerClass}
                >
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  {locationItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <FormField
            id="pf-address"
            label={
              <>
                Address{" "}
                <span className="text-[10px] normal-case text-neutral-400">
                  (optional)
                </span>
              </>
            }
          >
            <input
              id="pf-address"
              value={values.address}
              onChange={(e) => set("address", e.target.value)}
              className={formInputClass(false, "h-11")}
              placeholder="Street address"
            />
          </FormField>
        </SectionCard>

        <SectionCard
          id="pf-section-details"
          number="03"
          title="Details"
          highlight={highlightedSection === "pf-section-details"}
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <FormField id="pf-bedrooms" label="Bedrooms" error={errors.bedrooms}>
              <NumberStepperInput
                id="pf-bedrooms"
                value={values.bedrooms}
                onChange={(value) => set("bedrooms", value)}
                hasError={!!errors.bedrooms}
              />
            </FormField>

            <FormField
              id="pf-bathrooms"
              label="Bathrooms"
              error={errors.bathrooms}
            >
              <NumberStepperInput
                id="pf-bathrooms"
                value={values.bathrooms}
                onChange={(value) => set("bathrooms", value)}
                hasError={!!errors.bathrooms}
              />
            </FormField>

            <FormField id="pf-size" label="Size (m²)" error={errors.size}>
              <NumberStepperInput
                id="pf-size"
                value={values.size}
                onChange={(value) => set("size", value)}
                step={10}
                hasError={!!errors.size}
              />
            </FormField>
          </div>
        </SectionCard>

        <SectionCard
          id="pf-section-amenities"
          number="04"
          title="Amenities"
          highlight={highlightedSection === "pf-section-amenities"}
        >
          <AmenityChips
            amenities={amenitiesList}
            selected={values.amenities}
            onToggle={toggleAmenity}
          />
        </SectionCard>

        <SectionCard
          id="pf-section-images"
          number="05"
          title="Images"
          highlight={highlightedSection === "pf-section-images"}
        >
          <ImageDropzone
            images={images}
            onAdd={addFiles}
            onRemove={removeImage}
            hasError={!!errors.images}
          />
          {errors.images && (
            <p className="text-[12px] text-rose-600">{errors.images}</p>
          )}
        </SectionCard>

        <FormActionBar
          submitting={submitting}
          submitLabel={isEdit ? "Save Changes" : "Publish Listing"}
          onDeleteClick={
            isEdit && onDelete ? () => setShowDeleteConfirm(true) : undefined
          }
        />
      </form>

      {isEdit && onDelete && (
        <ConfirmDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          title="Delete this listing?"
          description={`This will permanently remove "${initialProperty?.title}" from Lux Estate. This can't be undone.`}
          confirmLabel="Confirm Delete"
          onConfirm={onDelete}
        />
      )}
    </>
  );
}
