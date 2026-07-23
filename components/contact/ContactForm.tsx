"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";

import { isValidEmail } from "@/lib/validation";
import { fadeUp } from "@/lib/motion";
import {
  FormField,
  formInputClass,
  formTextareaClass,
} from "@/components/ui/form-field";

interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type FieldErrors = Partial<Record<keyof ContactFormValues, string>>;

const initialValues: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export function ContactForm() {
  const reduce = useReducedMotion();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  function handleChange(field: keyof ContactFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate(): boolean {
    const nextErrors: FieldErrors = {};
    if (!values.name.trim()) nextErrors.name = "Enter your name.";
    if (!values.email.trim()) {
      nextErrors.email = "Enter your email.";
    } else if (!isValidEmail(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!values.subject.trim()) nextErrors.subject = "Add a subject.";
    if (!values.message.trim()) nextErrors.message = "Add a message.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    window.setTimeout(() => {
      console.log("Contact message submitted", {
        ...values,
        createdAt: new Date().toISOString(),
      });
      setStatus("success");
    }, 600);
  }

  return (
    <motion.div
      {...(reduce
        ? {}
        : { initial: "hidden", animate: "visible", variants: fadeUp })}
      className="rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)] ring-1 ring-neutral-200 sm:p-8"
    >
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.div
            key="success"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center py-10 text-center"
          >
            <CheckCircle2
              className="size-12 text-amber-700"
              aria-hidden="true"
            />
            <h2 className="mt-4 text-lg font-semibold text-neutral-900">
              Message sent
            </h2>
            <p className="mt-1.5 max-w-xs text-[14px] text-neutral-500">
              We&apos;ll reply within one business day.
            </p>
            <button
              type="button"
              onClick={() => {
                setValues(initialValues);
                setStatus("idle");
              }}
              className="mt-6 inline-flex h-11 items-center justify-center rounded-lg px-6 text-[14px] font-medium text-neutral-700 ring-1 ring-neutral-300 transition-colors hover:bg-neutral-50"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField id="contact-name" label="Name" error={errors.name}>
                <input
                  id="contact-name"
                  value={values.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={formInputClass(!!errors.name, "h-11")}
                  placeholder="Your name"
                />
              </FormField>

              <FormField id="contact-email" label="Email" error={errors.email}>
                <input
                  id="contact-email"
                  type="email"
                  value={values.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={formInputClass(!!errors.email, "h-11")}
                  placeholder="you@example.com"
                />
              </FormField>
            </div>

            <FormField
              id="contact-subject"
              label="Subject"
              error={errors.subject}
            >
              <input
                id="contact-subject"
                value={values.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                className={formInputClass(!!errors.subject, "h-11")}
                placeholder="How can we help?"
              />
            </FormField>

            <FormField
              id="contact-message"
              label="Message"
              error={errors.message}
            >
              <textarea
                id="contact-message"
                value={values.message}
                onChange={(e) => handleChange("message", e.target.value)}
                rows={5}
                className={formTextareaClass(!!errors.message)}
                placeholder="Tell us more..."
              />
            </FormField>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-2 inline-flex h-11 items-center justify-center gap-2 self-start rounded-lg bg-amber-700 px-8 text-[14px] font-semibold text-white transition-colors hover:bg-amber-800 disabled:opacity-70"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="size-4" aria-hidden="true" />
                  Send Message
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
