"use client";

import { cloneElement, isValidElement, useState, type ReactElement } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";

interface FormFieldProps {
  id: string;
  label: React.ReactNode;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function FormField({ id, label, error, hint, icon, children }: FormFieldProps) {
  const reduce = useReducedMotion();
  const errorId = `${id}-error`;

  const wired = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        "aria-invalid": !!error || undefined,
        "aria-describedby": error ? errorId : undefined,
      })
    : children;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[12px] font-medium uppercase tracking-wide text-neutral-500"
      >
        {label}
      </label>

      {icon ? (
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 grid size-4 -translate-y-1/2 place-items-center text-neutral-400">
            {icon}
          </span>
          {wired}
        </div>
      ) : (
        wired
      )}

      {error ? (
        <motion.p
          id={errorId}
          role="alert"
          initial={reduce ? false : { opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-[12px] text-rose-600"
        >
          {error}
        </motion.p>
      ) : hint ? (
        <p className="text-[12px] text-neutral-500">{hint}</p>
      ) : null}
    </div>
  );
}

export function formInputClass(hasError: boolean, className?: string) {
  return cn(
    "w-full min-w-0 rounded-lg bg-white px-3.5 py-2.5 text-base text-neutral-900 ring-1 outline-none transition-shadow duration-200 placeholder:text-neutral-400 focus:ring-2 focus:ring-amber-600 disabled:cursor-not-allowed disabled:opacity-50 sm:text-[15px]",
    hasError ? "ring-rose-400" : "ring-neutral-300",
    className,
  );
}

export function formTextareaClass(hasError: boolean, className?: string) {
  return cn(
    "min-h-[120px] w-full min-w-0 resize-y rounded-lg bg-white px-3.5 py-3 text-base text-neutral-900 ring-1 outline-none transition-shadow duration-200 placeholder:text-neutral-400 focus:ring-2 focus:ring-amber-600 disabled:cursor-not-allowed disabled:opacity-50 sm:text-[15px]",
    hasError ? "ring-rose-400" : "ring-neutral-300",
    className,
  );
}

export function PasswordInput({
  id,
  value,
  onChange,
  hasError,
  placeholder,
  autoComplete,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!hasError || undefined}
        aria-describedby={hasError ? `${id}-error` : undefined}
        className={formInputClass(!!hasError, "h-11 pr-11")}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-1 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md text-neutral-400 transition-colors hover:text-neutral-600"
      >
        {visible ? (
          <EyeOff className="size-4" aria-hidden="true" />
        ) : (
          <Eye className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
