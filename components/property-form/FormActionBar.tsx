"use client";

import Link from "next/link";
import { Loader2, Trash2 } from "lucide-react";

export function FormActionBar({
  submitting,
  submitLabel,
  cancelHref = "/dashboard",
  onDeleteClick,
}: {
  submitting: boolean;
  submitLabel: string;
  cancelHref?: string;
  onDeleteClick?: () => void;
}) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 flex flex-col-reverse items-center gap-3 border-t border-neutral-200 bg-white/95 px-4 py-4 backdrop-blur sm:mx-0 sm:flex-row sm:justify-between sm:rounded-b-2xl sm:px-6">
      {onDeleteClick ? (
        <button
          type="button"
          onClick={onDeleteClick}
          className="inline-flex h-11 items-center gap-2 rounded-lg px-4 text-[13px] font-medium text-rose-600 ring-1 ring-rose-200 transition-colors hover:bg-rose-50 sm:h-auto sm:px-0 sm:ring-0 sm:hover:bg-transparent sm:hover:underline"
        >
          <Trash2 className="size-4 sm:hidden" aria-hidden="true" />
          Delete Listing
        </button>
      ) : (
        <p className="hidden text-[13px] text-neutral-500 sm:block">
          All fields marked * are required
        </p>
      )}

      <div className="flex w-full gap-3 sm:w-auto">
        <Link
          href={cancelHref}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-lg px-6 text-[14px] font-medium text-neutral-700 ring-1 ring-neutral-300 transition-colors hover:bg-neutral-50 sm:flex-none"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-amber-700 px-6 text-[14px] font-semibold text-white transition-colors hover:bg-amber-800 disabled:opacity-70 sm:flex-none"
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Publishing…
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </div>
  );
}
