"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { UploadCloud, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { locations } from "@/lib/locations";
import { formatAmenity, formatPropertyType } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { FormField, formInputClass } from "@/components/ui/form-field";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

interface ImagePreview {
  id: string;
  url: string;
}

type FieldErrors = Partial<Record<keyof PropertyFormValues | "images", string>>;

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
  const [isDragging, setIsDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    console.log(isEdit ? "Property updated" : "Property published", {
      ...values,
      price: Number(values.price),
      bedrooms: Number(values.bedrooms),
      bathrooms: Number(values.bathrooms),
      size: Number(values.size),
      images: images.map((image) => image.url),
    });

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl bg-card p-10 text-center shadow-sm ring-1 ring-border">
        <h2 className="text-xl font-bold text-foreground">
          {isEdit ? "Changes saved" : "Listing published"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {isEdit
            ? "Your property details have been updated (demo only)."
            : "Your property is now live on Lux Estate (demo only)."}
        </p>
        <Button className="mt-6" render={<Link href="/dashboard" />}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      <FormSection number="01" title="Basic Info">
        <FormField id="pf-title" label="Title" error={errors.title}>
          <input
            id="pf-title"
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            className={formInputClass(!!errors.title)}
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
            className={formInputClass(!!errors.description)}
            placeholder="Describe the property..."
          />
        </FormField>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            id="pf-property-type"
            label="Property Type"
            error={errors.propertyType}
          >
            <NativeSelect
              id="pf-property-type"
              value={values.propertyType}
              onChange={(e) =>
                set("propertyType", e.target.value as PropertyType)
              }
            >
              <option value="">Select a type</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {formatPropertyType(type)}
                </option>
              ))}
            </NativeSelect>
          </FormField>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Listing Type
            </span>
            <div className="inline-flex rounded-lg bg-secondary p-1">
              {(["buy", "rent"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => set("listingType", option)}
                  className={cn(
                    "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                    values.listingType === option
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {option === "buy" ? "For Sale" : "For Rent"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection number="02" title="Pricing & Location">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField id="pf-price" label="Price" error={errors.price}>
            <input
              id="pf-price"
              type="number"
              min={0}
              inputMode="numeric"
              value={values.price}
              onChange={(e) => set("price", e.target.value)}
              className={formInputClass(!!errors.price)}
              placeholder="e.g. 350000"
            />
          </FormField>

          <FormField id="pf-currency" label="Currency">
            <NativeSelect
              id="pf-currency"
              value={values.currency}
              onChange={(e) => set("currency", e.target.value)}
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </NativeSelect>
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField id="pf-location" label="Location" error={errors.location}>
            <NativeSelect
              id="pf-location"
              value={values.location}
              onChange={(e) => set("location", e.target.value)}
            >
              <option value="">Select a location</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </NativeSelect>
          </FormField>

          <FormField id="pf-address" label="Address (optional)">
            <input
              id="pf-address"
              value={values.address}
              onChange={(e) => set("address", e.target.value)}
              className={formInputClass(false)}
              placeholder="Street address"
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection number="03" title="Details">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <FormField
            id="pf-bedrooms"
            label="Bedrooms"
            error={errors.bedrooms}
          >
            <input
              id="pf-bedrooms"
              type="number"
              min={0}
              inputMode="numeric"
              value={values.bedrooms}
              onChange={(e) => set("bedrooms", e.target.value)}
              className={formInputClass(!!errors.bedrooms)}
              placeholder="0"
            />
          </FormField>

          <FormField
            id="pf-bathrooms"
            label="Bathrooms"
            error={errors.bathrooms}
          >
            <input
              id="pf-bathrooms"
              type="number"
              min={0}
              inputMode="numeric"
              value={values.bathrooms}
              onChange={(e) => set("bathrooms", e.target.value)}
              className={formInputClass(!!errors.bathrooms)}
              placeholder="0"
            />
          </FormField>

          <FormField id="pf-size" label="Size (m²)" error={errors.size}>
            <input
              id="pf-size"
              type="number"
              min={0}
              inputMode="numeric"
              value={values.size}
              onChange={(e) => set("size", e.target.value)}
              className={formInputClass(!!errors.size)}
              placeholder="0"
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection number="04" title="Amenities">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {amenitiesList.map((amenity) => {
            const checked = values.amenities.includes(amenity);
            return (
              <label
                key={amenity}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors",
                  checked
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-input text-muted-foreground hover:border-foreground/30",
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleAmenity(amenity)}
                  className="size-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                {formatAmenity(amenity)}
              </label>
            );
          })}
        </div>
      </FormSection>

      <FormSection number="05" title="Images">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            addFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            isDragging
              ? "border-primary bg-primary/5"
              : errors.images
                ? "border-destructive"
                : "border-border hover:border-primary/50",
          )}
        >
          <UploadCloud className="size-8 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">
            Drag and drop photos here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            PNG or JPG, multiple files supported
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>
        {errors.images && (
          <p className="text-xs text-destructive">{errors.images}</p>
        )}

        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt="Property preview"
                  className="size-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                  aria-label="Remove photo"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </FormSection>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {isEdit && onDelete ? (
          <Button
            type="button"
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Listing
          </Button>
        ) : (
          <span />
        )}
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <Button type="button" variant="outline" render={<Link href="/dashboard" />}>
            Cancel
          </Button>
          <Button type="submit" size="lg">
            {isEdit ? "Save Changes" : "Publish Listing"}
          </Button>
        </div>
      </div>

      {isEdit && onDelete && (
        <AlertDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove &quot;{initialProperty?.title}
                &quot; from Lux Estate. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={onDelete}>
                Delete Listing
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </form>
  );
}

function FormSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5 rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border sm:p-8">
      <div className="flex items-baseline gap-3">
        <span className="text-sm font-bold tabular-nums text-primary/60">
          {number}
        </span>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}
