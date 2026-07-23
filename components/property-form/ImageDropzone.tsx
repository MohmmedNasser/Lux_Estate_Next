"use client";

import { useRef, useState } from "react";
import { ImagePlus, UploadCloud, X } from "lucide-react";

import { cn } from "@/lib/utils";

export interface ImagePreview {
  id: string;
  url: string;
}

export function ImageDropzone({
  images,
  onAdd,
  onRemove,
  hasError,
}: {
  images: ImagePreview[];
  onAdd: (files: FileList | null) => void;
  onRemove: (id: string) => void;
  hasError?: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasImages = images.length > 0;

  function openPicker() {
    fileInputRef.current?.click();
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          onAdd(e.dataTransfer.files);
        }}
        onClick={openPicker}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPicker();
          }
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600",
          hasImages ? "gap-2 px-6 py-4" : "gap-3 px-6 py-10",
          isDragging
            ? "border-amber-600 bg-amber-50/40"
            : hasError
              ? "border-rose-400"
              : "border-neutral-300 hover:border-neutral-400",
        )}
      >
        <span className="grid size-11 place-items-center rounded-full bg-neutral-100 text-neutral-500">
          {hasImages ? (
            <ImagePlus className="size-5" aria-hidden="true" />
          ) : (
            <UploadCloud className="size-5" aria-hidden="true" />
          )}
        </span>
        <p className="text-[14px] font-medium text-neutral-900">
          {hasImages
            ? "Add more photos"
            : "Drag and drop photos here, or click to browse"}
        </p>
        {!hasImages && (
          <p className="text-[13px] text-neutral-500">
            PNG or JPG, multiple files supported
          </p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onAdd(e.target.files)}
        />
      </div>

      {hasImages && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-lg bg-neutral-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt="Property preview"
                className="size-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(image.id)}
                className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
                aria-label="Remove photo"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
