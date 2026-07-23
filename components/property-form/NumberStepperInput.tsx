"use client";

import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

export function NumberStepperInput({
  id,
  value,
  onChange,
  min = 0,
  step = 1,
  hasError,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  min?: number;
  step?: number;
  hasError?: boolean;
}) {
  const numeric = value === "" ? min : Number(value);

  function adjust(delta: number) {
    onChange(String(Math.max(min, numeric + delta)));
  }

  return (
    <div
      className={cn(
        "flex h-11 items-center justify-between rounded-lg bg-white ring-1 transition-shadow duration-200",
        hasError ? "ring-rose-400" : "ring-neutral-300",
      )}
    >
      <button
        type="button"
        onClick={() => adjust(-step)}
        aria-label="Decrease"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!hasError || undefined}
        aria-describedby={hasError ? `${id}-error` : undefined}
        className="w-full min-w-0 flex-1 border-0 bg-transparent text-center text-[15px] text-neutral-900 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => adjust(step)}
        aria-label="Increase"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
