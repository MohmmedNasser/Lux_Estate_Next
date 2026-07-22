"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { CheckCircle2, Loader2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { isValidEmail } from "@/lib/validation";

interface InquiryModalProps {
  open: boolean;
  onClose: () => void;
  propertyId: string;
  title: string;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}

interface Values {
  name: string;
  email: string;
  phone: string;
  message: string;
}

type Errors = Partial<Record<keyof Values, string>>;
type Status = "idle" | "submitting" | "success";

const initialValues: Values = { name: "", email: "", phone: "", message: "" };

const inputClass =
  "h-11 w-full rounded-lg bg-white px-3.5 text-base text-neutral-900 ring-1 ring-neutral-300 outline-none transition placeholder:text-neutral-400 focus:ring-2 focus:ring-amber-600 sm:text-[15px]";
const labelClass =
  "text-[12px] font-medium uppercase tracking-wide text-neutral-500";

export function InquiryModal({
  open,
  onClose,
  propertyId,
  title,
  returnFocusRef,
}: InquiryModalProps) {
  const reduceMotion = useReducedMotion();
  const mounted = useMounted();
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<number | undefined>(undefined);

  const [values, setValues] = useState<Values>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  function setField(field: keyof Values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate(): boolean {
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Enter your name.";
    if (!values.email.trim()) next.email = "Enter your email.";
    else if (!isValidEmail(values.email)) next.email = "Enter a valid email address.";
    if (!values.message.trim()) next.message = "Add a short message.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status !== "idle") return;
    if (!validate()) return;

    setStatus("submitting");
    timeoutRef.current = window.setTimeout(() => {
      console.log("Inquiry submitted", {
        propertyId,
        ...values,
        createdAt: new Date().toISOString(),
      });
      setStatus("success");
    }, 700);
  }

  function handleClose() {
    onClose();
    // Reset after the exit animation so the panel doesn't flash mid-close.
    timeoutRef.current = window.setTimeout(() => {
      setValues(initialValues);
      setErrors({});
      setStatus("idle");
    }, 250);
  }

  // Scroll lock + Esc + focus trap.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.classList.add("overflow-hidden");

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      root.classList.remove("overflow-hidden");
      document.removeEventListener("keydown", onKeyDown);
    };
    // handleClose is stable enough for this dialog's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Focus the first field on open; restore focus to the trigger on close.
  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => firstFieldRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
    returnFocusRef?.current?.focus();
  }, [open, returnFocusRef]);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.y > 120) handleClose();
  }

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          className="fixed inset-0 z-80 flex items-end justify-center sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 bg-neutral-950/50"
            onClick={handleClose}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Contact the owner about ${title}`}
            drag={reduceMotion ? false : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={handleDragEnd}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="relative w-full rounded-t-2xl bg-white p-6 shadow-xl sm:max-w-md sm:rounded-2xl"
          >
            {/* Drag handle (mobile) */}
            <div
              aria-hidden="true"
              className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-neutral-200 sm:hidden"
            />

            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
            >
              <X className="size-5" aria-hidden="true" />
            </button>

            {status === "success" ? (
              <div className="flex flex-col items-center py-6 text-center">
                <CheckCircle2 className="size-12 text-amber-700" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-semibold text-neutral-900">
                  Message sent
                </h2>
                <p className="mt-1 max-w-xs text-[14px] text-neutral-500">
                  The owner will get back to you shortly. We&apos;ve shared your
                  contact details with them.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-neutral-900 px-6 text-[15px] font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h2 className="pr-10 text-lg font-semibold text-neutral-900">
                  Contact the owner
                </h2>
                <p className="mt-1 text-[13px] text-neutral-500">
                  Send a message about this listing.
                </p>

                <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-4">
                  <Field id="inq-name" label="Name" error={errors.name}>
                    <input
                      ref={firstFieldRef}
                      id="inq-name"
                      value={values.name}
                      onChange={(e) => setField("name", e.target.value)}
                      className={cn(inputClass, errors.name && "ring-rose-400")}
                      placeholder="Your name"
                    />
                  </Field>

                  <Field id="inq-email" label="Email" error={errors.email}>
                    <input
                      id="inq-email"
                      type="email"
                      value={values.email}
                      onChange={(e) => setField("email", e.target.value)}
                      className={cn(inputClass, errors.email && "ring-rose-400")}
                      placeholder="you@example.com"
                    />
                  </Field>

                  <Field id="inq-phone" label="Phone (optional)">
                    <input
                      id="inq-phone"
                      type="tel"
                      value={values.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      className={inputClass}
                      placeholder="+1 555 555 0100"
                    />
                  </Field>

                  <Field id="inq-message" label="Message" error={errors.message}>
                    <textarea
                      id="inq-message"
                      value={values.message}
                      onChange={(e) => setField("message", e.target.value)}
                      rows={4}
                      className={cn(
                        inputClass,
                        "h-auto py-3 leading-relaxed",
                        errors.message && "ring-rose-400",
                      )}
                      placeholder="I'd like to schedule a viewing…"
                    />
                  </Field>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-amber-700 text-[15px] font-semibold text-white transition-colors hover:bg-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 disabled:opacity-70"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                        Sending…
                      </>
                    ) : (
                      "Send message"
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
      {error && <p className="text-[12px] text-rose-600">{error}</p>}
    </div>
  );
}

/** `false` on the server, `true` on the client — portal safety without an effect. */
function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
