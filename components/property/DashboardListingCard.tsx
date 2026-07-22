"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, MapPin, Pencil, Ruler, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatPrice, formatSize } from "@/lib/format";
import { Button } from "@/components/ui/button";
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
import type { Property } from "@/types";

export function DashboardListingCard({
  property,
  onDelete,
}: {
  property: Property;
  onDelete: (id: string) => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isRent = property.listingType === "rent";

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border">
      <Link
        href={`/properties/${property.id}`}
        className="group relative block aspect-4/3 w-full overflow-hidden bg-muted"
      >
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white",
            isRent ? "bg-primary" : "bg-foreground",
          )}
        >
          {isRent ? "For Rent" : "For Sale"}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-lg font-bold tabular-nums tracking-tight text-foreground">
          {formatPrice(property.price, property.currency, property.listingType)}
        </p>
        <Link
          href={`/properties/${property.id}`}
          className="truncate text-base font-semibold text-foreground transition-colors hover:text-primary"
        >
          {property.title}
        </Link>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0 text-primary" />
          <span className="truncate">{property.location}</span>
        </p>

        <div className="flex items-center gap-2 pt-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <BedDouble className="size-4" />
            {property.bedrooms}
          </span>
          <span className="size-1 shrink-0 rounded-full bg-primary/50" />
          <span className="flex items-center gap-1">
            <Bath className="size-4" />
            {property.bathrooms}
          </span>
          <span className="size-1 shrink-0 rounded-full bg-primary/50" />
          <span className="flex items-center gap-1">
            <Ruler className="size-4" />
            {formatSize(property.size)}
          </span>
        </div>

        <div className="mt-3 flex gap-2 border-t border-border pt-3">
          <Button
            variant="outline"
            className="flex-1 gap-1.5"
            render={<Link href={`/properties/${property.id}/edit`} />}
          >
            <Pencil className="size-3.5" />
            Edit
          </Button>
          <Button
            variant="destructive"
            className="flex-1 gap-1.5"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="size-3.5" />
            Delete
          </Button>
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove &quot;{property.title}&quot; from
              Lux Estate. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                setConfirmOpen(false);
                onDelete(property.id);
              }}
            >
              Delete Listing
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
